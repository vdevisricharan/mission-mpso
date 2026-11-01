export type PaperId = "paper_1" | "paper_2";

export interface FormulaItem {
  id: string;
  nameTe: string;
  nameEn: string;
  latex: string;
  symbolExplanationsTe: { symbol: string; explanation: string }[];
  usageTe: string;
  sampleCalculationTe?: string;
}

export interface WorkedExample {
  id: string;
  titleTe: string;
  titleEn: string;
  problemTe: string;
  problemEn?: string;
  givenDataTe: string[];
  stepByStepSolutionTe: { stepNumber: number; description: string; mathLatex?: string }[];
  finalAnswerTe: string;
  keyTakeawayTe: string;
}

export interface LessonContent {
  id: string;
  topicId: string;
  subtopicId?: string;
  titleTe: string;
  titleEn: string;
  estimatedMinutes: number;
  overviewTe: string;
  overviewEn?: string;
  keyConceptsTe: { concept: string; explanation: string; englishTerm?: string }[];
  formulas?: FormulaItem[];
  workedExamples?: WorkedExample[];
  commonMistakesTe?: { mistake: string; correction: string; why: string }[];
  summaryPointsTe: string[];
  officialSyllabusMapping: string;
  sourceReferences: string[];
  lastVerifiedDate: string;
}

export interface SyllabusTopic {
  id: string;
  paperId: PaperId;
  unitNumber: number;
  unitTitleTe: string;
  unitTitleEn: string;
  topicNumber: number;
  titleTe: string;
  titleEn: string;
  descriptionTe: string;
  descriptionEn: string;
  officialWordingEn: string;
  subtopics: {
    id: string;
    titleTe: string;
    titleEn: string;
  }[];
  difficulty: "easy" | "medium" | "hard";
  estimatedStudyHours: number;
  weightageEstimatedQuestions: number; // typical range in 150 Q paper
  isVerifiedOfficial: boolean;
}

export interface StudentTopicProgress {
  topicId: string;
  paperId: PaperId;
  lessonsCompleted: number;
  totalLessons: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyPercentage: number;
  masteryLevel: "not_assessed" | "beginning" | "developing" | "practising" | "proficient" | "strong";
  lastStudiedAt: string | null;
  lastRevisedAt: string | null;
  needsRevision: boolean;
  nextRevisionDate: string | null;
}
