
import React from 'react';
import { LevelData, UserProfile, LEVELS_CONFIG } from '../types';
import { playCelebrationSound } from '../services/audioService';

interface DashboardProps {
  user: UserProfile;
  levels: LevelData[];
  onSelectLevel: (id: number) => void;
  onShowCertificate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, levels, onSelectLevel, onShowCertificate }) => {
  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
  const allCompleted = completedCount === levels.length;

  const handleCertificateClick = () => {
    playCelebrationSound();
    onShowCertificate();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white via-blue-50/20 to-white shadow-sm border-b border-blue-100 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{user.startupName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs font-medium text-gray-500">المستوى الحالي: {completedCount + 1}</p>
              </div>
            </div>
          </div>
          {allCompleted && (
             <button
             onClick={handleCertificateClick}
             className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-green-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
             استلام الشهادة
           </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Bar */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between text-sm font-bold text-gray-700 mb-3">
            <span>التقدم العام</span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: `${progress}%` }}
            >
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-20 w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level) => (
            <div 
              key={level.id}
              className={`
                relative rounded-2xl border-2 p-7 transition-all duration-300 flex flex-col
                ${level.isLocked 
                  ? 'border-gray-100 bg-gray-50/50 opacity-80 cursor-not-allowed' 
                  : 'border-white bg-white shadow-sm hover:shadow-xl cursor-pointer hover:border-blue-200 transform hover:-translate-y-1'
                }
                ${level.isCompleted ? 'border-green-100 bg-green-50/30' : ''}
              `}
              onClick={() => !level.isLocked && onSelectLevel(level.id)}
            >
              <div className="flex justify-between items-start mb-5">
                <span className={`
                  text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wide
                  ${level.isLocked ? 'bg-gray-200 text-gray-500' : 
                    level.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                `}>
                  المستوى {level.id}
                </span>
                {level.isCompleted && (
                  <div className="bg-green-100 p-1 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {level.isLocked && (
                   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                )}
              </div>
              
              <h3 className={`text-xl font-bold mb-3 ${level.isLocked ? 'text-gray-500' : 'text-gray-900'}`}>{level.title}</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-grow">{level.description}</p>
              
              {!level.isLocked && !level.isCompleted && (
                <button className="w-full mt-auto py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 group">
                  ابـدأ الآن
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
               {level.isCompleted && (
                <button className="w-full mt-auto py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold transition-colors">
                  مراجعة المحتوى
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
