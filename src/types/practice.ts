import { PaperId } from "./curriculum";
import { MistakeCategory, Question, QuestionOptionId } from "./question";

export type PracticeMode =
  | "topic"
  | "subtopic"
  | "mixed"
  | "weak_topics"
  | "formula_quiz"
  | "previously_incorrect"
  | "diagnostic";

export interface StudentAnswerSubmission {
  questionId: string;
  selectedOptionId: QuestionOptionId | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  mistakeCategory?: MistakeCategory;
  userConfidence?: "sure" | "doubtful" | "guess";
}

export interface PracticeSession {
  id: string;
  userId: string;
  mode: PracticeMode;
  paperId?: PaperId;
  topicId?: string;
  topicTitleTe?: string;
  isTimed: boolean;
  timeLimitSeconds?: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  questions: Question[];
  submissions: Record<string, StudentAnswerSubmission>;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface PracticeResultSummary {
  sessionId: string;
  mode: PracticeMode;
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  unattemptedQuestions: number;
  accuracyPercentage: number;
  totalTimeSpentSeconds: number;
  averageTimePerQuestionSeconds: number;
  topicBreakdown: {
    topicId: string;
    topicTitleTe: string;
    total: number;
    correct: number;
    accuracyPercentage: number;
  }[];
  mistakeBreakdown: Record<MistakeCategory, number>;
  improvementRecommendationsTe: string[];
}
