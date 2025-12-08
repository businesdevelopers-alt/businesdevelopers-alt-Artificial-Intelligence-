
import React, { useState } from 'react';
import { ApplicantProfile, ProjectStageType, TechLevelType, SECTORS } from '../../types';

interface WelcomeStepProps {
  onNext: (profile: ApplicantProfile) => void;
  onAdminLogin: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onAdminLogin }) => {
  const [profile, setProfile] = useState<ApplicantProfile>({
    codeName: '',
    projectStage: 'Idea',
    sector: 'Tech',
    goal: '',
    techLevel: 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.codeName.trim()) {
      onNext(profile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/30 blur-3xl"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 max-w-4xl w-full relative z-10 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Info */}
          <div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              مرحباً بك في نظام الترشيح <br />
              <span className="text-blue-600">بيزنس ديفلوبرز</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              لنبدأ بتقييم جاهزيتك الريادية بخطوات ذكية وبسيطة. هذا النظام سيساعدك على اكتشاف نقاط قوتك وتحديد مسارك الصحيح.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">1</span>
                <span>تسجيل البيانات</span>
              </div>
              <div className="w-0.5 h-4 bg-slate-200 mr-4"></div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">2</span>
                <span>اختبار الشخصية</span>
              </div>
               <div className="w-0.5 h-4 bg-slate-200 mr-4"></div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">3</span>
                <span>التقييم التحليلي</span>
              </div>
            </div>

            <button onClick={onAdminLogin} className="mt-12 text-xs text-slate-300 hover:text-slate-500 underline">
              دخول الإدارة
            </button>
          </div>

          {/* Right Side: Form */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الرمزي / الاسم</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: الرائد المبتكر"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={profile.codeName}
                  onChange={e => setProfile({...profile, codeName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نوع المتقدم</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Idea', 'Prototype', 'Product'] as ProjectStageType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProfile({...profile, projectStage: type})}
                      className={`py-2 px-1 rounded-lg text-sm font-bold border transition-all ${
                        profile.projectStage === type 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type === 'Idea' ? '💡 فكرة' : type === 'Prototype' ? '🧩 نموذج' : '🚀 منتج'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">المجال</label>
                    <select 
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                      value={profile.sector}
                      onChange={e => setProfile({...profile, sector: e.target.value})}
                    >
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">التقنية</label>
                    <select 
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                      value={profile.techLevel}
                      onChange={e => setProfile({...profile, techLevel: e.target.value as TechLevelType})}
                    >
                      <option value="Low">مبتدئ</option>
                      <option value="Medium">متوسط</option>
                      <option value="High">متقدم</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">هدفك من الانضمام</label>
                <input 
                  type="text" 
                  placeholder="مثال: الحصول على استثمار..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                  value={profile.goal}
                  onChange={e => setProfile({...profile, goal: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mt-4"
              >
                ابدأ التقييم الآن
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
