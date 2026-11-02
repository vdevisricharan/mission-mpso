/**
 * MISSION MPSO — Syllabus Coverage Intelligence Engine
 * Measures topic-wise question health, detects coverage gaps,
 * and prioritizes topics for original standard question generation.
 */

import { PaperId } from "@/types/curriculum";
import { SyllabusCoverageRecord } from "@/types/pipeline";
import { db } from "../db";

export interface CoverageGapAnalysis {
  overallCoverageScore: number;
  totalPublishedQuestions: number;
  criticalGaps: SyllabusCoverageRecord[];
  needsQuestions: SyllabusCoverageRecord[];
  paper1CoverageScore: number;
  paper2CoverageScore: number;
  topPriorityTopicsForGeneration: string[]; // topicIds
}

export class SyllabusCoverageEngine {
  /**
   * Recalculate coverage metrics across the entire syllabus.
   */
  static refreshCoverage(): SyllabusCoverageRecord[] {
    return db.recalculateAllSyllabusCoverage();
  }

  /**
   * Analyze coverage gaps and return actionable gaps for question generation.
   */
  static analyzeGaps(): CoverageGapAnalysis {
    const allCoverage = db.getSyllabusCoverage();

    const criticalGaps = allCoverage.filter((c) => c.coverageHealth === "critical_gap");
    const needsQuestions = allCoverage.filter((c) => c.coverageHealth === "needs_questions");

    const totalPublished = allCoverage.reduce((sum, c) => sum + c.totalPublished, 0);

    const p1Records = allCoverage.filter((c) => c.paperId === "paper_1");
    const p2Records = allCoverage.filter((c) => c.paperId === "paper_2");

    const p1Score = p1Records.length > 0
      ? Math.round(p1Records.reduce((acc, c) => acc + c.coverageScore, 0) / p1Records.length)
      : 0;

    const p2Score = p2Records.length > 0
      ? Math.round(p2Records.reduce((acc, c) => acc + c.coverageScore, 0) / p2Records.length)
      : 0;

    const overallScore = Math.round((p1Score + p2Score) / 2);

    // Prioritize critical gaps first, then needsQuestions, sorted by lowest published count
    const topPriorityTopicsForGeneration = [...criticalGaps, ...needsQuestions]
      .sort((a, b) => a.totalPublished - b.totalPublished)
      .map((c) => c.topicId);

    return {
      overallCoverageScore: overallScore,
      totalPublishedQuestions: totalPublished,
      criticalGaps,
      needsQuestions,
      paper1CoverageScore: p1Score,
      paper2CoverageScore: p2Score,
      topPriorityTopicsForGeneration,
    };
  }

  /**
   * Recommend practice questions based on candidate weaknesses or underrepresented topics.
   */
  static getRecommendedPracticeTopics(failedTopicIds: string[] = []): string[] {
    const gaps = this.analyzeGaps();
    const recommendations = new Set<string>();

    // First add candidate's struggling topics if any
    for (const tid of failedTopicIds) {
      recommendations.add(tid);
    }

    // Next add highest priority syllabus gap topics
    for (const tid of gaps.topPriorityTopicsForGeneration) {
      recommendations.add(tid);
      if (recommendations.size >= 5) break;
    }

    return Array.from(recommendations);
  }
}
