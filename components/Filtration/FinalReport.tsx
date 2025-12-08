
import React from 'react';
import { ApplicantProfile, FinalResult } from '../../types';

interface FinalReportProps {
  profile: ApplicantProfile;
  result: FinalResult;
  onStartJourney: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ profile, result, onStartJourney }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden border border-slate-200" id="report-print">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-bl-[100px] opacity-20"></div>
          <div className="relative z-10 flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold mb-2">تقرير الترشيح الرسمي</h1>
                <p className="text-slate-400 uppercase tracking-widest text-sm">حاضنة بيزنس ديفلوبرز</p>
             </div>
             <div className="text-left">
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  <span className="block text-xs text-slate-300">الحالة</span>
                  <span className="block font-bold text-green-400">مؤهل للاحتضان ✅</span>
                </div>
             </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12">
           {/* Candidate Info */}
           <div className="grid grid-cols-2 gap-6 mb-10 border-b border-slate-100 pb-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">المتقدم</p>
                <p className="font-bold text-slate-900 text-lg">{profile.codeName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">المرحلة</p>
                <p className="font-bold text-slate-900 text-lg">
                    {profile.projectStage === 'Idea' ? 'مرحلة الفكرة' : profile.projectStage === 'Prototype' ? 'نموذج أولي' : 'منتج فعلي'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">نمط القيادة</p>
                <p className="font-bold text-blue-600">{result.leadershipStyle}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">النتيجة العامة</p>
                <p className="font-bold text-slate-900 text-xl">{result.score}/100</p>
              </div>
           </div>

           {/* Badges */}
           <div className="mb-10">
              <h3 className="font-bold text-slate-800 mb-4 text-lg border-r-4 border-blue-600 pr-3">الشارات والأوسمة المكتسبة</h3>
              <div className="flex flex-wrap gap-4">
                 {result.badges.map((badge) => (
                   <div key={badge.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl pr-4 shadow-sm">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{badge.name}</p>
                      </div>
                   </div>
                 ))}
                 <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-3 rounded-xl pr-4 shadow-sm">
                    <div className="text-2xl">🏅</div>
                    <div>
                      <p className="font-bold text-yellow-800 text-sm">وسام التأهل الرسمي</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Recommendation */}
           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-10">
              <h3 className="font-bold text-blue-900 mb-2">توصية اللجنة</h3>
              <p className="text-blue-800/80 leading-relaxed text-sm">
                {result.recommendation}
              </p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 flex flex-col md:flex-row gap-4 border-t border-slate-200">
           <button onClick={() => window.print()} className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
             حمّل التقرير (PDF)
           </button>
           <button 
             onClick={onStartJourney}
             className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
           >
             <span>ابدأ رحلتك في الحاضنة</span>
             <span>🚀</span>
           </button>
        </div>
      </div>
    </div>
  );
};
