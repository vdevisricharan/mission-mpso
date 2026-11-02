/**
 * MISSION MPSO — Question Intelligence & Content Ingestion Engine Types
 * Exam: TGPSC MPSO / ASO (Notification 07/G/ES/2026)
 */

import { PaperId } from "./curriculum";
import { QuestionDifficulty, QuestionOptionId, QuestionOption, NumericalMetadata } from "./question";

export type SourceTrustTier = 1 | 2 | 3 | 4 | 5;

export type SourceCategory =
  | "official_commission"       // Tier 1: TGPSC / TSPSC official site & archives
  | "state_government"          // Tier 2: Telangana DES, Socio-Economic Outlook, MoSPI, RBI
  | "academic_oer"              // Tier 3: Open educational textbooks, university OER
  | "related_government_exam"   // Tier 4: Statistical Officer, JSO, UPSC ISS (strict provenance)
  | "third_party_reference";    // Tier 5: Monitored educational citations (no bulk copyrighted copy)

export type LicenseType =
  | "official_tgpsc_public_notice"
  | "government_open_data"
  | "creative_commons_by"
  | "creative_commons_by_sa"
  | "academic_fair_use_oer"
  | "original_mission_mpso_copyright"
  | "restricted_metadata_only";

export type ReusePermission =
  | "full_question_reproduction"
  | "metadata_and_citation_only"
  | "original_derivation_permitted";

export interface ContentSource {
  id: string;
  name: string;
  url: string;
  sourceCategory: SourceCategory;
  trustTier: SourceTrustTier;
  licenseType: LicenseType;
  reusePermissions: ReusePermission;
  crawlingAllowed: boolean;
  scanFrequency: "daily" | "weekly" | "manual";
  lastCheckedAt?: string;
  lastModifiedAt?: string;
  etag?: string;
  contentHash?: string;
  isActive: boolean;
  notes?: string;
}

export type PipelineJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type JobTriggerType =
  | "scheduled_cron"
  | "manual_admin"
  | "coverage_gap_fill"
  | "on_demand_url";

export interface IngestionJob {
  id: string;
  triggerType: JobTriggerType;
  startedAt: string;
  finishedAt?: string;
  status: PipelineJobStatus;
  sourcesChecked: number;
  documentsDiscovered: number;
  candidatesExtracted: number;
  verifiedCount: number;
  publishedCount: number;
  reviewRequiredCount: number;
  rejectedCount: number;
  duplicatesDetected: number;
  errors: string[];
  reportSummary?: string;
}

export type DocumentFileType = "pdf" | "html" | "json" | "csv" | "markdown" | "text";

export type DocumentExtractionStatus =
  | "pending"
  | "extracted"
  | "failed"
  | "quarantined";

export interface SourceDocument {
  id: string;
  sourceId: string;
  originalUrl: string;
  title: string;
  publicationDate?: string;
  retrievedAt: string;
  contentHash: string;
  fileType: DocumentFileType;
  storagePath?: string;
  licenseStatus: LicenseType;
  extractionStatus: DocumentExtractionStatus;
  documentVersion: number;
  rawSnippet?: string;
  metadata?: Record<string, any>;
}

export type CandidateValidationStatus =
  | "discovered"
  | "extracted"
  | "classified"
  | "validation_pending"
  | "validation_failed"
  | "review_required"
  | "verified"
  | "published"
  | "rejected"
  | "superseded";

export interface AuthenticityDetails {
  isAuthenticPyq: boolean;
  examAuthority?: string;           // e.g. "TGPSC", "TSPSC", "UPSC"
  examinationName?: string;         // e.g. "Mandal Planning & Statistical Officer / ASO"
  recruitmentNotification?: string; // e.g. "07/G/ES/2026" or historical "2018"
  examYear?: number;
  examDate?: string;
  paperName?: string;
  paperCode?: string;
  bookletSeries?: string;           // e.g. "Series A", "Series B"
  originalQuestionNumber?: number;
  answerKeyType?: "preliminary" | "final" | "revised_final";
  answerKeyRevision?: string;
  isCancelledOrDisputed?: boolean;
  cancellationNotice?: string;
}

export interface QuestionCandidate {
  id: string;
  jobId: string;
  documentId?: string;
  paperId: PaperId;
  topicId: string;
  subtopicId?: string;
  questionTextTe: string;
  questionTextEn: string;
  questionMathLatex?: string;
  options: QuestionOption[];
  correctOptionId: QuestionOptionId;
  explanationTe: string;
  explanationEn?: string;
  relevantFormulaLatex?: string;
  difficulty: QuestionDifficulty;
  sourceCategory: SourceCategory;
  authenticity: AuthenticityDetails;
  numericalMetadata?: NumericalMetadata;
  validationStatus: CandidateValidationStatus;
  validationFlags?: string[];
  duplicateOfQuestionId?: string;
  similarityScore?: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionProvenance {
  id: string;
  questionId: string;
  sourceDocumentId?: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: SourceTrustTier;
  pageNumber?: number;
  rawExcerpt?: string;
  licenseType: LicenseType;
  attributionText: string;
  importedAt: string;
}

export type ValidationLayer = "structural" | "mathematical" | "factual" | "semantic";

export interface QuestionValidationRecord {
  id: string;
  questionId: string;
  layer: ValidationLayer;
  passed: boolean;
  validatorName: string;
  timestamp: string;
  details: Record<string, any>;
  errorMessage?: string;
}

export interface QuestionTranslationRecord {
  id: string;
  questionId: string;
  language: "te" | "en";
  translatedText: string;
  translatedExplanation: string;
  translatedOptions: QuestionOption[];
  termsPreserved: string[];
  mathematicalNotationIntact: boolean;
  numericValuesPreserved: boolean;
  validationStatus: "verified" | "review_needed" | "rejected";
  validationNotes?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface IngestionErrorRecord {
  id: string;
  jobId?: string;
  sourceId?: string;
  stage:
    | "discovery"
    | "fetch"
    | "extraction"
    | "classification"
    | "validation"
    | "translation"
    | "deduplication"
    | "synchronization";
  errorCode: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SyllabusCoverageRecord {
  topicId: string;
  paperId: PaperId;
  unitNumber: number;
  unitTitleTe: string;
  unitTitleEn: string;
  totalPublished: number;
  authenticPyqCount: number;
  relatedExamCount: number;
  originalPracticeCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  numericalCount: number;
  teluguVerifiedCount: number;
  pendingReviewCount: number;
  coverageScore: number; // 0 - 100%
  coverageHealth: "good" | "adequate" | "needs_questions" | "critical_gap";
  lastUpdated: string;
}

export interface DailySyncReport {
  id: string;
  reportDate: string; // YYYY-MM-DD
  jobId: string;
  sourcesCheckedCount: number;
  changedDocumentsCount: number;
  newCandidatesCount: number;
  verifiedCount: number;
  publishedCount: number;
  reviewRequiredCount: number;
  rejectedCount: number;
  duplicatesDetectedCount: number;
  failedSourcesCount: number;
  paper1NewCountByTopic: Record<string, number>;
  paper2NewCountByTopic: Record<string, number>;
  sourceChanges: {
    sourceName: string;
    url: string;
    changeType: "new_document" | "updated_document" | "unchanged" | "error";
    detail?: string;
  }[];
  validationWarnings: string[];
  actionsRequired: string[];
  createdAt: string;
}
