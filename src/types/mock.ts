import { PaperId } from "./curriculum";
import { Question, QuestionOptionId } from "./question";

export type MockType = "paper_1_full" | "paper_2_full" | "combined_full" | "mini_mock";
export type QuestionStatus =
  | "not_visited"
  | "unanswered"
  | "answered"
  | "marked_for_review"
  | "answered_and_marked";

export interface MockQuestionState {
  questionId: string;
  questionNumber: number;
  paperId: PaperId;
  selectedOptionId: QuestionOptionId | null;
  status: QuestionStatus;
  timeSpentSeconds: number;
}

export interface MockExamSession {
  id: string;
  userId: string;
  mockType: MockType;
  titleTe: string;
  titleEn: string;
  totalQuestions: number;
  totalDurationMinutes: number;
  totalMarks: number;
  negativeMarkingEnabled: boolean; // default false as unconfirmed in 07/G/ES/2026
  penaltyPerWrongAnswer: number; // 0 unless confirmed
  startedAt: string;
  expiresAt: string; // Server authoritative timestamp
  submittedAt?: string;
  status: "in_progress" | "submitted" | "auto_submitted_expired";
  questions: Question[];
  questionStates: Record<string, MockQuestionState>;
  currentQuestionIndex: number;
}

export interface MockExamReport {
  sessionId: string;
  userId: string;
  mockType: MockType;
  titleTe: string;
  completedAt: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  markedForReviewCount: number;
  scoreObtained: number;
  maximumMarks: number;
  percentageScore: number;
  totalTimeSpentSeconds: number;
  paperBreakdown: {
    paperId: PaperId;
    paperNameTe: string;
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
    maxScore: number;
    accuracyPercentage: number;
  }[];
  topicPerformance: {
    topicId: string;
    topicNameTe: string;
    paperId: PaperId;
    totalQuestions: number;
    correctAnswers: number;
    accuracyPercentage: number;
    statusTe: "బలం" | "మెరుగుపడాలి" | "సంతృప్తికరం";
  }[];
  qualifyingStatus: {
    ocQualifies: boolean; // >= 40%
    bcQualifies: boolean; // >= 35%
    scStPhQualifies: boolean; // >= 30%
    disclaimerTe: string;
  };
  keyTakeawaysTe: string[];
}
