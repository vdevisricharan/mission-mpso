import { PaperId } from "@/types/curriculum";
import { DailyStudyPlan, DailyStudyTask, MasteryLevel, MistakeBookItem, RevisionItem, TopicMasteryRecord } from "@/types/mastery";
import { MistakeCategory, Question, QuestionOptionId } from "@/types/question";
import { db } from "../db";
import { OFFICIAL_SYLLABUS_TOPICS } from "../curriculum/syllabus-data";

export class MasteryEngine {
  /**
   * Calculate mastery level based on rigorous evidence thresholds
   */
  static evaluateMastery(totalAttempts: number, correctAttempts: number): {
    level: MasteryLevel;
    accuracyPercentage: number;
    thresholdMet: boolean;
    recommendationTe: string;
  } {
    if (totalAttempts === 0) {
      return {
        level: "not_assessed",
        accuracyPercentage: 0,
        thresholdMet: false,
        recommendationTe: "ఈ అంశంలో ఇంకా ప్రాక్టీస్ చేయలేదు. ప్రాథమిక ప్రశ్నలతో మొదలుపెట్టండి.",
      };
    }

    const accuracy = (correctAttempts / totalAttempts) * 100;
    const thresholdMet = totalAttempts >= 5;

    if (totalAttempts < 3) {
      return {
        level: "beginning",
        accuracyPercentage: Math.round(accuracy),
        thresholdMet: false,
        recommendationTe: "కనీసం 5 ప్రశ్నలు సాధిస్తేనే ఖచ్చితమైన సామర్థ్యం అంచనా వేయబడుతుంది.",
      };
    }

    if (accuracy >= 85 && thresholdMet) {
      return {
        level: "strong",
        accuracyPercentage: Math.round(accuracy),
        thresholdMet: true,
        recommendationTe: "ఈ అంశంలో మీకు బలమైన పట్టు ఉంది! క్రమం తప్పకుండా పునశ్చరణ చేయండి.",
      };
    } else if (accuracy >= 70 && thresholdMet) {
      return {
        level: "proficient",
        accuracyPercentage: Math.round(accuracy),
        thresholdMet: true,
        recommendationTe: "మంచి ప్రావీణ్యత ఉంది. కష్టమైన ప్రశ్నలు మరియు టైమ్డ్ టెస్టులు సాధించండి.",
      };
    } else if (accuracy >= 50) {
      return {
        level: "practising",
        accuracyPercentage: Math.round(accuracy),
        thresholdMet: thresholdMet,
        recommendationTe: "సాధన కొనసాగుతోంది. సూత్రాల అనువర్తనంపై మరిన్ని లెక్కలు చేయండి.",
      };
    } else {
      return {
        level: "developing",
        accuracyPercentage: Math.round(accuracy),
        thresholdMet: thresholdMet,
        recommendationTe: "ఈ అంశంలో భావనలను తిరిగి అర్థం చేసుకోవాలి. AI ట్యూటర్ వివరణ వినండి.",
      };
    }
  }

  /**
   * Get topic mastery records for a user across all syllabus topics
   */
  static getUserTopicMastery(userId: string): TopicMasteryRecord[] {
    const practiceSessions = db.getUserPracticeSessions(userId);
    const topicStats: Record<string, { total: number; correct: number; lastAt: string | null }> = {};

    practiceSessions.forEach((session) => {
      Object.values(session.submissions).forEach((sub) => {
        const q = session.questions.find((item) => item.id === sub.questionId);
        if (!q) return;

        if (!topicStats[q.topicId]) {
          topicStats[q.topicId] = { total: 0, correct: 0, lastAt: null };
        }
        topicStats[q.topicId].total += 1;
        if (sub.isCorrect) {
          topicStats[q.topicId].correct += 1;
        }
        topicStats[q.topicId].lastAt = session.completedAt || session.startedAt;
      });
    });

    return OFFICIAL_SYLLABUS_TOPICS.map((topic) => {
      const stat = topicStats[topic.id] || { total: 0, correct: 0, lastAt: null };
      const evaluation = this.evaluateMastery(stat.total, stat.correct);

      return {
        topicId: topic.id,
        paperId: topic.paperId,
        topicTitleTe: topic.titleTe,
        topicTitleEn: topic.titleEn,
        masteryLevel: evaluation.level,
        totalAttempts: stat.total,
        correctAttempts: stat.correct,
        accuracyPercentage: evaluation.accuracyPercentage,
        lastAssessedAt: stat.lastAt,
        minimumEvidenceThresholdMet: evaluation.thresholdMet,
        recommendationTe: evaluation.recommendationTe,
      };
    });
  }

  /**
   * Record a mistake in the Mistake Book and schedule spaced repetition
   */
  static recordMistake(
    userId: string,
    question: Question,
    selectedOptionId: QuestionOptionId | null,
    mistakeCategory: MistakeCategory = "unclassified"
  ): MistakeBookItem {
    const existing = db.getMistakes(userId).find((m) => m.questionId === question.id);

    if (existing) {
      existing.reviewCount += 1;
      existing.lastAttemptedAt = new Date().toISOString();
      existing.isResolved = false;
      existing.studentAnswer = selectedOptionId;
      existing.mistakeCategory = mistakeCategory;
      db.saveMistake(existing);
      return existing;
    }

    const newMistake: MistakeBookItem = {
      id: "mistake_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userId,
      questionId: question.id,
      question,
      studentAnswer: selectedOptionId,
      mistakeCategory,
      firstFailedAt: new Date().toISOString(),
      lastAttemptedAt: new Date().toISOString(),
      reviewCount: 1,
      isResolved: false,
      bookmarked: false,
      aiExplanationTe: question.explanationTe,
    };

    db.saveMistake(newMistake);

    // Schedule next review for tomorrow (1 day interval)
    this.scheduleRevision(userId, question.id, question.topicId, question.paperId, 1);

    return newMistake;
  }

  /**
   * Schedule Spaced Repetition (Intervals: 1, 3, 7, 14, 30 days)
   */
  static scheduleRevision(
    userId: string,
    referenceId: string,
    topicId: string,
    paperId: PaperId,
    stage: number = 1
  ): RevisionItem {
    const intervals = [1, 3, 7, 14, 30];
    const intervalDays = intervals[Math.min(stage - 1, intervals.length - 1)];

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + intervalDays);
    const dueDate = dueDateObj.toISOString().split("T")[0];

    const topic = db.getTopic(topicId);

    const item: RevisionItem = {
      id: "rev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userId,
      itemType: "question",
      referenceId,
      topicId,
      topicTitleTe: topic ? topic.titleTe : "సిలబస్ అంశం",
      paperId,
      intervalDays,
      repetitionStage: stage,
      dueDate,
      lastReviewedAt: null,
      isCompleted: false,
    };

    return db.saveRevisionItem(item);
  }

  /**
   * Generate an adaptive Daily Study Plan
   */
  static getOrCreateDailyPlan(userId: string): DailyStudyPlan {
    const today = new Date().toISOString().split("T")[0];
    const existing = db.getStudyPlan(userId, today);
    if (existing) return existing;

    const user = db.getUser(userId);
    const targetMinutes = user?.studentPreferences?.dailyStudyMinutes || 120;
    const dueRevisions = db.getDueRevisionItems(userId, today);
    const mistakes = db.getMistakes(userId).filter((m) => !m.isResolved);

    // Generate balanced tasks based on available time
    const tasks: DailyStudyTask[] = [];

    // Task 1: Paper II Statistics core concept (40% of time)
    const statTime = Math.round(targetMinutes * 0.4);
    tasks.push({
      id: "task_stat_" + today,
      taskType: "learn_statistics",
      titleTe: "పేపర్ II: కేంద్రీయ ప్రవృత్తి & ప్రామాణిక విచలనం",
      titleEn: "Paper-II: Central Tendency & Standard Deviation",
      topicId: "p2_central_tendency_dispersion",
      paperId: "paper_2",
      durationMinutes: statTime,
      isCompleted: false,
      priority: "high",
      reasonTe: "డిగ్రీ స్టాటిస్టిక్స్ పేపర్‌లో ఎక్కువ వెయిటేజీ ఉన్న ముఖ్యమైన అంశం.",
      actionUrl: "/learn/p2_central_tendency_dispersion",
    });

    // Task 2: Paper I General Studies (30% of time)
    const gsTime = Math.round(targetMinutes * 0.3);
    tasks.push({
      id: "task_gs_" + today,
      taskType: "learn_general_studies",
      titleTe: "పేపర్ I: తెలంగాణ చరిత్ర & ప్రత్యేక రాష్ట్ర ఉద్యమం",
      titleEn: "Paper-I: Telangana History & Movement",
      topicId: "p1_history_telangana_statehood",
      paperId: "paper_1",
      durationMinutes: gsTime,
      isCompleted: false,
      priority: "medium",
      reasonTe: "తెలంగాణ ఉద్యమ చరిత్రపై 15 ప్రశ్నలు వచ్చే అవకాశం ఉంది.",
      actionUrl: "/learn/p1_history_telangana_statehood",
    });

    // Task 3: Practice Quiz (15% of time)
    const practiceTime = Math.round(targetMinutes * 0.15);
    tasks.push({
      id: "task_practice_" + today,
      taskType: "practice_questions",
      titleTe: "నేటి ప్రాక్టీస్ క్విజ్ (10 ప్రశ్నలు)",
      titleEn: "Daily Practice Quiz (10 Questions)",
      durationMinutes: practiceTime,
      isCompleted: false,
      priority: "high",
      reasonTe: "నేర్చుకున్న సూత్రాలు మరియు కాన్సెప్టులను పరీక్షించుకోవడానికి.",
      actionUrl: "/practice",
    });

    // Task 4: Revision & Mistake Book (15% of time)
    const revTime = Math.max(15, targetMinutes - (statTime + gsTime + practiceTime));
    tasks.push({
      id: "task_rev_" + today,
      taskType: mistakes.length > 0 ? "mistake_review" : "revision_spaced",
      titleTe: mistakes.length > 0 ? `తప్పుల పుస్తకం సమీక్ష (${mistakes.length} మిస్టేక్స్)` : "స్పేస్డ్ రివిజన్",
      titleEn: "Mistake Book Review & Spaced Repetition",
      durationMinutes: revTime,
      isCompleted: false,
      priority: "high",
      reasonTe: "గతంలో తప్పు చేసిన ప్రశ్నలను మళ్లీ పరిశీలించి గుర్తుంచుకోండి.",
      actionUrl: "/mistakes",
    });

    const plan: DailyStudyPlan = {
      id: "plan_" + userId + "_" + today,
      userId,
      date: today,
      dayGreetingTe: "శుభోదయం! ఈరోజు మీ లక్ష్య సాధనకు మరో అడుగు వేద్దాం.",
      summaryMessageTe: `మీ లక్ష్యం: రోజుకు ${targetMinutes} నిమిషాలు. ఈరోజు 2 ముఖ్యమైన పాఠాలు, ప్రాక్టీస్ మరియు పునశ్చరణ సిద్ధంగా ఉన్నాయి.`,
      tasks,
      totalTargetMinutes: targetMinutes,
      completedMinutes: 0,
      isRecalculated: false,
    };

    return db.saveStudyPlan(plan);
  }
}
