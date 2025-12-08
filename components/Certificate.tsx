
import React from 'react';
import { UserProfile } from '../types';

interface CertificateProps {
  user: UserProfile;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <style>{`
        @keyframes cert-pop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-cert-pop {
          animation: cert-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 15px rgba(217, 119, 6, 0.2); }
          50% { box-shadow: 0 0 25px rgba(217, 119, 6, 0.4), 0 0 10px rgba(255, 255, 255, 0.2) inset; }
          100% { box-shadow: 0 0 15px rgba(217, 119, 6, 0.2); }
        }
        .animate-logo-glow {
          animation: glow-pulse 4s infinite ease-in-out;
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-shimmer-slide {
          animation: shimmer-slide 5s infinite ease-in-out;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-container, #certificate-container * {
            visibility: visible;
          }
          #certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
            background: #FEFDF5;
            z-index: 9999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        className="relative bg-[#FEFDF5] max-w-5xl w-full rounded-xl shadow-2xl overflow-hidden animate-cert-pop"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors z-30 no-print shadow-sm"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div id="certificate-container" className="relative p-2 md:p-4 bg-[#FEFDF5]">
          {/* Certificate Border Container */}
          <div className="relative border-[16px] border-double border-slate-900 p-8 md:p-12 text-center bg-[#FEFDF5] overflow-hidden min-h-[700px] flex flex-col justify-between shadow-inner">
            
            {/* Inner Gold Border */}
            <div className="absolute inset-2 border border-amber-600/40 pointer-events-none z-10"></div>
            <div className="absolute inset-3 border border-amber-600/20 pointer-events-none z-10"></div>

            {/* Subtle Animated Shimmer Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide"></div>
            </div>
            
            {/* Dynamic AI Background Pattern & Watermark */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0">
               <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <pattern id="ai-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                     <circle cx="10" cy="10" r="1.5" fill="#78350f" />
                     <circle cx="90" cy="90" r="1.5" fill="#78350f" />
                     <path d="M10 10 L 50 10 L 50 50 L 90 90" stroke="#b45309" strokeWidth="0.5" fill="none" opacity="0.5"/>
                     <path d="M90 10 L 50 10" stroke="#b45309" strokeWidth="0.5" fill="none" opacity="0.3"/>
                     <path d="M10 90 L 50 90 L 50 50" stroke="#b45309" strokeWidth="0.5" fill="none" opacity="0.3"/>
                   </pattern>
                 </defs>
                 
                 <rect width="100%" height="100%" fill="url(#ai-circuit)" />
                 
                 {/* Central AI Brain Watermark */}
                 <g transform="translate(50%, 50%)">
                   {/* Centered logic to simulate translate(50%, 50%) via percentage coords if possible, or simple paths */}
                 </g>
               </svg>
            </div>
            
            {/* Centered Large Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.04]">
               <svg viewBox="0 0 24 24" className="w-[500px] h-[500px] text-slate-900" fill="currentColor">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8zm-1 5h2v2h-2V9zm0 4h2v6h-2v-6z" /> 
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] border-slate-900 z-10">
                <div className="absolute top-2 left-2 w-full h-full border-t-[1px] border-l-[1px] border-amber-600/50"></div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] border-slate-900 z-10">
                <div className="absolute top-2 right-2 w-full h-full border-t-[1px] border-r-[1px] border-amber-600/50"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] border-slate-900 z-10">
                 <div className="absolute bottom-2 left-2 w-full h-full border-b-[1px] border-l-[1px] border-amber-600/50"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] border-slate-900 z-10">
                 <div className="absolute bottom-2 right-2 w-full h-full border-b-[1px] border-r-[1px] border-amber-600/50"></div>
            </div>

            {/* Logo/Header Section - Enhanced */}
            <div className="relative z-10 pt-6">
               <div className="relative mx-auto w-28 h-28 mb-4 rounded-full animate-logo-glow">
                 <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-amber-500/80 z-20 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 
                 {/* Decorative Wings/Ribbon hints */}
                 <div className="absolute top-1/2 -left-16 w-16 h-0.5 bg-slate-900 opacity-20"></div>
                 <div className="absolute top-1/2 -right-16 w-16 h-0.5 bg-slate-900 opacity-20"></div>
               </div>
               
               <h1 className="text-6xl font-serif font-bold text-slate-900 mb-2 tracking-wide drop-shadow-sm">
                 شهادة تخرج
               </h1>
               <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-3"></div>
               <p className="text-amber-800 font-bold tracking-[0.2em] text-sm uppercase">مسرعة الأعمال الذكية AI Accelerator</p>
            </div>

            <div className="my-10 space-y-6 relative z-10 flex-grow flex flex-col justify-center">
              <p className="text-xl text-slate-500 font-serif italic">يشهد هذا المستند بأن</p>
              
              <div className="relative inline-block py-2">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-900 font-serif px-8 pb-4 relative z-10">
                  {user.name}
                </h2>
                {/* Decorative underline */}
                <div className="h-[2px] bg-amber-200 w-2/3 mx-auto relative mt-2">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rotate-45 border-2 border-[#FEFDF5]"></div>
                </div>
              </div>

              <p className="text-lg text-slate-600 font-serif italic max-w-3xl mx-auto leading-relaxed">
                قد أتم بنجاح البرنامج التدريبي المتكامل لتأسيس وريادة الأعمال، وتمكن من بناء وتطوير مشروع
              </p>
              
              <div className="relative mt-2">
                 <h3 className="relative text-3xl md:text-4xl font-bold text-slate-800 py-2 px-10 inline-block mx-auto border-b border-slate-200">
                    "{user.startupName}"
                 </h3>
              </div>
              
              <p className="text-slate-500 max-w-4xl mx-auto mt-6 text-sm leading-relaxed font-serif">
                تم منح هذه الشهادة بعد اجتياز <span className="font-bold text-slate-800">6 مستويات تفاعلية مكثفة</span> تشمل التحقق من الفكرة، نموذج العمل التجاري، تحليل السوق، بناء المنتج الأولي، التخطيط المالي، ومهارات العرض والتمويل.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end mt-12 px-8 md:px-16 relative z-10 pb-6">
              <div className="text-center mb-8 md:mb-0">
                <p className="text-xs text-amber-800/60 mb-2 uppercase tracking-widest font-bold">التاريخ Date</p>
                <div className="w-48 border-b border-slate-300 mb-2 pb-2 text-lg font-medium font-serif text-slate-800">
                  {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="w-32 h-32 -mb-4 flex-shrink-0 mx-auto md:mx-0 order-last md:order-none relative">
                 {/* Golden Seal - Enhanced Classic */}
                 <div className="w-full h-full relative flex items-center justify-center">
                   
                   <div className="w-full h-full border-[3px] border-amber-600 rounded-full flex items-center justify-center relative bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg">
                     <div className="absolute inset-1 border border-dashed border-amber-800/30 rounded-full"></div>
                     <div className="text-center z-10">
                       <svg className="w-6 h-6 mx-auto text-amber-700 mb-1" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                       <span className="block text-slate-900 font-serif font-bold text-lg leading-none">AI</span>
                       <span className="block text-amber-800 font-bold text-[8px] uppercase tracking-wider mt-0.5">Accelerator</span>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="text-center mt-8 md:mt-0">
                 <p className="text-xs text-amber-800/60 mb-2 uppercase tracking-widest font-bold">المدير التنفيذي Director</p>
                 <div className="w-48 border-b border-slate-300 mb-2 pb-2 relative h-10 flex items-end justify-center">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiPjxwYXRoIGQ9Ik0xMCw1MCBDNDAsMTAgNjAsNTAgOTAsMjAgQzEyMCwwIDE1MCw0MCAxOTAsMTAiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+PC9zdmc+" alt="Signature" className="h-10 w-auto opacity-70 grayscale" />
                 </div>
              </div>
            </div>
            
            {/* Bottom ID */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[9px] text-slate-300 font-mono tracking-widest">
                CERTIFICATE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bg-stone-50 p-6 flex justify-center border-t border-stone-200 no-print">
          <button 
            onClick={() => window.print()} 
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg shadow-lg flex items-center gap-3 font-bold transition-transform transform hover:-translate-y-1 hover:shadow-xl ring-2 ring-slate-800 ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            طباعة الشهادة (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
    