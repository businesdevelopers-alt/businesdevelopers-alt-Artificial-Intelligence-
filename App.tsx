
import React, { useState } from 'react';
import { Registration } from './components/Registration';
import { Dashboard } from './components/Dashboard';
import { LevelView } from './components/LevelView';
import { Certificate } from './components/Certificate';
import { LandingPage } from './components/LandingPage';
import { PathFinder } from './components/PathFinder';
import { UserProfile, LevelData, AppStage, LEVELS_CONFIG } from './types';

function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<LevelData[]>(
    LEVELS_CONFIG.map((l, index) => ({
      ...l,
      isLocked: index !== 0, // Unlock first level only
      isCompleted: false
    }))
  );
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

  const handleStart = () => {
    setStage(AppStage.REGISTRATION);
  };

  const handleRegister = (profile: UserProfile) => {
    setUser(profile);
    setStage(AppStage.DASHBOARD);
  };

  const handleSelectLevel = (id: number) => {
    setCurrentLevelId(id);
    setStage(AppStage.LEVEL_CONTENT);
  };

  const handleLevelComplete = () => {
    if (currentLevelId === null) return;

    const newLevels = levels.map(l => {
      if (l.id === currentLevelId) {
        return { ...l, isCompleted: true };
      }
      // Unlock next level
      if (l.id === currentLevelId + 1) {
        return { ...l, isLocked: false };
      }
      return l;
    });

    setLevels(newLevels);
    setStage(AppStage.DASHBOARD);
    setCurrentLevelId(null);
  };

  const handleShowCertificate = () => {
    setStage(AppStage.CERTIFICATE);
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
      {stage === AppStage.LANDING && (
        <LandingPage 
          onStart={handleStart} 
          onPathFinder={() => setStage(AppStage.PATH_FINDER)}
        />
      )}

      {stage === AppStage.PATH_FINDER && (
        <PathFinder 
          onApproved={handleStart} 
          onBack={() => setStage(AppStage.LANDING)} 
        />
      )}

      {stage === AppStage.REGISTRATION && (
        <Registration onRegister={handleRegister} />
      )}

      {stage === AppStage.DASHBOARD && user && (
        <Dashboard 
          user={user} 
          levels={levels} 
          onSelectLevel={handleSelectLevel}
          onShowCertificate={handleShowCertificate}
        />
      )}

      {stage === AppStage.LEVEL_CONTENT && user && currentLevelId && (
        <LevelView
          level={levels.find(l => l.id === currentLevelId)!}
          user={user}
          onComplete={handleLevelComplete}
          onBack={() => setStage(AppStage.DASHBOARD)}
        />
      )}

      {stage === AppStage.CERTIFICATE && user && (
        <Certificate 
          user={user} 
          onClose={() => setStage(AppStage.DASHBOARD)} 
        />
      )}
    </div>
  );
}

export default App;
