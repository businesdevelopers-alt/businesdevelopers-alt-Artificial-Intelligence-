
import React, { useState } from 'react';
import { ApplicantProfile, ProjectEvaluationResult } from '../../types';
import { evaluateProjectIdea } from '../../services/geminiService';
import { playCelebrationSound, playPositiveSound } from '../../services/audioService';

interface ProjectEvaluationProps {
  profile: ApplicantProfile;
  onComplete: (result: ProjectEvaluationResult) => void;
}

export const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ profile, onComplete }) => {
  const [ideaText, setIdeaText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProjectEvaluationResult | null>(null);

  const handleAnalyze = async () => {
    if (!ideaText.trim() && inputMode === 'text') return;
    
    setIsAnalyzing(true);
    playPositiveSound();

    try {
      // Simulate file content if file mode (mock)
      const textToAnalyze = inputMode === 'file' 
        ? `مشروع في مجال ${profile.sector} بمرحلة ${profile.projectStage}. (تم رفع ملف تفصيلي للتحليل)` 
        : ideaText;

      const evalResult = await evaluateProjectIdea(textToAnalyze, profile);
      setResult(evalResult);
      playCelebrationSound();
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 15) return 'bg-green-500';
    if (score >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getClassColor = (cls: string) => {
    switch (cls) {
      case 'Green': return 'bg-green-100 text-green-800 border-green-200';
      case 'Yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-aero-in">
          
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">تقرير تحليل المشروع</h2>
              <p className="text-slate-400 text-sm">بيزنس ديفلوبرز - AI Evaluation</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold ${result.classification === 'Green' ? 'bg-green-500' : result.classification === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}>
              {result.totalScore}/100
            </div>
          </div>

          <div className="p-8">
            {/* Axis Scores */}
            <div className="space-y-4 mb-8">
              {[
                { label: 'وضوح الفكرة', score: result.clarity },
                { label: 'القيمة المقترحة', score: result.value },
                { label: 'التميز والابتكار', score: result.innovation },
                { label: 'الجدوى السوقية', score: result.market },
                { label: 'الجاهزية للتنفيذ', score: result.readiness },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{item.label}</span>
                    <span>{item.score}/20</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(item.score)}`} 
                      style={{ width: `${(item.score / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Opinion */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🧠</span>
                <h3 className="font-bold text-slate-800">رأي الذكاء الاصطناعي</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                "{result.aiOpinion}"
              </p>
            </div>

            {/* Classification & Actions */}
            <div className={`p-4 rounded-xl text-center mb-8 border ${getClassColor(result.classification)}`}>
               <p className="font-bold text-lg">
                 {result.classification === 'Green' ? 'المشروع جاهز للاحتضان ✅' : 
                  result.classification === 'Yellow' ? 'المشروع يحتاج إلى تطوير ⚠️' : 
                  'الفكرة غير واضحة أو غير مكتملة 🔴'}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                 onClick={() => alert("سيتم تحميل التقرير بصيغة PDF قريباً...")}
               >
                 تحميل التقرير PDF
               </button>
               <button 
                 className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                 onClick={() => onComplete(result)}
               >
                 متابعة للنتيجة النهائية
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 animate-fade-in-up">
           <h1 className="text-3xl font-extrabold text-slate-900 mb-2">تقييم الفكرة والمشروع</h1>
           <p className="text-slate-500">الخطوة الأخيرة: دعنا نحلل فكرتك عملياً باستخدام الذكاء الاصطناعي.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative animate-aero-in">
           {/* Tab Switcher */}
           <div className="flex border-b border-slate-100">
             <button 
               onClick={() => setInputMode('text')}
               className={`flex-1 py-4 font-bold text-sm transition-colors ${inputMode === 'text' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               ✏️ كتابة الفكرة
             </button>
             <button 
               onClick={() => setInputMode('file')}
               className={`flex-1 py-4 font-bold text-sm transition-colors ${inputMode === 'file' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               📎 رفع ملف (PDF/PPT)
             </button>
           </div>

           <div className="p-8">
             {inputMode === 'text' ? (
               <div className="space-y-4">
                 <label className="block text-sm font-bold text-slate-700">اشرح فكرتك بوضوح (المشكلة، الحل، السوق)</label>
                 <textarea 
                   className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-800"
                   placeholder="مشروعي هو منصة تهدف إلى..."
                   value={ideaText}
                   onChange={(e) => setIdeaText(e.target.value)}
                 ></textarea>
                 <p className="text-xs text-slate-400 text-left">{ideaText.length}/500 حرف</p>
               </div>
             ) : (
               <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-600">اضغط لرفع الملف أو اسحبه هنا</p>
                  <p className="text-xs text-slate-400 mt-2">PDF, DOCX, PPTX (Max 10MB)</p>
               </div>
             )}

             <div className="mt-8">
               <button 
                 onClick={handleAnalyze}
                 disabled={isAnalyzing || (inputMode === 'text' && !ideaText.trim())}
                 className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
               >
                 {isAnalyzing ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     <span>جاري تحليل الفكرة ذكياً...</span>
                   </>
                 ) : (
                   <>
                     <span>تحليل المشروع</span>
                     <svg className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                     </svg>
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
