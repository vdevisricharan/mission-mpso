/**
 * MISSION MPSO — Multi-Level Duplicate Detection Engine
 * Level 1: Exact Normalized Content Hash
 * Level 2: Near Duplicate (Token Jaccard / Levenshtein Similarity >= 0.85)
 * Level 3: Conceptual Repetition (Same formula/concept with different numeric values)
 */

import crypto from "crypto";
import { QuestionCandidate } from "@/types/pipeline";
import { Question } from "@/types/question";

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  duplicateType?: "exact_match" | "near_duplicate" | "conceptual_variant";
  matchedQuestionId?: string;
  similarityScore: number; // 0 - 1.0
  reason?: string;
}

export class DuplicateDetectionEngine {
  /**
   * Normalize text for exact hash matching:
   * lowercases, strips punctuation, normalizes unicode and whitespace.
   */
  static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s\u0C00-\u0C7F]/g, "") // Keep English words & Telugu Unicode range
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Generate normalized SHA-256 hash.
   */
  static generateExactHash(stem: string, optionsText: string): string {
    const combined = `${this.normalizeText(stem)}_${this.normalizeText(optionsText)}`;
    return crypto.createHash("sha256").update(combined).digest("hex");
  }

  /**
   * Compute token-based similarity between two strings, combining Jaccard
   * and containment metrics to detect minor edits and appended boilerplate.
   */
  static computeJaccardSimilarity(textA: string, textB: string): number {
    const tokensA = new Set(this.normalizeText(textA).split(" ").filter(Boolean));
    const tokensB = new Set(this.normalizeText(textB).split(" ").filter(Boolean));

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let intersectionSize = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) {
        intersectionSize++;
      }
    }

    const unionSize = new Set([...tokensA, ...tokensB]).size;
    const jaccard = unionSize === 0 ? 0 : intersectionSize / unionSize;
    const minTokens = Math.min(tokensA.size, tokensB.size);
    const containment = minTokens === 0 ? 0 : intersectionSize / minTokens;

    // Return the stronger of standard Jaccard and scaled containment similarity
    return Math.max(jaccard, containment * 0.88);
  }

  /**
   * Check candidate against existing questions bank and staged candidates.
   */
  static checkDuplicate(
    candidate: QuestionCandidate,
    existingQuestions: Question[],
    stagedCandidates: QuestionCandidate[] = []
  ): DuplicateDetectionResult {
    const candidateStemEn = candidate.questionTextEn;
    const candidateOptionsStr = candidate.options.map((o) => o.textEn).sort().join(" ");
    const candidateHash = this.generateExactHash(candidateStemEn, candidateOptionsStr);

    // 1. Level 1: Check Exact Match against existing questions
    for (const q of existingQuestions) {
      const qOptionsStr = q.options.map((o) => o.textEn).sort().join(" ");
      const qHash = this.generateExactHash(q.questionTextEn, qOptionsStr);
      if (candidateHash === qHash) {
        return {
          isDuplicate: true,
          duplicateType: "exact_match",
          matchedQuestionId: q.id,
          similarityScore: 1.0,
          reason: `Exact match detected with existing published question: ${q.id}`,
        };
      }
    }

    // Check exact match against staged candidates
    for (const staged of stagedCandidates) {
      if (staged.id === candidate.id) continue;
      const sOptionsStr = staged.options.map((o) => o.textEn).sort().join(" ");
      const sHash = this.generateExactHash(staged.questionTextEn, sOptionsStr);
      if (candidateHash === sHash) {
        return {
          isDuplicate: true,
          duplicateType: "exact_match",
          matchedQuestionId: staged.id,
          similarityScore: 1.0,
          reason: `Exact match detected with staged candidate: ${staged.id}`,
        };
      }
    }

    // 2. Level 2: Near Duplicate Check (Similarity >= 0.85)
    for (const q of existingQuestions) {
      // Only compare questions in the same topic for performance and relevance
      if (q.topicId !== candidate.topicId) continue;

      const sim = this.computeJaccardSimilarity(candidateStemEn, q.questionTextEn);
      if (sim >= 0.85) {
        return {
          isDuplicate: true,
          duplicateType: "near_duplicate",
          matchedQuestionId: q.id,
          similarityScore: sim,
          reason: `Near duplicate wording (${Math.round(sim * 100)}% similarity) with question ${q.id}`,
        };
      }
    }

    // 3. Level 3: Conceptual Variant Detection
    // Checks if same formula/concept is tested with different numerical values
    if (candidate.relevantFormulaLatex) {
      for (const q of existingQuestions) {
        if (q.topicId === candidate.topicId && q.relevantFormulaLatex === candidate.relevantFormulaLatex) {
          const sim = this.computeJaccardSimilarity(candidateStemEn, q.questionTextEn);
          if (sim >= 0.50 && sim < 0.85) {
            return {
              isDuplicate: false, // NOT rejected, allowed as concept reinforcement variant
              duplicateType: "conceptual_variant",
              matchedQuestionId: q.id,
              similarityScore: sim,
              reason: `Valuable conceptual variant for spaced repetition of formula: ${candidate.relevantFormulaLatex}`,
            };
          }
        }
      }
    }

    return {
      isDuplicate: false,
      similarityScore: 0,
    };
  }
}
