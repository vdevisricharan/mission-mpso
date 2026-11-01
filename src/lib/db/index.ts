import fs from "fs";
import path from "path";
import { UserProfile } from "@/types/auth";
import { OfficialExamConfig, OFFICIAL_MPSO_EXAM_CONFIG } from "@/types/exam";
import { LessonContent, SyllabusTopic } from "@/types/curriculum";
import { Question, QuestionFilter } from "@/types/question";
import { PracticeSession } from "@/types/practice";
import { MockExamSession } from "@/types/mock";
import { DailyStudyPlan, MistakeBookItem, RevisionItem, TopicMasteryRecord } from "@/types/mastery";
import { TutorConversation } from "@/types/tutor";
import { OFFICIAL_SYLLABUS_TOPICS } from "../curriculum/syllabus-data";
import { CURRICULUM_LESSONS } from "../curriculum/lessons-data";
import { VERIFIED_QUESTION_BANK } from "../questions/question-bank-data";
import { DIAGNOSTIC_QUESTIONS } from "../questions/diagnostic-data";

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
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "mission_mpso_db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

function getInitialDatabase(): DatabaseSchema {
  const defaultStudent: UserProfile = {
    id: "student_default",
    email: "student@mission-mpso.internal",
    role: "student",
    createdAt: new Date().toISOString(),
    studentPreferences: {
      displayName: "రమ్య",
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
  };
}

class PersistentDatabase {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
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

  private saveDatabase(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write to persistent DB file:", err);
    }
  }

  // User & Auth
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

  // Exam Config
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

  // Syllabus & Lessons
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

  // Questions Bank
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
    this.saveDatabase(this.db);
    return question;
  }

  // Practice Sessions
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

  // Mock Sessions
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

  // Mistake Book
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

  // Revision Items (Spaced Repetition)
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

  // Daily Study Plans
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

  // Tutor Conversations
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

  // Audit Logs
  addAuditLog(action: string, performedBy: string, details: any) {
    this.db.auditLogs.unshift({
      id: "log_" + Date.now(),
      action,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  getAuditLogs(): any[] {
    return this.db.auditLogs;
  }
}

export const db = new PersistentDatabase();
