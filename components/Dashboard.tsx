
import React, { useState, useRef, useEffect } from 'react';
import { LevelData, UserProfile } from '../types';
import { playCelebrationSound } from '../services/audioService';

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

  // Handle clicking outside the profile dropdown to close it
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Right Side: Logo & Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight text-gray-900 leading-none">AI Accelerator</h1>
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Dashboard</span>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex md:mr-10 md:space-x-8 md:space-x-reverse items-center">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 h-full flex items-center px-1 font-bold text-sm">
                  لوحة التحكم
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent h-full flex items-center px-1 font-medium text-sm transition-all">
                  المسار التعليمي
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent h-full flex items-center px-1 font-medium text-sm transition-all">
                  الموارد
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent h-full flex items-center px-1 font-medium text-sm transition-all">
                  مجتمع الرواد
                </a>
              </div>
            </div>

            {/* Left Side: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              {allCompleted && (
                <button
                  onClick={handleCertificateClick}
                  className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-green-200 transition-all transform hover:-translate-y-0.5 items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>استلام الشهادة</span>
                </button>
              )}

              {/* Notification Bell */}
              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification Badge */}
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none group p-1 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{user.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 truncate max-w-[120px]">{user.startupName}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
                    {user.name.charAt(0)}
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-3 w-64 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transform opacity-100 scale-100 transition-all animate-fade-in-up origin-top-left z-50">
                    <div className="px-4 py-4 bg-gray-50/50 rounded-t-2xl">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">المشروع الحالي</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.startupName}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        {user.industry}
                      </span>
                    </div>
                    <div className="py-2">
                      <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 gap-3 group transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        الملف الشخصي
                      </a>
                      <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 gap-3 group transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        إعدادات الحساب
                      </a>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={onLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 gap-3 group transition-colors"
                      >
                        <svg className="w-5 h-5 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
           <h2 className="text-3xl font-extrabold text-gray-900 mb-2">مرحباً، {user.name} 👋</h2>
           <p className="text-gray-500">تابع تقدم مشروعك "{user.startupName}" وأكمل المهام المطلوبة للانتقال للمستوى التالي.</p>
        </div>

        {/* Progress Bar Section */}
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center text-sm font-bold text-gray-700 mb-4 relative z-10">
            <div className="mb-2 md:mb-0">
               <span className="text-lg text-gray-900 block mb-1">التقدم العام للمشروع</span>
               <span className="text-gray-400 font-normal">تم إنجاز {completedCount} من أصل {levels.length} مستويات</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg text-blue-700">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
               <span className="text-lg">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner relative z-10">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: `${progress}%` }}
            >
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-30 w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-between items-center">
           <div className="relative w-full md:w-96">
              <input
                 type="text"
                 placeholder="ابحث عن مستوى أو موضوع..."
                 className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3.5 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
           </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLevels.length > 0 ? (
            filteredLevels.map((level) => (
              <div 
                key={level.id}
                className={`
                  relative rounded-3xl p-8 transition-all duration-300 flex flex-col group
                  ${level.isLocked 
                    ? 'border border-gray-100 bg-gray-50 opacity-75 grayscale-[0.5]' 
                    : 'border border-white bg-white shadow-sm hover:shadow-xl hover:scale-[1.02] ring-1 ring-gray-100 hover:ring-blue-100'
                  }
                  ${level.isCompleted ? 'bg-gradient-to-br from-white to-green-50/50 border-green-100' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`
                    text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide shadow-sm
                    ${level.isLocked ? 'bg-gray-200 text-gray-500' : 
                      level.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                  `}>
                    المستوى {String(level.id).padStart(2, '0')}
                  </span>
                  
                  {level.isCompleted && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {level.isLocked && (
                     <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                       <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                       </svg>
                     </div>
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${level.isLocked ? 'text-gray-500' : 'text-gray-900 group-hover:text-blue-700 transition-colors'}`}>
                  {level.title}
                </h3>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-grow line-clamp-3">
                  {level.description}
                </p>
                
                <div className="mt-auto">
                  {!level.isLocked && !level.isCompleted && (
                    <button 
                      onClick={() => onSelectLevel(level.id)}
                      className="w-full py-3.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      ابدأ التدريب
                      <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  {level.isCompleted && (
                    <button className="w-full py-3.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold transition-colors cursor-default border border-green-100 flex items-center justify-center gap-2">
                      <span>مكتمل</span>
                    </button>
                  )}
                  {level.isLocked && (
                    <button disabled className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      مغلق حالياً
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 border-dashed">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <p className="text-lg font-bold text-gray-800">لا توجد نتائج مطابقة</p>
               <p className="text-sm">حاول البحث بكلمات مختلفة أو تحقق من الإملاء.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
