
import React, { useState } from 'react';
import { FiltrationStage, ApplicantProfile, FinalResult, Badge, UserProfile, LevelData, LEVELS_CONFIG, ProjectEvaluationResult } from './types';
import { WelcomeStep } from './components/Filtration/WelcomeStep';
import { PersonalityTest } from './components/Filtration/PersonalityTest';
import { AnalyticalTest } from './components/Filtration/AnalyticalTest';
import { ProjectEvaluation } from './components/Filtration/ProjectEvaluation';
import { AssessmentResult } from './components/Filtration/AssessmentResult';
import { FinalReport } from './components/Filtration/FinalReport';
import { DevelopmentPlan } from './components/Filtration/DevelopmentPlan';
import { AdminDashboard } from './components/Filtration/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { PathFinder } from './components/PathFinder';
import { Dashboard } from './components/Dashboard';
import { LevelView } from './components/LevelView';
import { Certificate } from './components/Certificate';

function App() {
  // Navigation State
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  
  // Filtration Data
  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile | null>(null);
  const [leadershipStyle, setLeadershipStyle] = useState<string>('');
  const [analyticalScore, setAnalyticalScore] = useState<number>(0);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  // Dashboard Data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<LevelData[]>(LEVELS_CONFIG);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);

  // --- HANDLERS ---

  // Landing
  const handleStartFiltration = () => setStage(FiltrationStage.WELCOME);
  const handleStartPathFinder = () => setStage(FiltrationStage.PATH_FINDER);

  // Filtration Flow
  const handleWelcomeNext = (data: ApplicantProfile) => {
    setApplicantProfile(data);
    setStage(FiltrationStage.PERSONALITY_TEST);
  };

  const handlePersonalityComplete = (style: string) => {
    setLeadershipStyle(style);
    setStage(FiltrationStage.ANALYTICAL_TEST);
  };

  const handleAnalyticalComplete = (score: number) => {
    setAnalyticalScore(score);
    // Proceed to Project Evaluation instead of final result immediately
    setStage(FiltrationStage.PROJECT_EVALUATION);
  };

  const handleProjectEvaluationComplete = (projectEval: ProjectEvaluationResult) => {
    if (!applicantProfile) return;

    // CALCULATE FINAL RESULT LOGIC
    // Base readiness on profile inputs
    const techBase = applicantProfile.techLevel === 'High' ? 90 : applicantProfile.techLevel === 'Medium' ? 70 : 40;
    const readinessBase = applicantProfile.projectStage === 'Product' ? 95 : applicantProfile.projectStage === 'Prototype' ? 75 : 50;
    
    // Personality Impact
    const personalityScore = 85; 
    const ethicsScore = Math.random() > 0.5 ? 90 : 70; 

    // Weighted Scores
    // Strategy is derived from Analytical Score + Project Evaluation Clarity
    const strategyScore = (analyticalScore + projectEval.clarity * 5) / 2;
    
    // Readiness is derived from Project Stage + Project Evaluation Readiness
    const finalReadiness = (readinessBase + projectEval.readiness * 5) / 2;

    const metrics = {
      readiness: finalReadiness,
      analysis: analyticalScore, 
      tech: techBase,
      personality: personalityScore,
      strategy: strategyScore,
      ethics: ethicsScore
    };

    // Calculate Total Average Score
    const totalScore = Math.round(
      (metrics.readiness + metrics.analysis + metrics.tech + metrics.personality + metrics.strategy + metrics.ethics) / 6
    );

    // Qualification Logic: Must have decent total score AND Project Evaluation shouldn't be 'Red'
    const isQualified = totalScore >= 70 && projectEval.classification !== 'Red';

    const badges: Badge[] = [];
    if (leadershipStyle.includes('Balanced')) badges.push({ id: '1', name: 'وسام القيادة المتوازنة', icon: '⚖️', color: 'blue' });
    if (ethicsScore > 85) badges.push({ id: '2', name: 'القائد الأخلاقي', icon: '🌿', color: 'green' });
    if (techBase > 80) badges.push({ id: '3', name: 'عقلية تقنية', icon: '💻', color: 'indigo' });
    if (projectEval.classification === 'Green') badges.push({ id: '4', name: 'مشروع متميز', icon: '🚀', color: 'yellow' });

    setFinalResult({
      score: totalScore,
      leadershipStyle,
      metrics,
      projectEval, // Store the project evaluation details
      isQualified,
      badges,
      recommendation: isQualified 
        ? "بناءً على الأداء المتميز في المحاور التحليلية وتقييم المشروع، نوصي بقبول المشروع في مسار النمو المتسارع." 
        : "المشروع واعد ولكن يحتاج إلى نضج أكبر في الجانب التحليلي أو تطوير نموذج العمل قبل الدخول في دورة استثمارية مكثفة."
    });

    setStage(FiltrationStage.ASSESSMENT_RESULT);
  };

  const handleResultContinue = () => {
    if (finalResult?.isQualified) {
      setStage(FiltrationStage.FINAL_REPORT);
    } else {
      setStage(FiltrationStage.DEVELOPMENT_PLAN);
    }
  };

  const handleStartIncubatorJourney = () => {
    if (!applicantProfile) return;
    
    // Convert ApplicantProfile to UserProfile for the Dashboard
    const newUser: UserProfile = {
      name: applicantProfile.codeName,
      startupName: 'مشروعي الناشئ', // Default or ask user
      startupDescription: applicantProfile.goal,
      industry: applicantProfile.sector
    };
    setUserProfile(newUser);
    setStage(FiltrationStage.DASHBOARD);
  };

  const handleRestartFiltration = () => {
    setStage(FiltrationStage.WELCOME);
    setApplicantProfile(null);
  };

  // Dashboard Flow
  const handleLevelSelect = (id: number) => {
    setActiveLevelId(id);
    setStage(FiltrationStage.LEVEL_VIEW);
  };

  const handleLevelComplete = (id: number) => {
    const updatedLevels = levels.map(level => {
      if (level.id === id) return { ...level, isCompleted: true };
      if (level.id === id + 1) return { ...level, isLocked: false };
      return level;
    });
    setLevels(updatedLevels);
    setActiveLevelId(null);
    setStage(FiltrationStage.DASHBOARD);
  };

  return (
    <div className="font-sans antialiased text-slate-900">
      {/* Landing & Filtration Flow */}
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={handleStartFiltration} 
          onPathFinder={handleStartPathFinder}
        />
      )}

      {stage === FiltrationStage.PATH_FINDER && (
        <PathFinder 
          onApproved={handleStartFiltration}
          onBack={() => setStage(FiltrationStage.LANDING)}
        />
      )}

      {stage === FiltrationStage.WELCOME && (
        <WelcomeStep 
          onNext={handleWelcomeNext} 
          onAdminLogin={() => setStage(FiltrationStage.ADMIN_DASHBOARD)}
        />
      )}

      {stage === FiltrationStage.PERSONALITY_TEST && (
        <PersonalityTest onComplete={handlePersonalityComplete} />
      )}

      {stage === FiltrationStage.ANALYTICAL_TEST && applicantProfile && (
        <AnalyticalTest profile={applicantProfile} onComplete={handleAnalyticalComplete} />
      )}

      {stage === FiltrationStage.PROJECT_EVALUATION && applicantProfile && (
        <ProjectEvaluation 
          profile={applicantProfile}
          onComplete={handleProjectEvaluationComplete}
        />
      )}

      {stage === FiltrationStage.ASSESSMENT_RESULT && finalResult && (
        <AssessmentResult result={finalResult} onContinue={handleResultContinue} />
      )}

      {stage === FiltrationStage.FINAL_REPORT && applicantProfile && finalResult && (
        <FinalReport 
          profile={applicantProfile} 
          result={finalResult} 
          onStartJourney={handleStartIncubatorJourney}
        />
      )}

      {stage === FiltrationStage.DEVELOPMENT_PLAN && applicantProfile && finalResult && (
        <DevelopmentPlan 
          profile={applicantProfile} 
          result={finalResult} 
          onRestart={handleRestartFiltration} 
        />
      )}

      {stage === FiltrationStage.ADMIN_DASHBOARD && (
        <AdminDashboard onBack={() => setStage(FiltrationStage.LANDING)} />
      )}

      {/* Main Incubator App Flow */}
      {stage === FiltrationStage.DASHBOARD && userProfile && (
        <Dashboard 
          user={userProfile}
          levels={levels}
          onSelectLevel={handleLevelSelect}
          onShowCertificate={() => setStage(FiltrationStage.CERTIFICATE)}
          onLogout={() => setStage(FiltrationStage.LANDING)}
        />
      )}

      {stage === FiltrationStage.LEVEL_VIEW && userProfile && activeLevelId && (
        <LevelView 
          level={levels.find(l => l.id === activeLevelId)!}
          user={userProfile}
          onComplete={() => handleLevelComplete(activeLevelId)}
          onBack={() => setStage(FiltrationStage.DASHBOARD)}
        />
      )}

      {stage === FiltrationStage.CERTIFICATE && userProfile && (
        <Certificate 
          user={userProfile} 
          onClose={() => setStage(FiltrationStage.DASHBOARD)} 
        />
      )}
    </div>
  );
}

export default App;
