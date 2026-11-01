import { PaperId } from "./curriculum";

export type QuestionOptionId = "A" | "B" | "C" | "D";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type ValidationStatus =
  | "draft"
  | "validation_pending"
  | "validation_passed"
  | "review_required"
  | "approved"
  | "rejected"
  | "archived";

export type QuestionSourceType =
  | "official_pyq"
  | "standard_degree_textbook"
  | "tgpsc_standard_model"
  | "reviewed_ai_generated"
  | "current_affairs_editorial";

export type MistakeCategory =
  | "concept_misunderstanding"
  | "formula_confusion"
  | "calculation_mistake"
  | "question_reading_mistake"
  | "time_management"
  | "unclassified";

export interface QuestionOption {
  id: QuestionOptionId;
  textTe: string;
  textEn: string;
  mathLatex?: string;
}

export interface NumericalMetadata {
  isNumerical: boolean;
  formulaUsed?: string;
  calculatedValue?: number;
  tolerance?: number;
  roundingRule?: string;
  independentValidationPassed: boolean;
  validatorLog?: string;
}

export interface Question {
  id: string;
  paperId: PaperId;
  topicId: string;
  subtopicId?: string;
  questionNumber?: number;
  questionTextTe: string;
  questionTextEn: string;
  questionMathLatex?: string;
  options: QuestionOption[];
  correctOptionId: QuestionOptionId;
  explanationTe: string;
  explanationEn?: string;
  relevantFormulaLatex?: string;
  difficulty: QuestionDifficulty;
  estimatedSolveSeconds: number;
  sourceType: QuestionSourceType;
  sourceReference: string;
  year?: number;
  numericalMetadata?: NumericalMetadata;
  validationStatus: ValidationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilter {
  paperId?: PaperId;
  topicId?: string;
  difficulty?: QuestionDifficulty;
  sourceType?: QuestionSourceType;
  validationStatus?: ValidationStatus;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}
