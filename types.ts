
export enum FiltrationStage {
  WELCOME = 'WELCOME',
  PERSONALITY_TEST = 'PERSONALITY_TEST',
  ANALYTICAL_TEST = 'ANALYTICAL_TEST',
  ASSESSMENT_RESULT = 'ASSESSMENT_RESULT', // The Radar Chart view
  FINAL_REPORT = 'FINAL_REPORT',
  DEVELOPMENT_PLAN = 'DEVELOPMENT_PLAN',
  PROGRESS_DASHBOARD = 'PROGRESS_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string; // Tech, Marketing, Services, Industrial
  goal: string;
  techLevel: TechLevelType;
}

export interface UserProfile {
  name: string;
  startupName: string;
  startupDescription: string;
  industry: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: {
    text: string;
    style: string; // e.g., 'Visionary', 'Operational', 'Balanced'
  }[];
}

export interface AnalyticalQuestion {
  id: number;
  text: string;
  type: 'choice' | 'analysis' | 'math';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: string[];
  correctIndex: number;
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface FinalResult {
  score: number; // 0-100
  leadershipStyle: string; // e.g., "Balanced Leader"
  metrics: RadarMetrics;
  isQualified: boolean;
  badges: Badge[];
  recommendation: string;
}

// Config for visual consistency
export const SECTORS = [
  { value: 'Tech', label: 'تقني وتكنولوجي' },
  { value: 'Marketing', label: 'تسويق وإعلام' },
  { value: 'Services', label: 'خدمي ولوجستي' },
  { value: 'Industrial', label: 'صناعي وإنتاجي' }
];

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق من الفكرة', description: 'تأكد من أن فكرتك تحل مشكلة حقيقية وتستحق الاستثمار.', isCompleted: false, isLocked: false },
  { id: 2, title: 'نموذج العمل التجاري', description: 'ابنِ خطة عمل واضحة تحدد مصادر الدخل وقنوات التوزيع.', isCompleted: false, isLocked: true },
  { id: 3, title: 'تحليل السوق والمنافسين', description: 'افهم حجم السوق ومن هم منافسوك وكيف تتفوق عليهم.', isCompleted: false, isLocked: true },
  { id: 4, title: 'المنتج الأولي (MVP)', description: 'حدد الميزات الأساسية لمنتجك لإطلاقه بأقل التكاليف.', isCompleted: false, isLocked: true },
  { id: 5, title: 'الخطة المالية', description: 'توقع التكاليف والإيرادات وحساب نقطة التعادل.', isCompleted: false, isLocked: true },
  { id: 6, title: 'عرض الاستثمار', description: 'جهز عرضاً تقديمياً مقنعاً لجذب المستثمرين.', isCompleted: false, isLocked: true },
];
