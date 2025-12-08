import React from 'react';
import { LEVELS_CONFIG } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onPathFinder: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPathFinder }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">مسرعة الأعمال الذكية</span>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={onPathFinder}
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors hidden sm:block"
          >
            حدد مسارك
          </button>
          <button 
            onClick={onStart}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              حوّل فكرتك إلى <br/>
              <span className="text-blue-600">مشروع ناجح</span> <br/>
              بمساعدة الذكاء الاصطناعي
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              برنامج تدريبي تفاعلي مخصص لرواد الأعمال. احصل على توجيه فوري، وخطط عمل مخصصة، وشهادة معتمدة، كل ذلك مدعوم بأحدث تقنيات الـ AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                ابدأ رحلتك الآن مجاناً
              </button>
              <button 
                onClick={onPathFinder}
                className="px-8 py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-lg font-bold rounded-xl transition-colors border border-indigo-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                قيم مشروعك (حدد مسارك)
              </button>
            </div>
            
            <div className="pt-8 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2 space-x-reverse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                ))}
              </div>
              <p>انضم لأكثر من 1000+ رائد أعمال</p>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[3rem] transform rotate-3 scale-95 opacity-70"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md transform hover:scale-[1.02] transition-transform duration-500">
               {/* Mockup Content */}
               <div className="space-y-6">
                 <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                 <div className="h-32 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <span className="text-blue-600 font-semibold">تحليل نموذج العمل...</span>
                 </div>
                 <div className="space-y-3">
                   <div className="h-3 bg-gray-100 rounded w-full"></div>
                   <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                   <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                 </div>
                 <div className="flex gap-3 pt-4">
                   <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     ✓
                   </div>
                   <div className="flex-1">
                     <p className="font-bold text-gray-800">تقييم فوري</p>
                     <p className="text-xs text-gray-500">تحليل ذكي لنقاط القوة والضعف</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف تعمل المسرعة؟</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">منهجية علمية متدرجة تضمن لك بناء أساس متين لمشروعك</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ذكاء اصطناعي متقدم</h3>
                <p className="text-gray-600 leading-relaxed">توليد محتوى تعليمي وتمارين مخصصة لمجال مشروعك وتحدياته الخاصة بدقة عالية.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6 مستويات مكثفة</h3>
                <p className="text-gray-600 leading-relaxed">رحلة متكاملة تبدأ من الفكرة مروراً بنموذج العمل وحتى تجهيز عرض المستثمرين.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">شهادة إتمام معتمدة</h3>
                <p className="text-gray-600 leading-relaxed">احصل على شهادة تخرج مهنية تثبت جاهزية مشروعك للعرض على المستثمرين.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Levels Roadmap Section */}
        <div className="bg-white py-24 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">مستويات البرنامج</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4">خارطة طريق ريادة الأعمال</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                تم تصميم كل مستوى ليزودك بمهارة أساسية، مما يضمن بناء مشروعك خطوة بخطوة بشكل صحيح.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LEVELS_CONFIG.map((level, index) => (
                <div key={level.id} className="group relative">
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-colors duration-300
                        ${index % 2 === 0 ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}
                      `}>
                        {level.id}
                      </div>
                      <div className="h-1 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full w-0 group-hover:w-full transition-all duration-700 ease-out ${index % 2 === 0 ? 'bg-blue-200' : 'bg-indigo-200'}`}></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {level.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {level.description}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                        <span>أهداف التعلم</span>
                        <svg className="w-4 h-4 mr-2 transform rotate-180 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© 2024 مسرعة الأعمال الذكية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};