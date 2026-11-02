import fs from "fs";
import path from "path";
import { UserProfile } from "@/types/auth";
import { OfficialExamConfig, OFFICIAL_MPSO_EXAM_CONFIG } from "@/types/exam";
import { LessonContent, SyllabusTopic, PaperId } from "@/types/curriculum";
import { Question, QuestionFilter } from "@/types/question";
import { PracticeSession } from "@/types/practice";
import { MockExamSession } from "@/types/mock";
import { DailyStudyPlan, MistakeBookItem, RevisionItem } from "@/types/mastery";
import { TutorConversation } from "@/types/tutor";
import { OFFICIAL_SYLLABUS_TOPICS } from "../curriculum/syllabus-data";
import { CURRICULUM_LESSONS } from "../curriculum/lessons-data";
import { DIAGNOSTIC_QUESTIONS } from "../questions/diagnostic-data";
import {
  ContentSource,
  IngestionJob,
  SourceDocument,
  QuestionCandidate,
  QuestionProvenance,
  QuestionValidationRecord,
  QuestionTranslationRecord,
  IngestionErrorRecord,
  SyllabusCoverageRecord,
  DailySyncReport,
  CandidateValidationStatus,
} from "@/types/pipeline";

interface DatabaseSchema {
  users: Record<string, UserProfile>;
  examConfig: OfficialExamConfig;
  syllabusTopics: SyllabusTopic[];
  lessons: LessonContent[];
  questions: Question[];
  practiceSessions: Record<string, PracticeSession>;
  mockSessions: Record<string, MockExamSession>;
  mistakeBook: Record<string, MistakeBookItem>;
  revisionQueue: Record<string, RevisionItem>;
  studyPlans: Record<string, DailyStudyPlan>;
  tutorConversations: Record<string, TutorConversation>;
  auditLogs: { id: string; action: string; timestamp: string; details: any }[];

  // Autonomous Question Intelligence & Ingestion System Entities
  contentSources: Record<string, ContentSource>;
  ingestionJobs: Record<string, IngestionJob>;
  sourceDocuments: Record<string, SourceDocument>;
  questionCandidates: Record<string, QuestionCandidate>;
  questionProvenance: Record<string, QuestionProvenance>;
  questionValidations: Record<string, QuestionValidationRecord>;
  questionTranslations: Record<string, QuestionTranslationRecord>;
  ingestionErrors: IngestionErrorRecord[];
  syllabusCoverage: Record<string, SyllabusCoverageRecord>;
  dailySyncReports: Record<string, DailySyncReport>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "mission_mpso_db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export const INITIAL_CONTENT_SOURCES: Record<string, ContentSource> = {
  src_tgpsc_official: {
    id: "src_tgpsc_official",
    name: "TGPSC Official Portal (websitenew.tgpsc.gov.in)",
    url: "https://websitenew.tgpsc.gov.in/",
    sourceCategory: "official_commission",
    trustTier: 1,
    licenseType: "official_tgpsc_public_notice",
    reusePermissions: "full_question_reproduction",
    crawlingAllowed: true,
    scanFrequency: "daily",
    isActive: true,
    notes: "Primary authoritative source for Notifications, Syllabus, Question Papers, and Final Answer Keys.",
  },
  src_tgpsc_archives: {
    id: "src_tgpsc_archives",
    name: "TGPSC / TSPSC Question Paper & Web Notes Archive",
    url: "https://websitenew.tgpsc.gov.in/previous-question-papers",
    sourceCategory: "official_commission",
    trustTier: 1,
    licenseType: "official_tgpsc_public_notice",
    reusePermissions: "full_question_reproduction",
    crawlingAllowed: true,
    scanFrequency: "daily",
    isActive: true,
    notes: "Official preliminary and final answer keys, revised keys, and web notes.",
  },
  src_ts_des: {
    id: "src_ts_des",
    name: "Telangana Directorate of Economics & Statistics (DES)",
    url: "https://ecostat.telangana.gov.in/",
    sourceCategory: "state_government",
    trustTier: 2,
    licenseType: "government_open_data",
    reusePermissions: "original_derivation_permitted",
    crawlingAllowed: true,
    scanFrequency: "daily",
    isActive: true,
    notes: "Key source for state statistical data, GSDP, price indices, and agriculture census.",
  },
  src_ts_socio_economic_outlook: {
    id: "src_ts_socio_economic_outlook",
    name: "Telangana Socio Economic Outlook & Planning Dept",
    url: "https://planning.telangana.gov.in/",
    sourceCategory: "state_government",
    trustTier: 2,
    licenseType: "government_open_data",
    reusePermissions: "original_derivation_permitted",
    crawlingAllowed: true,
    scanFrequency: "weekly",
    isActive: true,
    notes: "Annual state survey, government welfare policies, and economic indicators.",
  },
  src_mospi_goi: {
    id: "src_mospi_goi",
    name: "MoSPI — Ministry of Statistics and Programme Implementation",
    url: "https://www.mospi.gov.in/",
    sourceCategory: "state_government",
    trustTier: 2,
    licenseType: "government_open_data",
    reusePermissions: "original_derivation_permitted",
    crawlingAllowed: true,
    scanFrequency: "weekly",
    isActive: true,
    notes: "National accounts, CPI, IIP, national statistical systems, and NSSO guidelines.",
  },
  src_oer_statistics: {
    id: "src_oer_statistics",
    name: "Open Educational Degree Statistics Textbooks (OER / OpenStax)",
    url: "https://openstax.org/details/books/introductory-statistics",
    sourceCategory: "academic_oer",
    trustTier: 3,
    licenseType: "creative_commons_by_sa",
    reusePermissions: "full_question_reproduction",
    crawlingAllowed: true,
    scanFrequency: "weekly",
    isActive: true,
    notes: "Standard degree-level statistics problems, probability theorems, and hypothesis tests.",
  },
  src_tgpsc_related_exams: {
    id: "src_tgpsc_related_exams",
    name: "TGPSC / TSPSC Related Statistics Examinations Archive",
    url: "https://websitenew.tgpsc.gov.in/archives-statistical-services",
    sourceCategory: "related_government_exam",
    trustTier: 4,
    licenseType: "official_tgpsc_public_notice",
    reusePermissions: "full_question_reproduction",
    crawlingAllowed: true,
    scanFrequency: "weekly",
    isActive: true,
    notes: "Junior Statistical Officer, Statistical Officer, Divisional Accounts Officer papers. Strict provenance recorded; never mislabeled as MPSO PYQ.",
  },
  src_telangana_today_ca: {
    id: "src_telangana_today_ca",
    name: "Telangana Development & Governance Reference Feed",
    url: "https://telanganatoday.com/",
    sourceCategory: "third_party_reference",
    trustTier: 5,
    licenseType: "restricted_metadata_only",
    reusePermissions: "metadata_and_citation_only",
    crawlingAllowed: true,
    scanFrequency: "daily",
    isActive: true,
    notes: "Educational current affairs reference only. Metadata and source citations stored, no bulk copyrighted content.",
  },
};

function calculateInitialCoverage(): Record<string, SyllabusCoverageRecord> {
  const result: Record<string, SyllabusCoverageRecord> = {};
  for (const topic of OFFICIAL_SYLLABUS_TOPICS) {
    result[topic.id] = {
      topicId: topic.id,
      paperId: topic.paperId,
      unitNumber: topic.unitNumber,
      unitTitleTe: topic.unitTitleTe,
      unitTitleEn: topic.unitTitleEn,
      totalPublished: 0,
      authenticPyqCount: 0,
      relatedExamCount: 0,
      originalPracticeCount: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      numericalCount: 0,
      teluguVerifiedCount: 0,
      pendingReviewCount: 0,
      coverageScore: 0,
      coverageHealth: "critical_gap",
      lastUpdated: new Date().toISOString(),
    };
  }
  return result;
}

function getInitialDatabase(): DatabaseSchema {
  const defaultStudent: UserProfile = {
    id: "student_default",
    email: "student@mission-mpso.internal",
    role: "student",
    createdAt: new Date().toISOString(),
    studentPreferences: {
      displayName: "భాగ్య",
      language: "te",
      educationBackground: "B.Sc. (Statistics)",
      statisticsFamiliarity: "intermediate",
      dailyStudyMinutes: 120,
      preferredStudyWindow: "morning",
      targetExam: "TGPSC MPSO / ASO 2026-2027",
      enableVoice: true,
      textSize: "normal",
      hasCompletedOnboarding: false,
      hasCompletedDiagnostic: false,
    },
  };

  const defaultAdmin: UserProfile = {
    id: "admin_default",
    email: "admin@mission-mpso.internal",
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  return {
    users: {
      [defaultStudent.id]: defaultStudent,
      [defaultAdmin.id]: defaultAdmin,
    },
    examConfig: OFFICIAL_MPSO_EXAM_CONFIG,
    syllabusTopics: OFFICIAL_SYLLABUS_TOPICS,
    lessons: CURRICULUM_LESSONS,
    questions: DIAGNOSTIC_QUESTIONS,
    practiceSessions: {},
    mockSessions: {},
    mistakeBook: {},
    revisionQueue: {},
    studyPlans: {},
    tutorConversations: {},
    auditLogs: [
      {
        id: "log_init",
        action: "DATABASE_INITIALIZED",
        timestamp: new Date().toISOString(),
        details: { notification: "07/G/ES/2026", version: "1.0.0" },
      },
    ],
    contentSources: INITIAL_CONTENT_SOURCES,
    ingestionJobs: {},
    sourceDocuments: {},
    questionCandidates: {},
    questionProvenance: {},
    questionValidations: {},
    questionTranslations: {},
    ingestionErrors: [],
    syllabusCoverage: calculateInitialCoverage(),
    dailySyncReports: {},
  };
}

class PersistentDatabase {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
    this.ensureSchemaIntegrity();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn("Could not read persistent DB file, initializing fresh:", err);
    }
    const fresh = getInitialDatabase();
    this.saveDatabase(fresh);
    return fresh;
  }

  private ensureSchemaIntegrity() {
    let modified = false;
    if (!this.db.contentSources || Object.keys(this.db.contentSources).length === 0) {
      this.db.contentSources = INITIAL_CONTENT_SOURCES;
      modified = true;
    }
    if (!this.db.ingestionJobs) {
      this.db.ingestionJobs = {};
      modified = true;
    }
    if (!this.db.sourceDocuments) {
      this.db.sourceDocuments = {};
      modified = true;
    }
    if (!this.db.questionCandidates) {
      this.db.questionCandidates = {};
      modified = true;
    }
    if (!this.db.questionProvenance) {
      this.db.questionProvenance = {};
      modified = true;
    }
    if (!this.db.questionValidations) {
      this.db.questionValidations = {};
      modified = true;
    }
    if (!this.db.questionTranslations) {
      this.db.questionTranslations = {};
      modified = true;
    }
    if (!this.db.ingestionErrors) {
      this.db.ingestionErrors = [];
      modified = true;
    }
    if (!this.db.syllabusCoverage || Object.keys(this.db.syllabusCoverage).length === 0) {
      this.db.syllabusCoverage = calculateInitialCoverage();
      modified = true;
    }
    if (!this.db.dailySyncReports) {
      this.db.dailySyncReports = {};
      modified = true;
    }

    if (modified) {
      this.recalculateAllSyllabusCoverage();
      this.saveDatabase(this.db);
    }
  }

  private saveDatabase(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write to persistent DB file:", err);
    }
  }

  // ==========================================
  // User & Auth
  // ==========================================
  getUser(userId: string): UserProfile | null {
    return this.db.users[userId] || null;
  }

  getUserByEmail(email: string): UserProfile | null {
    const found = Object.values(this.db.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }

  saveUser(user: UserProfile): UserProfile {
    this.db.users[user.id] = user;
    this.saveDatabase(this.db);
    return user;
  }

  // ==========================================
  // Exam Config
  // ==========================================
  getExamConfig(): OfficialExamConfig {
    return this.db.examConfig || OFFICIAL_MPSO_EXAM_CONFIG;
  }

  updateExamConfig(config: Partial<OfficialExamConfig>, updatedBy: string): OfficialExamConfig {
    this.db.examConfig = {
      ...this.db.examConfig,
      ...config,
      lastVerifiedAt: new Date().toISOString(),
    };
    this.addAuditLog("EXAM_CONFIG_UPDATED", updatedBy, config);
    this.saveDatabase(this.db);
    return this.db.examConfig;
  }

  // ==========================================
  // Syllabus & Lessons
  // ==========================================
  getSyllabusTopics(paperId?: "paper_1" | "paper_2"): SyllabusTopic[] {
    if (!paperId) return this.db.syllabusTopics;
    return this.db.syllabusTopics.filter((t) => t.paperId === paperId);
  }

  getTopic(topicId: string): SyllabusTopic | null {
    return this.db.syllabusTopics.find((t) => t.id === topicId) || null;
  }

  getLessons(topicId?: string): LessonContent[] {
    if (!topicId) return this.db.lessons;
    return this.db.lessons.filter((l) => l.topicId === topicId);
  }

  getLesson(lessonId: string): LessonContent | null {
    return this.db.lessons.find((l) => l.id === lessonId) || null;
  }

  saveLesson(lesson: LessonContent): LessonContent {
    const index = this.db.lessons.findIndex((l) => l.id === lesson.id);
    if (index >= 0) {
      this.db.lessons[index] = lesson;
    } else {
      this.db.lessons.push(lesson);
    }
    this.saveDatabase(this.db);
    return lesson;
  }

  // ==========================================
  // Questions Bank
  // ==========================================
  getQuestions(filter?: QuestionFilter): Question[] {
    let list = this.db.questions;
    if (filter?.paperId) list = list.filter((q) => q.paperId === filter.paperId);
    if (filter?.topicId) list = list.filter((q) => q.topicId === filter.topicId);
    if (filter?.difficulty) list = list.filter((q) => q.difficulty === filter.difficulty);
    if (filter?.sourceType) list = list.filter((q) => q.sourceType === filter.sourceType);
    if (filter?.validationStatus) list = list.filter((q) => q.validationStatus === filter.validationStatus);
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.questionTextTe.toLowerCase().includes(q) ||
          item.questionTextEn.toLowerCase().includes(q) ||
          item.topicId.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getQuestion(questionId: string): Question | null {
    return this.db.questions.find((q) => q.id === questionId) || null;
  }

  saveQuestion(question: Question): Question {
    const idx = this.db.questions.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      this.db.questions[idx] = question;
    } else {
      this.db.questions.push(question);
    }
    this.recalculateTopicCoverage(question.topicId);
    this.saveDatabase(this.db);
    return question;
  }

  saveQuestions(questions: Question[]): void {
    const affectedTopics = new Set<string>();
    for (const q of questions) {
      const idx = this.db.questions.findIndex((existing) => existing.id === q.id);
      if (idx >= 0) {
        this.db.questions[idx] = q;
      } else {
        this.db.questions.push(q);
      }
      affectedTopics.add(q.topicId);
    }
    for (const topicId of affectedTopics) {
      this.recalculateTopicCoverage(topicId);
    }
    this.saveDatabase(this.db);
  }

  // ==========================================
  // Question Intelligence: Content Sources
  // ==========================================
  getContentSources(activeOnly: boolean = false): ContentSource[] {
    const sources = Object.values(this.db.contentSources || {});
    return activeOnly ? sources.filter((s) => s.isActive) : sources;
  }

  getContentSource(sourceId: string): ContentSource | null {
    return this.db.contentSources?.[sourceId] || null;
  }

  saveContentSource(source: ContentSource): ContentSource {
    if (!this.db.contentSources) this.db.contentSources = {};
    this.db.contentSources[source.id] = {
      ...source,
      updatedAt: new Date().toISOString(),
    } as any;
    this.saveDatabase(this.db);
    return this.db.contentSources[source.id];
  }

  // ==========================================
  // Question Intelligence: Ingestion Jobs
  // ==========================================
  getIngestionJobs(limit: number = 20): IngestionJob[] {
    const jobs = Object.values(this.db.ingestionJobs || {});
    return jobs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
  }

  getIngestionJob(jobId: string): IngestionJob | null {
    return this.db.ingestionJobs?.[jobId] || null;
  }

  saveIngestionJob(job: IngestionJob): IngestionJob {
    if (!this.db.ingestionJobs) this.db.ingestionJobs = {};
    this.db.ingestionJobs[job.id] = job;
    this.saveDatabase(this.db);
    return job;
  }

  // ==========================================
  // Question Intelligence: Source Documents
  // ==========================================
  getSourceDocuments(sourceId?: string): SourceDocument[] {
    const docs = Object.values(this.db.sourceDocuments || {});
    return sourceId ? docs.filter((d) => d.sourceId === sourceId) : docs;
  }

  getSourceDocument(docId: string): SourceDocument | null {
    return this.db.sourceDocuments?.[docId] || null;
  }

  saveSourceDocument(doc: SourceDocument): SourceDocument {
    if (!this.db.sourceDocuments) this.db.sourceDocuments = {};
    this.db.sourceDocuments[doc.id] = doc;
    this.saveDatabase(this.db);
    return doc;
  }

  // ==========================================
  // Question Intelligence: Question Candidates
  // ==========================================
  getQuestionCandidates(filter?: {
    jobId?: string;
    status?: CandidateValidationStatus;
    topicId?: string;
    paperId?: PaperId;
  }): QuestionCandidate[] {
    let list = Object.values(this.db.questionCandidates || {});
    if (filter?.jobId) list = list.filter((c) => c.jobId === filter.jobId);
    if (filter?.status) list = list.filter((c) => c.validationStatus === filter.status);
    if (filter?.topicId) list = list.filter((c) => c.topicId === filter.topicId);
    if (filter?.paperId) list = list.filter((c) => c.paperId === filter.paperId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getQuestionCandidate(candidateId: string): QuestionCandidate | null {
    return this.db.questionCandidates?.[candidateId] || null;
  }

  saveQuestionCandidate(candidate: QuestionCandidate): QuestionCandidate {
    if (!this.db.questionCandidates) this.db.questionCandidates = {};
    this.db.questionCandidates[candidate.id] = {
      ...candidate,
      updatedAt: new Date().toISOString(),
    };
    this.saveDatabase(this.db);
    return this.db.questionCandidates[candidate.id];
  }

  saveQuestionCandidates(candidates: QuestionCandidate[]): void {
    if (!this.db.questionCandidates) this.db.questionCandidates = {};
    const now = new Date().toISOString();
    for (const c of candidates) {
      this.db.questionCandidates[c.id] = {
        ...c,
        updatedAt: now,
      };
    }
    this.saveDatabase(this.db);
  }

  /**
   * Transactional publication of candidate question into core questions bank.
   */
  publishCandidate(candidateId: string, reviewedBy: string = "Admin"): Question | null {
    const candidate = this.getQuestionCandidate(candidateId);
    if (!candidate) return null;

    // Reject publication if failed validation
    if (candidate.validationStatus === "validation_failed" || candidate.validationStatus === "rejected") {
      throw new Error(`Cannot publish candidate ${candidateId} with status ${candidate.validationStatus}`);
    }

    const now = new Date().toISOString();

    // Map source type cleanly
    let mappedSourceType: Question["sourceType"] = "reviewed_ai_generated";
    if (candidate.authenticity.isAuthenticPyq) {
      mappedSourceType = "official_pyq";
    } else if (candidate.sourceCategory === "related_government_exam") {
      mappedSourceType = "tgpsc_standard_model";
    } else if (candidate.sourceCategory === "academic_oer") {
      mappedSourceType = "standard_degree_textbook";
    } else if (candidate.sourceCategory === "state_government") {
      mappedSourceType = "current_affairs_editorial";
    }

    const publishedQuestion: Question = {
      id: candidate.id,
      paperId: candidate.paperId,
      topicId: candidate.topicId,
      subtopicId: candidate.subtopicId,
      questionTextTe: candidate.questionTextTe,
      questionTextEn: candidate.questionTextEn,
      questionMathLatex: candidate.questionMathLatex,
      options: candidate.options,
      correctOptionId: candidate.correctOptionId,
      explanationTe: candidate.explanationTe,
      explanationEn: candidate.explanationEn,
      relevantFormulaLatex: candidate.relevantFormulaLatex,
      difficulty: candidate.difficulty,
      estimatedSolveSeconds: candidate.difficulty === "hard" ? 90 : candidate.difficulty === "medium" ? 60 : 45,
      sourceType: mappedSourceType,
      sourceReference: candidate.authenticity.isAuthenticPyq
        ? `${candidate.authenticity.examinationName || "TGPSC MPSO"} (${candidate.authenticity.examYear || 2026}) Q.${candidate.authenticity.originalQuestionNumber || ""}`
        : `Verified Syllabus Material — ${candidate.topicId}`,
      year: candidate.authenticity.examYear,
      isAuthenticPyq: candidate.authenticity.isAuthenticPyq,
      examAuthority: candidate.authenticity.examAuthority,
      notificationNumber: candidate.authenticity.recruitmentNotification,
      bookletSeries: candidate.authenticity.bookletSeries,
      originalQuestionNumber: candidate.authenticity.originalQuestionNumber,
      answerKeyType: candidate.authenticity.answerKeyType,
      numericalMetadata: candidate.numericalMetadata,
      validationStatus: "approved",
      reviewedBy,
      reviewedAt: now,
      reviewNotes: "Approved and published to production question bank via Question Intelligence Engine.",
      createdAt: candidate.createdAt || now,
      updatedAt: now,
    };

    // Save to core question bank
    this.saveQuestion(publishedQuestion);

    // Update candidate state
    candidate.validationStatus = "published";
    candidate.updatedAt = now;
    this.saveQuestionCandidate(candidate);

    this.addAuditLog("QUESTION_PUBLISHED", reviewedBy, {
      questionId: publishedQuestion.id,
      topicId: publishedQuestion.topicId,
      paperId: publishedQuestion.paperId,
      isAuthenticPyq: candidate.authenticity.isAuthenticPyq,
    });

    return publishedQuestion;
  }

  rejectCandidate(candidateId: string, reason: string): QuestionCandidate | null {
    const candidate = this.getQuestionCandidate(candidateId);
    if (!candidate) return null;
    candidate.validationStatus = "rejected";
    candidate.rejectionReason = reason;
    candidate.updatedAt = new Date().toISOString();
    return this.saveQuestionCandidate(candidate);
  }

  // ==========================================
  // Question Intelligence: Provenance, Validations, Translations
  // ==========================================
  saveQuestionProvenance(prov: QuestionProvenance): QuestionProvenance {
    if (!this.db.questionProvenance) this.db.questionProvenance = {};
    this.db.questionProvenance[prov.questionId] = prov;
    this.saveDatabase(this.db);
    return prov;
  }

  getQuestionProvenance(questionId: string): QuestionProvenance | null {
    return this.db.questionProvenance?.[questionId] || null;
  }

  saveQuestionValidation(record: QuestionValidationRecord): QuestionValidationRecord {
    if (!this.db.questionValidations) this.db.questionValidations = {};
    this.db.questionValidations[record.id] = record;
    this.saveDatabase(this.db);
    return record;
  }

  getQuestionValidations(questionId: string): QuestionValidationRecord[] {
    return Object.values(this.db.questionValidations || {}).filter((v) => v.questionId === questionId);
  }

  saveQuestionTranslation(record: QuestionTranslationRecord): QuestionTranslationRecord {
    if (!this.db.questionTranslations) this.db.questionTranslations = {};
    this.db.questionTranslations[record.id] = record;
    this.saveDatabase(this.db);
    return record;
  }

  getQuestionTranslations(questionId: string): QuestionTranslationRecord[] {
    return Object.values(this.db.questionTranslations || {}).filter((t) => t.questionId === questionId);
  }

  logIngestionError(err: IngestionErrorRecord): void {
    if (!this.db.ingestionErrors) this.db.ingestionErrors = [];
    this.db.ingestionErrors.unshift(err);
    if (this.db.ingestionErrors.length > 500) {
      this.db.ingestionErrors = this.db.ingestionErrors.slice(0, 500);
    }
    this.saveDatabase(this.db);
  }

  getIngestionErrors(jobId?: string): IngestionErrorRecord[] {
    if (!this.db.ingestionErrors) return [];
    return jobId ? this.db.ingestionErrors.filter((e) => e.jobId === jobId) : this.db.ingestionErrors;
  }

  // ==========================================
  // Question Intelligence: Syllabus Coverage
  // ==========================================
  getSyllabusCoverage(paperId?: PaperId): SyllabusCoverageRecord[] {
    const list = Object.values(this.db.syllabusCoverage || {});
    const filtered = paperId ? list.filter((c) => c.paperId === paperId) : list;
    return filtered.sort((a, b) => a.unitNumber - b.unitNumber);
  }

  recalculateTopicCoverage(topicId: string): SyllabusCoverageRecord | null {
    const topic = this.getTopic(topicId);
    if (!topic) return null;

    const topicQuestions = this.db.questions.filter((q) => q.topicId === topicId && q.validationStatus === "approved");
    const candidates = Object.values(this.db.questionCandidates || {}).filter((c) => c.topicId === topicId);

    const totalPublished = topicQuestions.length;
    const authenticPyqCount = topicQuestions.filter((q) => q.isAuthenticPyq || q.sourceType === "official_pyq").length;
    const relatedExamCount = topicQuestions.filter((q) => q.sourceType === "tgpsc_standard_model").length;
    const originalPracticeCount = topicQuestions.filter(
      (q) => q.sourceType === "reviewed_ai_generated" || q.sourceType === "standard_degree_textbook" || q.sourceType === "current_affairs_editorial"
    ).length;

    const easyCount = topicQuestions.filter((q) => q.difficulty === "easy").length;
    const mediumCount = topicQuestions.filter((q) => q.difficulty === "medium").length;
    const hardCount = topicQuestions.filter((q) => q.difficulty === "hard").length;
    const numericalCount = topicQuestions.filter((q) => q.numericalMetadata?.isNumerical).length;
    const teluguVerifiedCount = topicQuestions.filter((q) => q.questionTextTe && q.questionTextTe.trim().length > 0).length;
    const pendingReviewCount = candidates.filter((c) => c.validationStatus === "review_required" || c.validationStatus === "validation_pending").length;

    // Weightage target questions based on syllabus configuration
    const targetCount = topic.weightageEstimatedQuestions || 15;
    const rawScore = Math.min(100, Math.round((totalPublished / targetCount) * 100));

    let coverageHealth: SyllabusCoverageRecord["coverageHealth"] = "critical_gap";
    if (totalPublished >= targetCount) {
      coverageHealth = "good";
    } else if (totalPublished >= Math.round(targetCount * 0.5)) {
      coverageHealth = "adequate";
    } else if (totalPublished > 0) {
      coverageHealth = "needs_questions";
    }

    const record: SyllabusCoverageRecord = {
      topicId: topic.id,
      paperId: topic.paperId,
      unitNumber: topic.unitNumber,
      unitTitleTe: topic.unitTitleTe,
      unitTitleEn: topic.unitTitleEn,
      totalPublished,
      authenticPyqCount,
      relatedExamCount,
      originalPracticeCount,
      easyCount,
      mediumCount,
      hardCount,
      numericalCount,
      teluguVerifiedCount,
      pendingReviewCount,
      coverageScore: rawScore,
      coverageHealth,
      lastUpdated: new Date().toISOString(),
    };

    if (!this.db.syllabusCoverage) this.db.syllabusCoverage = {};
    this.db.syllabusCoverage[topic.id] = record;
    return record;
  }

  recalculateAllSyllabusCoverage(): SyllabusCoverageRecord[] {
    const results: SyllabusCoverageRecord[] = [];
    for (const topic of OFFICIAL_SYLLABUS_TOPICS) {
      const rec = this.recalculateTopicCoverage(topic.id);
      if (rec) results.push(rec);
    }
    this.saveDatabase(this.db);
    return results;
  }

  // ==========================================
  // Question Intelligence: Daily Sync Reports
  // ==========================================
  saveDailySyncReport(report: DailySyncReport): DailySyncReport {
    if (!this.db.dailySyncReports) this.db.dailySyncReports = {};
    this.db.dailySyncReports[report.id] = report;
    this.saveDatabase(this.db);
    return report;
  }

  getDailySyncReports(limit: number = 30): DailySyncReport[] {
    const reports = Object.values(this.db.dailySyncReports || {});
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  }

  getLatestDailySyncReport(): DailySyncReport | null {
    const list = this.getDailySyncReports(1);
    return list.length > 0 ? list[0] : null;
  }

  // ==========================================
  // Practice Sessions
  // ==========================================
  savePracticeSession(session: PracticeSession): PracticeSession {
    this.db.practiceSessions[session.id] = session;
    this.saveDatabase(this.db);
    return session;
  }

  getPracticeSession(sessionId: string): PracticeSession | null {
    return this.db.practiceSessions[sessionId] || null;
  }

  getUserPracticeSessions(userId: string): PracticeSession[] {
    return Object.values(this.db.practiceSessions).filter((s) => s.userId === userId);
  }

  // ==========================================
  // Mock Sessions
  // ==========================================
  saveMockSession(session: MockExamSession): MockExamSession {
    this.db.mockSessions[session.id] = session;
    this.saveDatabase(this.db);
    return session;
  }

  getMockSession(sessionId: string): MockExamSession | null {
    return this.db.mockSessions[sessionId] || null;
  }

  getUserMockSessions(userId: string): MockExamSession[] {
    return Object.values(this.db.mockSessions).filter((s) => s.userId === userId);
  }

  deleteMockSession(sessionId: string): void {
    delete this.db.mockSessions[sessionId];
    this.saveDatabase(this.db);
  }

  // ==========================================
  // Mistake Book
  // ==========================================
  getMistakes(userId: string): MistakeBookItem[] {
    return Object.values(this.db.mistakeBook).filter((m) => m.userId === userId);
  }

  saveMistake(item: MistakeBookItem): MistakeBookItem {
    this.db.mistakeBook[item.id] = item;
    this.saveDatabase(this.db);
    return item;
  }

  toggleMistakeResolved(mistakeId: string): boolean {
    if (this.db.mistakeBook[mistakeId]) {
      this.db.mistakeBook[mistakeId].isResolved = !this.db.mistakeBook[mistakeId].isResolved;
      this.saveDatabase(this.db);
      return this.db.mistakeBook[mistakeId].isResolved;
    }
    return false;
  }

  toggleMistakeBookmark(mistakeId: string): boolean {
    if (this.db.mistakeBook[mistakeId]) {
      this.db.mistakeBook[mistakeId].bookmarked = !this.db.mistakeBook[mistakeId].bookmarked;
      this.saveDatabase(this.db);
      return this.db.mistakeBook[mistakeId].bookmarked;
    }
    return false;
  }

  // ==========================================
  // Revision Items (Spaced Repetition)
  // ==========================================
  getDueRevisionItems(userId: string, today: string = new Date().toISOString().split("T")[0]): RevisionItem[] {
    return Object.values(this.db.revisionQueue).filter(
      (r) => r.userId === userId && !r.isCompleted && r.dueDate <= today
    );
  }

  saveRevisionItem(item: RevisionItem): RevisionItem {
    this.db.revisionQueue[item.id] = item;
    this.saveDatabase(this.db);
    return item;
  }

  // ==========================================
  // Daily Study Plans
  // ==========================================
  getStudyPlan(userId: string, date: string): DailyStudyPlan | null {
    const key = `${userId}_${date}`;
    return this.db.studyPlans[key] || null;
  }

  saveStudyPlan(plan: DailyStudyPlan): DailyStudyPlan {
    const key = `${plan.userId}_${plan.date}`;
    this.db.studyPlans[key] = plan;
    this.saveDatabase(this.db);
    return plan;
  }

  // ==========================================
  // Tutor Conversations
  // ==========================================
  getTutorConversation(conversationId: string): TutorConversation | null {
    return this.db.tutorConversations[conversationId] || null;
  }

  getUserTutorConversations(userId: string): TutorConversation[] {
    return Object.values(this.db.tutorConversations).filter((c) => c.userId === userId);
  }

  saveTutorConversation(conv: TutorConversation): TutorConversation {
    this.db.tutorConversations[conv.id] = conv;
    this.saveDatabase(this.db);
    return conv;
  }

  // ==========================================
  // Audit Logs
  // ==========================================
  addAuditLog(action: string, performedBy: string, details: any) {
    this.db.auditLogs.unshift({
      id: "log_" + Date.now(),
      action,
      timestamp: new Date().toISOString(),
      details,
    });
    if (this.db.auditLogs.length > 500) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 500);
    }
  }

  getAuditLogs(): any[] {
    return this.db.auditLogs;
  }
}

export const db = new PersistentDatabase();
