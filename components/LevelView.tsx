
import React, { useState, useEffect, useRef } from 'react';
import { LevelData, UserProfile, Question } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

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
  const profileRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Sticky Global Header in LevelView */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-2 -mr-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex flex-col">
                <h2 className="font-black text-slate-900 text-sm md:text-base leading-none mb-1">{level.title}</h2>
                <div className="flex items-center gap-2">
                   <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                   </div>
                   <span className="text-[9px] font-black text-blue-600 uppercase">إنجاز المستوى: {Math.round(overallProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Stepper (Desktop Mini) */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                {[1, 2, 3].map((s) => {
                  const status = getStepStatus(s);
                  return (
                    <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${status === 'completed' ? 'bg-green-500' : status === 'current' ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-100' : 'bg-slate-200'}`}></div>
                  );
                })}
              </div>

              {/* Shared Profile Dropdown */}
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
                    <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      العودة للوحة التحكم
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Global Reading Progress Indicator (Only for Step.LEARN) */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent">
             <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        {/* Content steps remain same... */}
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
            </div>
            <p className="text-slate-400 font-bold animate-pulse">جاري إعداد المادة التعليمية الخاصة بمشروعك...</p>
          </div>
        )}

        {step === Step.LEARN && (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-8 border-b border-blue-100/50 flex flex-col md:flex-row md:items-center gap-4">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 font-black">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">المادة التعليمية</h3>
                   <p className="text-slate-500 text-sm font-bold">محتوى مخصص لقطاع {user.industry}</p>
                 </div>
               </div>
               <div className="md:mr-auto flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl border border-blue-100">
                 <span className="text-[10px] font-black text-blue-700 uppercase">قراءة: {Math.round(readingProgress)}%</span>
                 <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
                 </div>
               </div>
            </div>
            <div className="p-8 md:p-12">
              <article className="prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-8 prose-p:font-medium">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </article>
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => { playPositiveSound(); setStep(Step.EXERCISE); window.scrollTo(0, 0); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                  <span>الانتقال للتمرين العملي</span>
                  <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Following steps simplified for length... (they remain fully functional) */}
        {step === Step.EXERCISE && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="bg-amber-50 px-8 py-8 border-b border-amber-100 flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl text-amber-600 shadow-sm"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">تطبيق عملي</h3>
                <p className="text-amber-700 text-sm font-bold">حول المعرفة إلى واقع لمشروعك</p>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <p className="text-xl text-slate-800 mb-8 font-bold leading-relaxed">{exercisePrompt}</p>
              <textarea
                className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none min-h-[250px] mb-8 text-lg font-medium shadow-inner"
                placeholder="اكتب مخرجات العمل هنا..."
                value={exerciseAnswer}
                onChange={(e) => setExerciseAnswer(e.target.value)}
                disabled={!!exerciseFeedback}
              />
              {exerciseFeedback && (
                <div className={`mb-8 p-8 rounded-[2rem] border-2 animate-fade-in ${exerciseFeedback.includes("مقبولة") ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-400 font-bold">توليد الأسئلة التقارير...</p>
          </div>
        )}

        {step === Step.QUIZ && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
             <div className="bg-slate-900 px-8 py-8 text-white flex justify-between items-center">
               <h3 className="text-2xl font-black">اختبار نهائي للمستوى</h3>
               <span className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase">{quizQuestions.length} أسئلة</span>
             </div>
             <div className="p-8 md:p-12 space-y-10">
               {quizQuestions.map((q, qIdx) => (
                 <div key={q.id} className="animate-fade-in-up" style={{ animationDelay: `${qIdx * 0.1}s` }}>
                   <div className="flex items-start gap-4 mb-6">
                     <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm shrink-0">{qIdx + 1}</span>
                     <p className="font-black text-lg text-slate-800 pt-1">{q.text}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-12">
                     {q.options.map((opt, optIdx) => {
                       const isSelected = quizAnswers[qIdx] === optIdx;
                       const isSubmitted = quizScore !== null;
                       const isCorrect = q.correctIndex === optIdx;
                       return (
                        <label key={optIdx} className={`relative flex items-center p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${isSubmitted ? (isCorrect ? 'bg-green-50 border-green-500' : isSelected ? 'bg-rose-50 border-rose-500 opacity-50' : 'bg-slate-50 border-slate-100 opacity-50') : isSelected ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-50' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                          <input type="radio" name={`q-${q.id}`} className="hidden" disabled={isSubmitted} onChange={() => { const na = [...quizAnswers]; na[qIdx] = optIdx; setQuizAnswers(na); }} />
                          <span className="font-bold text-slate-700">{opt}</span>
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
                    <button onClick={handleQuizSubmit} disabled={quizAnswers.includes(-1)} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 transition-all">تسليم الإجابات</button>
                  ) : quizScore >= 2 && (
                    <div className="flex items-center text-green-600 font-black animate-pulse">جاري الانتقال لصفحة النجاح...</div>
                  )}
               </div>
             </div>
          </div>
        )}

        {step === Step.COMPLETED && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[4rem] p-12 text-center shadow-2xl animate-fade-in-up border border-slate-100">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce">
               <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-5xl font-black text-slate-900 mb-4">عمل رائع!</h2>
             <p className="text-xl font-bold text-slate-500 mb-12 max-w-md">لقد أكملت المستوى "{level.title}" بنجاح وتجاوزت الاختبار. أنت تقترب من التخرج!</p>
             <button onClick={() => { playPositiveSound(); onComplete(); }} className="bg-slate-900 hover:bg-black text-white px-14 py-5 rounded-[2rem] font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95">العودة للوحة التحكم</button>
           </div>
        )}
      </div>
    </div>
  );
};
