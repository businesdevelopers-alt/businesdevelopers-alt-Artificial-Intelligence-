
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Target, Lightbulb, BookOpen, ChevronLeft, ArrowLeft, Palette, Home, Zap, Edit3, CheckCircle, Lock } from 'lucide-react';
import { LevelData, UserProfile, Question } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface LevelTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
}

const THEMES: LevelTheme[] = [
  { 
    id: 'blue', name: 'أزرق احترافي', 
    primary: 'bg-blue-600', secondary: 'bg-blue-50', accent: 'text-blue-600', 
    bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-700', ring: 'ring-blue-100'
  },
  { 
    id: 'indigo', name: 'إنديجو عصري', 
    primary: 'bg-indigo-600', secondary: 'bg-indigo-50', accent: 'text-indigo-600', 
    bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-100'
  },
  { 
    id: 'emerald', name: 'أخضر نمو', 
    primary: 'bg-emerald-600', secondary: 'bg-emerald-50', accent: 'text-emerald-600', 
    bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-100'
  },
  { 
    id: 'rose', name: 'وردي طموح', 
    primary: 'bg-rose-600', secondary: 'bg-rose-50', accent: 'text-rose-600', 
    bg: 'bg-rose-50/50', border: 'border-rose-100', text: 'text-rose-700', ring: 'ring-rose-100'
  }
];

interface LevelViewProps {
  level: LevelData;
  user: UserProfile;
  onComplete: () => void;
  onBack: () => void;
}

enum Step {
  LOADING_CONTENT,
  LEARN,
  EXERCISE,
  LOADING_QUIZ,
  QUIZ,
  COMPLETED
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, onComplete, onBack }) => {
  const [step, setStep] = useState<Step>(Step.LOADING_CONTENT);
  const [content, setContent] = useState<string>('');
  const [exercisePrompt, setExercisePrompt] = useState<string>('');
  const [exerciseAnswer, setExerciseAnswer] = useState<string>('');
  const [exerciseFeedback, setExerciseFeedback] = useState<string>('');
  const [isExerciseSubmitting, setIsExerciseSubmitting] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<LevelTheme>(THEMES[0]);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'back' | 'complete' | null>(null);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await generateLevelMaterial(level.id, level.title, user);
        setContent(data.content);
        setExercisePrompt(data.exercise);
        setStep(Step.LEARN);
      } catch (err) {
        console.error(err);
      }
    };
    loadContent();
  }, [level.id, level.title, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (step !== Step.LEARN) {
        setReadingProgress(0);
        return;
      }
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight <= 0) {
        setReadingProgress(100);
      } else {
        const progress = (currentScroll / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExerciseSubmit = async () => {
    if (!exerciseAnswer.trim()) return;
    setIsExerciseSubmitting(true);
    try {
      const result = await evaluateExerciseResponse(exercisePrompt, exerciseAnswer);
      setExerciseFeedback(result.feedback);
      if (result.passed) playPositiveSound();
      else playErrorSound();
    } catch (e) {
      setExerciseFeedback("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExerciseSubmitting(false);
    }
  };

  const startQuiz = async () => {
    setStep(Step.LOADING_QUIZ);
    try {
      const questions = await generateLevelQuiz(level.id, level.title, user);
      setQuizQuestions(questions);
      setQuizAnswers(new Array(questions.length).fill(-1));
      setStep(Step.QUIZ);
    } catch (e) {
      console.error(e);
      setStep(Step.LEARN); 
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (q.correctIndex === quizAnswers[idx]) score++;
    });
    setQuizScore(score);
    const passingScore = Math.ceil(quizQuestions.length * 0.6); 
    if (score >= passingScore) {
       playCelebrationSound();
       setTimeout(() => setStep(Step.COMPLETED), 3000); 
    } else {
      playErrorSound();
    }
  };

  const initiateExit = (action: 'back' | 'complete') => {
    setPendingAction(action);
    setShowExitModal(true);
  };

  const finalizeExit = () => {
    setShowExitModal(false);
    if (pendingAction === 'complete') onComplete();
    else onBack();
  };

  const getStepStatus = (targetStep: number) => {
    let current = 0;
    if (step === Step.LEARN) current = 1;
    if (step === Step.EXERCISE) current = 2;
    if (step === Step.LOADING_QUIZ || step === Step.QUIZ) current = 3;
    if (step === Step.COMPLETED) current = 4;
    if (current > targetStep) return 'completed';
    if (current === targetStep) return 'current';
    return 'pending';
  };

  const overallProgress = (() => {
    switch(step) {
      case Step.LOADING_CONTENT: return 0;
      case Step.LEARN: return 10 + (readingProgress * 0.23); 
      case Step.EXERCISE: return 33 + (exerciseFeedback ? 33 : 15); 
      case Step.LOADING_QUIZ: return 70;
      case Step.QUIZ: return 75 + (quizAnswers.filter(a => a !== -1).length / (quizQuestions.length || 1) * 20);
      case Step.COMPLETED: return 100;
      default: return 0;
    }
  })();

  return (
    <div className={`min-h-screen ${activeTheme.bg} flex flex-col font-sans transition-colors duration-500`}>
      <style>{`
        @keyframes progress-shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-progress-shimmer {
          animation: progress-shimmer 2s infinite linear;
        }
        @keyframes progress-glow {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 10px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 20px currentColor; }
        }
        .animate-progress-glow {
          animation: progress-glow 2s infinite ease-in-out;
        }
      `}</style>

      {/* Sticky Global Header with Theme Customizer */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => initiateExit('back')} 
                className={`p-2 -mr-2 text-slate-400 hover:${activeTheme.accent} hover:${activeTheme.secondary} rounded-full transition-all`}
              >
                <ArrowLeft className="w-6 h-6 transform rotate-180" />
              </button>
              <div className="flex flex-col">
                <h2 className="font-black text-slate-900 text-sm md:text-base leading-none mb-1">{level.title}</h2>
                <div className="flex items-center gap-2">
                   <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`${activeTheme.primary} h-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) relative`} 
                        style={{ width: `${overallProgress}%` }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shimmer"></div>
                      </div>
                   </div>
                   <span className={`text-[9px] font-black ${activeTheme.text} uppercase`}>إنجاز المستوى: {Math.round(overallProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Customizer Switcher */}
              <div className="relative" ref={themeRef}>
                <button 
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all active:scale-95`}
                >
                   <Palette className="w-5 h-5" />
                </button>
                {isThemeMenuOpen && (
                  <div className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 animate-fade-in-up origin-top-left z-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">مظهر الواجهة</p>
                    <div className="grid grid-cols-2 gap-2">
                       {THEMES.map(t => (
                         <button 
                           key={t.id}
                           onClick={() => { setActiveTheme(t); setIsThemeMenuOpen(false); }}
                           className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${activeTheme.id === t.id ? 'border-slate-800 bg-slate-50' : 'border-slate-50 hover:bg-slate-50'}`}
                         >
                            <div className={`w-6 h-6 rounded-full ${t.primary} shadow-inner`}></div>
                            <span className="text-[9px] font-bold text-slate-600">{t.name.split(' ')[0]}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                {[1, 2, 3].map((s) => {
                  const status = getStepStatus(s);
                  return (
                    <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${status === 'completed' ? 'bg-green-500' : status === 'current' ? `${activeTheme.primary} scale-125 shadow-lg ${activeTheme.ring}` : 'bg-slate-200'}`}></div>
                  );
                })}
              </div>

              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-md">
                   {user.name.charAt(0)}
                </button>
                {isProfileOpen && (
                  <div className="absolute left-0 mt-3 w-64 rounded-[2rem] shadow-2xl bg-white border border-slate-100 p-2 animate-fade-in-up origin-top-left z-50">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] mb-2">
                       <h4 className="font-black text-slate-900 text-sm mb-1">{user.startupName}</h4>
                       <p className="text-[10px] font-bold text-slate-400">{user.name}</p>
                    </div>
                    <button onClick={() => initiateExit('back')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <Home className="w-5 h-5 text-slate-400" />
                      العودة للوحة التحكم
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Main Progress Indicator with Pulse Edge */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100/30">
             <div 
              className={`${activeTheme.primary} h-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) relative shadow-lg overflow-hidden`} 
              style={{ width: `${overallProgress}%` }}
             >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer"></div>
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${activeTheme.primary} animate-progress-glow`}></div>
             </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className={`absolute inset-0 border-4 ${activeTheme.id === 'blue' ? 'border-blue-600' : activeTheme.id === 'indigo' ? 'border-indigo-600' : activeTheme.id === 'emerald' ? 'border-emerald-600' : 'border-rose-600'} rounded-full border-t-transparent animate-spin`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className={`w-8 h-8 ${activeTheme.accent} animate-pulse`} />
              </div>
            </div>
            <p className="text-slate-400 font-bold animate-pulse">جاري إعداد المادة التعليمية الخاصة بمشروعك...</p>
          </div>
        )}

        {step === Step.LEARN && (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className={`bg-gradient-to-r from-slate-50 to-white px-8 py-8 border-b ${activeTheme.border}/50 flex flex-col md:flex-row md:items-center gap-4`}>
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center ${activeTheme.accent} font-black border ${activeTheme.border}`}>
                   <BookOpen className="w-7 h-7" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">المادة التعليمية</h3>
                   <p className="text-slate-500 text-sm font-bold">محتوى مخصص لقطاع {user.industry}</p>
                 </div>
               </div>
               <div className={`md:mr-auto flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border ${activeTheme.border} shadow-sm`}>
                 <span className={`text-[10px] font-black ${activeTheme.text} uppercase`}>قراءة: {Math.round(readingProgress)}%</span>
                 <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div 
                      className={`${activeTheme.primary} h-full transition-all duration-300 relative`} 
                      style={{ width: `${readingProgress}%` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer"></div>
                    </div>
                 </div>
               </div>
            </div>
            <div className="p-8 md:p-12">
              {/* Detailed Level Info Section */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md hover:bg-white group">
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-amber-500 transition-colors">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">الوقت المتوقع</span>
                  </div>
                  <p className="text-lg font-black text-slate-800 leading-tight">{level.estimatedTime || '30 دقيقة'}</p>
                </div>

                <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md hover:bg-white group">
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                     <Target className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">الأهداف التعليمية</span>
                  </div>
                  <ul className="space-y-1">
                    {(level.objectives || []).map((obj, i) => (
                      <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md hover:bg-white group">
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">المفاهيم الأساسية</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(level.keyConcepts || []).map((concept, i) => (
                      <span key={concept} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <article className="prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-8 prose-p:font-medium">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </article>
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => { playPositiveSound(); setStep(Step.EXERCISE); window.scrollTo(0, 0); }}
                  className={`${activeTheme.primary} hover:opacity-90 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group`}
                >
                  <span>الانتقال للتمرين العملي</span>
                  <ChevronLeft className="w-5 h-5 transform rotate-180 group-hover:translate-x-[-4px] transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ... Other steps logic remains consistent with the enhanced progress feel ... */}
        {step === Step.EXERCISE && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="bg-amber-50 px-8 py-8 border-b border-amber-100 flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl text-amber-600 shadow-sm border border-amber-200"><Edit3 className="w-7 h-7" /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">تطبيق عملي</h3>
                <p className="text-amber-700 text-sm font-bold">حول المعرفة إلى واقع لمشروعك</p>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <p className="text-xl text-slate-800 mb-8 font-bold leading-relaxed">{exercisePrompt}</p>
              <textarea
                className={`w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:bg-white focus:ring-4 ${activeTheme.ring} outline-none min-h-[250px] mb-8 text-lg font-medium shadow-inner transition-all`}
                placeholder="اكتب مخرجات العمل هنا..."
                value={exerciseAnswer}
                onChange={(e) => setExerciseAnswer(e.target.value)}
                disabled={!!exerciseFeedback}
              />
              {exerciseFeedback && (
                <div className={`mb-8 p-8 rounded-[2rem] border-2 animate-fade-in ${exerciseFeedback.includes("مقبولة") ? 'bg-green-50 border-green-200 text-green-800' : `${activeTheme.secondary} ${activeTheme.border} ${activeTheme.text}`}`}>
                  <h4 className="font-black mb-2 flex items-center gap-2">🤖 مراجعة المستشار الذكي:</h4>
                  <p className="font-medium leading-relaxed">{exerciseFeedback}</p>
                </div>
              )}
              <div className="flex justify-end">
                {!exerciseFeedback ? (
                  <button onClick={handleExerciseSubmit} disabled={isExerciseSubmitting || !exerciseAnswer.trim()} className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 disabled:opacity-50">
                    {isExerciseSubmitting ? 'جاري التحليل...' : 'إرسال للمراجعة'}
                  </button>
                ) : (
                  <button onClick={() => { playPositiveSound(); startQuiz(); window.scrollTo(0,0); }} className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl animate-pulse">الانتقال للاختبار</button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === Step.LOADING_QUIZ && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className={`animate-spin rounded-full h-12 w-12 border-4 ${activeTheme.accent.replace('text', 'border')} border-t-transparent`}></div>
            <p className="text-slate-400 font-bold">توليد الأسئلة والتقارير...</p>
          </div>
        )}

        {step === Step.QUIZ && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
             <div className="bg-slate-900 px-8 py-8 text-white flex justify-between items-center">
               <h3 className="text-2xl font-black">اختبار نهائي للمستوى</h3>
               <span className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{quizQuestions.length} أسئلة</span>
             </div>
             <div className="p-8 md:p-12 space-y-10">
               {quizQuestions.map((q, qIdx) => (
                 <div key={q.id} className="animate-fade-in-up" style={{ animationDelay: `${qIdx * 0.1}s` }}>
                   <div className="flex items-start gap-4 mb-6">
                     <span className={`w-8 h-8 ${activeTheme.secondary} rounded-lg flex items-center justify-center ${activeTheme.text} font-black text-sm shrink-0`}>{qIdx + 1}</span>
                     <p className="font-black text-lg text-slate-800 pt-1">{q.text}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-12">
                     {q.options.map((opt, optIdx) => {
                       const isSelected = quizAnswers[qIdx] === optIdx;
                       const isSubmitted = quizScore !== null;
                       const isCorrect = q.correctIndex === optIdx;
                       return (
                        <label key={optIdx} className={`relative flex items-center p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${isSubmitted ? (isCorrect ? 'bg-green-50 border-green-500' : isSelected ? 'bg-rose-50 border-rose-500 opacity-50' : 'bg-slate-50 border-slate-100 opacity-50') : isSelected ? `${activeTheme.secondary} ${activeTheme.border.replace('100', '500')} shadow-lg` : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                          <input type="radio" name={`q-${q.id}`} className="hidden" disabled={isSubmitted} onChange={() => { const na = [...quizAnswers]; na[qIdx] = optIdx; setQuizAnswers(na); }} />
                          <span className={`font-bold ${isSelected ? activeTheme.text : 'text-slate-700'}`}>{opt}</span>
                        </label>
                       );
                     })}
                   </div>
                 </div>
               ))}
               <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
                  {quizScore !== null ? (
                    <div className="text-2xl font-black text-slate-900">النتيجة النهائية: <span className={quizScore >= 2 ? 'text-green-600' : 'text-rose-600'}>{quizScore} / {quizQuestions.length}</span></div>
                  ) : (
                    <p className="text-slate-400 font-bold text-sm">أجب على جميع الأسئلة لتتمكن من التسليم.</p>
                  )}
                  {quizScore === null ? (
                    <button onClick={handleQuizSubmit} disabled={quizAnswers.includes(-1)} className={`${activeTheme.primary} hover:opacity-90 disabled:opacity-50 text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl transition-all`}>تسليم الإجابات</button>
                  ) : quizScore >= 2 && (
                    <div className={`flex items-center ${activeTheme.text} font-black animate-pulse`}>جاري الانتقال لصفحة النجاح...</div>
                  )}
               </div>
             </div>
          </div>
        )}

        {step === Step.COMPLETED && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[4rem] p-12 text-center shadow-2xl animate-fade-in-up border border-slate-100">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce">
               <CheckCircle className="w-12 h-12 text-green-600" />
             </div>
             <h2 className="text-5xl font-black text-slate-900 mb-4">عمل رائع!</h2>
             <p className="text-xl font-bold text-slate-500 mb-12 max-w-md">لقد أكملت المستوى "{level.title}" بنجاح وتجاوزت الاختبار. أنت تقترب من التخرج!</p>
             <button 
               onClick={() => initiateExit('complete')} 
               className="bg-slate-900 hover:bg-black text-white px-14 py-5 rounded-[2rem] font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95"
             >
               العودة للوحة التحكم
             </button>
           </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up">
            <div className={`w-20 h-20 ${activeTheme.secondary} rounded-full flex items-center justify-center mb-8 mx-auto`}>
               <Lock className={`w-10 h-10 ${activeTheme.accent}`} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4">تأكيد الإجراء</h3>
            <p className="text-slate-500 text-center mb-10 font-bold leading-relaxed">
              {pendingAction === 'complete' 
                ? 'هل أنت متأكد من رغبتك في إنهاء المستوى والعودة للوحة التحكم؟ سيتم حفظ تقدمك تلقائياً.' 
                : 'هل أنت متأكد من رغبتك في مغادرة المستوى والعودة؟ قد تفقد بعض التقدم غير المحفوظ في التمارين.'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowExitModal(false)}
                className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={finalizeExit}
                className={`py-4 ${activeTheme.primary} text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-lg shadow-slate-200`}
              >
                نعم، متأكد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
