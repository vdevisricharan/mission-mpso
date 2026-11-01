import { PaperId } from "./curriculum";
import { MistakeCategory, Question, QuestionOptionId } from "./question";

export type MasteryLevel =
  | "not_assessed"
  | "beginning"
  | "developing"
  | "practising"
  | "proficient"
  | "strong";

export interface TopicMasteryRecord {
  topicId: string;
  paperId: PaperId;
  topicTitleTe: string;
  topicTitleEn: string;
  masteryLevel: MasteryLevel;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  lastAssessedAt: string | null;
  minimumEvidenceThresholdMet: boolean; // e.g. requires at least 5 independent questions
  recommendationTe: string;
}

export interface MistakeBookItem {
  id: string;
  userId: string;
  questionId: string;
  question: Question;
  studentAnswer: QuestionOptionId | null;
  mistakeCategory: MistakeCategory;
  firstFailedAt: string;
  lastAttemptedAt: string;
  reviewCount: number;
  isResolved: boolean;
  bookmarked: boolean;
  studentNotes?: string;
  aiExplanationTe?: string;
}

export interface RevisionItem {
  id: string;
  userId: string;
  itemType: "question" | "formula" | "concept";
  referenceId: string; // questionId or formulaId
  topicId: string;
  topicTitleTe: string;
  paperId: PaperId;
  intervalDays: number; // 1, 3, 7, 14, 30
  repetitionStage: number;
  dueDate: string; // ISO date string YYYY-MM-DD
  lastReviewedAt: string | null;
  isCompleted: boolean;
  confidenceScore?: number; // 1 to 5
}

export type StudyTaskType =
  | "learn_statistics"
  | "learn_general_studies"
  | "practice_questions"
  | "revision_spaced"
  | "mistake_review"
  | "mock_exam";

export interface DailyStudyTask {
  id: string;
  taskType: StudyTaskType;
  titleTe: string;
  titleEn: string;
  topicId?: string;
  paperId?: PaperId;
  durationMinutes: number;
  isCompleted: boolean;
  completedAt?: string;
  priority: "high" | "medium" | "low";
  reasonTe: string;
  actionUrl: string;
}

export interface DailyStudyPlan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  dayGreetingTe: string;
  summaryMessageTe: string;
  tasks: DailyStudyTask[];
  totalTargetMinutes: number;
  completedMinutes: number;
  isRecalculated: boolean;
  recalculationReasonTe?: string;
}
