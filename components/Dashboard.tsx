
import React, { useState, useRef, useEffect } from 'react';
import { LevelData, UserProfile } from '../types';
import { playCelebrationSound, playPositiveSound } from '../services/audioService';

interface DashboardProps {
  user: UserProfile;
  levels: LevelData[];
  onSelectLevel: (id: number) => void;
  onShowCertificate: () => void;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, levels, onSelectLevel, onShowCertificate, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  
  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
  const allCompleted = completedCount === levels.length;

  const handleCertificateClick = () => {
    playCelebrationSound();
    onShowCertificate();
  };

  const handleCardClick = (level: LevelData) => {
    if (!level.isLocked) {
      playPositiveSound();
      onSelectLevel(level.id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLevels = levels.filter(level => 
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-black text-lg text-slate-900 leading-none">بيزنس ديفلوبرز</h1>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">AI Accelerator</span>
                </div>
              </div>
              
              {/* Main Navigation */}
              <nav className="hidden md:flex gap-6 items-center">
                <a href="#" className="text-sm font-black text-blue-600 border-b-2 border-blue-600 py-7">لوحة التحكم</a>
                <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">المسار التدريبي</a>
                <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">المصادر</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {allCompleted && (
                <button
                  onClick={handleCertificateClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-green-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  الشهادة
                </button>
              )}

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="text-left hidden lg:block mr-2">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{user.startupName}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black shadow-md shadow-slate-200 transition-transform group-active:scale-95">
                    {user.name.charAt(0)}
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-3 w-72 rounded-[2rem] shadow-2xl bg-white border border-slate-100 p-2 animate-fade-in-up origin-top-left z-50">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] mb-2">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">مشروعك الحالي</p>
                       <h4 className="font-black text-slate-900 mb-1">{user.startupName}</h4>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                         {user.industry}
                       </span>
                    </div>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        الملف الشخصي
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        الإعدادات
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                      >
                        <svg className="w-5 h-5 text-rose-400 group-hover:text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Welcome Section Combined for better UX */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
           <div className="animate-fade-in-up">
             <h2 className="text-4xl font-black text-slate-900 mb-2">أهلاً بك، {user.name.split(' ')[0]} 👋</h2>
             <p className="text-slate-500 font-bold">تابع تقدم مشروعك <span className="text-blue-600">"{user.startupName}"</span> نحو الجاهزية الاستثمارية.</p>
           </div>
           
           <div className="w-full lg:w-96 relative group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <input
                 type="text"
                 placeholder="ابحث عن مستوى أو موضوع..."
                 className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
           </div>
        </div>

        {/* Global Progress Card */}
        <div className="mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">التقدم الكلي للبرنامج</p>
              <h3 className="text-3xl font-black text-slate-900">{Math.round(progress)}% مكتمل</h3>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-400">المستويات المكتملة</span>
              <p className="text-lg font-black text-slate-800">{completedCount} من {levels.length}</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative z-10 shadow-inner">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
              style={{ width: `${progress}%` }}
            >
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-20 w-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLevels.length > 0 ? (
            filteredLevels.map((level, idx) => (
              <div 
                key={level.id}
                onClick={() => handleCardClick(level)}
                className={`
                  relative rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col group animate-fade-in-up
                  ${level.isLocked 
                    ? 'bg-slate-50 border border-slate-100 opacity-80 grayscale cursor-not-allowed' 
                    : 'bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer active:scale-95'
                  }
                  ${level.isCompleted ? 'ring-2 ring-green-100' : ''}
                `}
                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all
                    ${level.isLocked ? 'bg-slate-200 text-slate-400' : 
                      level.isCompleted ? 'bg-green-100 text-green-600 shadow-lg shadow-green-50' : 'bg-blue-50 text-blue-600 shadow-lg shadow-blue-50'}
                  `}>
                    {level.id}
                  </div>
                  
                  {level.isCompleted ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100 animate-bounce-short">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  ) : level.isLocked && (
                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     </div>
                  )}
                </div>
                
                <h3 className={`text-2xl font-black mb-3 transition-colors ${level.isLocked ? 'text-slate-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                  {level.title}
                </h3>
                <p className="text-sm font-bold text-slate-400 mb-10 leading-relaxed flex-grow line-clamp-3">
                  {level.description}
                </p>
                
                <div className="mt-auto">
                  {!level.isLocked && !level.isCompleted && (
                    <div 
                      className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-3 group-hover:bg-blue-600 shadow-xl shadow-slate-100 group-hover:shadow-blue-100"
                    >
                      ابدأ التدريب الآن
                      <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  )}
                  {level.isCompleted && (
                    <div className="w-full py-4 bg-green-50 text-green-700 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-2 border-2 border-green-100">
                      <span>مستوى مكتمل بنجاح</span>
                    </div>
                  )}
                  {level.isLocked && (
                    <div className="w-full py-4 bg-slate-100 text-slate-300 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-2">
                      سيفتح عند إتمام ما قبله
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center animate-fade-in-up">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl opacity-50">🔍</div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد نتائج بحث</h3>
               <p className="text-slate-500 font-bold mb-8">لم نجد أي مستويات تطابق عبارة البحث "{searchTerm}"</p>
               <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 font-black hover:underline"
               >
                 عرض جميع المستويات
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
