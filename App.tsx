
import React, { useState } from 'react';
import { FiltrationStage, ApplicantProfile, FinalResult, Badge } from './types';
import { WelcomeStep } from './components/Filtration/WelcomeStep';
import { PersonalityTest } from './components/Filtration/PersonalityTest';
import { AnalyticalTest } from './components/Filtration/AnalyticalTest';
import { AssessmentResult } from './components/Filtration/AssessmentResult';
import { FinalReport } from './components/Filtration/FinalReport';
import { DevelopmentPlan } from './components/Filtration/DevelopmentPlan';
import { AdminDashboard } from './components/Filtration/AdminDashboard';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.WELCOME);
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [leadershipStyle, setLeadershipStyle] = useState<string>('');
  const [analyticalScore, setAnalyticalScore] = useState<number>(0);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  // Flow Handlers
  const handleWelcomeNext = (data: ApplicantProfile) => {
    setProfile(data);
    setStage(FiltrationStage.PERSONALITY_TEST);
  };

  const handlePersonalityComplete = (style: string) => {
    setLeadershipStyle(style);
    setStage(FiltrationStage.ANALYTICAL_TEST);
  };

  const handleAnalyticalComplete = (score: number) => {
    setAnalyticalScore(score);
    
    // CALCULATE FINAL RESULT LOGIC
    if (!profile) return;

    // Simulate metrics based on inputs (In a real app, this would be more complex)
    const techBase = profile.techLevel === 'High' ? 90 : profile.techLevel === 'Medium' ? 70 : 40;
    const readinessBase = profile.projectStage === 'Product' ? 95 : profile.projectStage === 'Prototype' ? 75 : 50;
    
    // Personality Impact
    const personalityScore = 85; // Assumed high from completion
    const ethicsScore = Math.random() > 0.5 ? 90 : 70; // Randomized for demo

    const metrics = {
      readiness: readinessBase,
      analysis: score, // The quiz score percentage
      tech: techBase,
      personality: personalityScore,
      strategy: (readinessBase + score) / 2,
      ethics: ethicsScore
    };

    const totalScore = Math.round(
      (metrics.readiness + metrics.analysis + metrics.tech + metrics.personality + metrics.strategy + metrics.ethics) / 6
    );

    const isQualified = totalScore >= 70;

    const badges: Badge[] = [];
    if (leadershipStyle.includes('Balanced')) badges.push({ id: '1', name: 'وسام القيادة المتوازنة', icon: '⚖️', color: 'blue' });
    if (ethicsScore > 85) badges.push({ id: '2', name: 'القائد الأخلاقي', icon: '🌿', color: 'green' });
    if (techBase > 80) badges.push({ id: '3', name: 'عقلية تقنية', icon: '💻', color: 'indigo' });

    setFinalResult({
      score: totalScore,
      leadershipStyle,
      metrics,
      isQualified,
      badges,
      recommendation: isQualified 
        ? "بناءً على الأداء المتميز في المحاور التحليلية والجاهزية، نوصي بقبول المشروع في مسار النمو المتسارع." 
        : "المشروع واعد ولكن يحتاج إلى نضج أكبر في الجانب التحليلي والتقني قبل الدخول في دورة استثمارية مكثفة."
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

  return (
    <div className="font-sans antialiased text-slate-900">
      {stage === FiltrationStage.WELCOME && (
        <WelcomeStep 
          onNext={handleWelcomeNext} 
          onAdminLogin={() => setStage(FiltrationStage.ADMIN_DASHBOARD)}
        />
      )}

      {stage === FiltrationStage.PERSONALITY_TEST && (
        <PersonalityTest onComplete={handlePersonalityComplete} />
      )}

      {stage === FiltrationStage.ANALYTICAL_TEST && profile && (
        <AnalyticalTest profile={profile} onComplete={handleAnalyticalComplete} />
      )}

      {stage === FiltrationStage.ASSESSMENT_RESULT && finalResult && (
        <AssessmentResult result={finalResult} onContinue={handleResultContinue} />
      )}

      {stage === FiltrationStage.FINAL_REPORT && profile && finalResult && (
        <FinalReport profile={profile} result={finalResult} />
      )}

      {stage === FiltrationStage.DEVELOPMENT_PLAN && profile && finalResult && (
        <DevelopmentPlan profile={profile} result={finalResult} onRestart={() => setStage(FiltrationStage.WELCOME)} />
      )}

      {stage === FiltrationStage.ADMIN_DASHBOARD && (
        <AdminDashboard onBack={() => setStage(FiltrationStage.WELCOME)} />
      )}
    </div>
  );
}

export default App;
