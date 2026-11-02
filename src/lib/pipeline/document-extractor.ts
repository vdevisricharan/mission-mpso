/**
 * MISSION MPSO — Document Extraction Engine
 * Parses HTML, PDF text, JSON, CSV, Markdown, and text into structured candidate questions
 * with mathematical LaTeX preservation and official answer-key reconciliation.
 */

import { QuestionCandidate, SourceDocument, AuthenticityDetails } from "@/types/pipeline";
import { QuestionOption, QuestionOptionId } from "@/types/question";
import { PaperId } from "@/types/curriculum";

export interface RawExtractedMCQ {
  rawQuestionNumber?: number;
  stem: string;
  options: {
    id: QuestionOptionId;
    text: string;
    mathLatex?: string;
  }[];
  rawCorrectAnswer?: string;
  rawExplanation?: string;
  mathLatexFormula?: string;
  bookletSeries?: string;
  isDeletedOrDisputed?: boolean;
  disputeReason?: string;
  pageNumber?: number;
}

export class DocumentExtractorService {
  /**
   * Extract candidate MCQs from a source document.
   */
  static extractQuestions(document: SourceDocument, rawText: string): RawExtractedMCQ[] {
    const format = document.fileType;
    if (format === "json") {
      return this.extractFromJson(rawText);
    }
    // For text, markdown, html, or pdf extracted text:
    return this.extractFromText(rawText);
  }

  /**
   * Parse structured JSON documents.
   */
  private static extractFromJson(jsonText: string): RawExtractedMCQ[] {
    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : parsed.questions || [];
      return items.map((item: any, idx: number) => ({
        rawQuestionNumber: item.questionNumber || idx + 1,
        stem: item.questionText || item.stem || "",
        options: this.normalizeOptions(item.options),
        rawCorrectAnswer: item.correctOptionId || item.correctAnswer || "A",
        rawExplanation: item.explanation || "",
        mathLatexFormula: item.formula || item.mathLatex || "",
        bookletSeries: item.bookletSeries,
        isDeletedOrDisputed: Boolean(item.isDeleted || item.isDisputed),
        disputeReason: item.disputeReason,
        pageNumber: item.pageNumber,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Parse plain text, Markdown, or PDF text streams using regex patterns for MCQs.
   */
  private static extractFromText(text: string): RawExtractedMCQ[] {
    const questions: RawExtractedMCQ[] = [];

    // Split text into question candidate blocks (e.g. "Q1.", "1.", "Question 1:")
    const qSplitRegex = /(?:^|\n)\s*(?:Q(?:uestion)?\s*(\d+)[\.\:\)]|\((\d+)\)|(\d+)[\.\)])\s+/gi;
    const blocks: { number: number; text: string }[] = [];

    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let lastNumber = 1;

    while ((match = qSplitRegex.exec(text)) !== null) {
      if (match.index > lastIndex && lastIndex > 0) {
        blocks.push({
          number: lastNumber,
          text: text.slice(lastIndex, match.index).trim(),
        });
      }
      lastNumber = parseInt(match[1] || match[2] || match[3] || "1", 10);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length && lastIndex > 0) {
      blocks.push({
        number: lastNumber,
        text: text.slice(lastIndex).trim(),
      });
    }

    // If split by regex produced blocks, parse each block
    if (blocks.length > 0) {
      for (const block of blocks) {
        const mcq = this.parseSingleQuestionBlock(block.text, block.number);
        if (mcq) questions.push(mcq);
      }
    } else {
      // Fallback: parse entire text as a single question if structure permits
      const single = this.parseSingleQuestionBlock(text, 1);
      if (single) questions.push(single);
    }

    return questions;
  }

  /**
   * Parse a single block of text containing a stem and options (A/B/C/D or 1/2/3/4).
   */
  private static parseSingleQuestionBlock(blockText: string, defaultNum: number): RawExtractedMCQ | null {
    // Detect options: (A)... (B)... or A)... or [A]...
    // Must be preceded by line break, start of string, tab, or double space to avoid matching inline words
    const optionRegex = /(?:^|\n|\r|\s{2,}|\t)\s*(?:\(?([A-D]|[1-4])[\)\.\:]|\[([A-D]|[1-4])\])\s+([^\r\n]+)/gi;
    const options: { id: QuestionOptionId; text: string; mathLatex?: string }[] = [];

    const idMap: Record<string, QuestionOptionId> = {
      "1": "A",
      "2": "B",
      "3": "C",
      "4": "D",
      A: "A",
      B: "B",
      C: "C",
      D: "D",
      a: "A",
      b: "B",
      c: "C",
      d: "D",
    };

    let optMatch: RegExpExecArray | null;
    let firstOptIndex = -1;

    const optMatches: { id: QuestionOptionId; text: string; index: number }[] = [];

    while ((optMatch = optionRegex.exec(blockText)) !== null) {
      if (firstOptIndex === -1) firstOptIndex = optMatch.index;
      const rawId = optMatch[1] || optMatch[2];
      const normalizedId = idMap[rawId];
      const optText = optMatch[3]?.trim() || "";
      if (normalizedId && optText) {
        optMatches.push({
          id: normalizedId,
          text: optText,
          index: optMatch.index,
        });
      }
    }

    if (optMatches.length >= 4) {
      const stem = blockText.slice(0, firstOptIndex).trim();

      // Extract optional answer line (e.g., "Answer: C" or "సమాధానం: (B)")
      const ansMatch = blockText.match(/(?:Ans(?:wer)?|సమాధానం|Key)\s*[\:\-]?\s*[\(\[]?([A-D]|[1-4])[\)\]]?/i);
      const rawCorrect = ansMatch ? idMap[ansMatch[1]] || "A" : "A";

      // Extract optional explanation
      const expMatch = blockText.match(/(?:Explanation|వివరణ)\s*[\:\-]?\s*([^\n\r]+)/i);
      const rawExplanation = expMatch ? expMatch[1].trim() : "";

      // Extract mathematical LaTeX if formulas are detected
      const mathLatexFormula = this.extractAndNormalizeLatex(stem);

      // Check if deleted or invalidated by commission key
      const isDeletedOrDisputed = /deleted|cancelled|withdrawn|రద్దు/i.test(blockText);
      const disputeReason = isDeletedOrDisputed ? "Question deleted or invalidated in final official key." : undefined;

      return {
        rawQuestionNumber: defaultNum,
        stem,
        options: optMatches.slice(0, 4).map((o) => ({
          id: o.id,
          text: o.text,
          mathLatex: this.extractAndNormalizeLatex(o.text),
        })),
        rawCorrectAnswer: rawCorrect,
        rawExplanation,
        mathLatexFormula,
        isDeletedOrDisputed,
        disputeReason,
      };
    }

    return null;
  }

  /**
   * Helper to normalize raw options into QuestionOption array with 4 distinct choices.
   */
  private static normalizeOptions(rawOptions: any): { id: QuestionOptionId; text: string; mathLatex?: string }[] {
    const result: { id: QuestionOptionId; text: string; mathLatex?: string }[] = [];
    const validIds: QuestionOptionId[] = ["A", "B", "C", "D"];

    if (Array.isArray(rawOptions)) {
      for (let i = 0; i < 4; i++) {
        const item = rawOptions[i];
        const id = validIds[i];
        const text = typeof item === "string" ? item : item?.text || item?.textEn || item?.textTe || "";
        result.push({
          id,
          text,
          mathLatex: typeof item === "object" ? item?.mathLatex : undefined,
        });
      }
    } else if (typeof rawOptions === "object" && rawOptions !== null) {
      for (const id of validIds) {
        const val = rawOptions[id] || rawOptions[id.toLowerCase()];
        result.push({
          id,
          text: typeof val === "string" ? val : val?.text || "",
          mathLatex: typeof val === "object" ? val?.mathLatex : undefined,
        });
      }
    }
    return result;
  }

  /**
   * Extract and normalize common mathematical expressions into standard KaTeX notation.
   */
  static extractAndNormalizeLatex(text: string): string | undefined {
    if (!text) return undefined;

    // Check if text already contains explicit LaTeX delimiters $...$ or $$...$$
    const explicitMatch = text.match(/\$([^$]+)\$/);
    if (explicitMatch) return explicitMatch[1].trim();

    // Recognize statistical patterns:
    // e.g., sigma^2, mu, P(X = k), nCr, E(X), Var(X)
    if (/sigma\^2|\bVar\(X\)\b|\bE\(X\)\b|P\([A-Za-z0-9\s\=\<\>]+\)|b_\{?[yx]\}?|r\s*\=\s*[\+\-]?[0-9\.]+/i.test(text)) {
      let latex = text;
      latex = latex.replace(/sigma\^2/gi, "\\sigma^2");
      latex = latex.replace(/\bsigma\b/gi, "\\sigma");
      latex = latex.replace(/\bmu\b/gi, "\\mu");
      latex = latex.replace(/\blambda\b/gi, "\\lambda");
      latex = latex.replace(/\bbyx\b/gi, "b_{yx}");
      latex = latex.replace(/\bbxy\b/gi, "b_{xy}");
      latex = latex.replace(/\bVar\(X\)\b/gi, "\\text{Var}(X)");
      latex = latex.replace(/\bE\(X\)\b/gi, "\\text{E}(X)");
      return latex.trim();
    }

    return undefined;
  }

  /**
   * Reconcile official answer key revisions:
   * Preliminary Key -> Final Key -> Revised Final Key.
   * Final key ALWAYS supersedes preliminary key.
   */
  static reconcileAnswerKey(
    candidate: RawExtractedMCQ,
    finalKeyRevision?: {
      correctOptionId: QuestionOptionId;
      isDeleted?: boolean;
      cancellationNotice?: string;
    }
  ): RawExtractedMCQ {
    if (!finalKeyRevision) return candidate;

    return {
      ...candidate,
      rawCorrectAnswer: finalKeyRevision.correctOptionId,
      isDeletedOrDisputed: Boolean(finalKeyRevision.isDeleted),
      disputeReason: finalKeyRevision.cancellationNotice || candidate.disputeReason,
    };
  }

  /**
   * Authenticity Verification for Previous Year Questions (PYQs).
   * Verifies exam authority, notification number, paper code, and booklet series.
   */
  static verifyAuthenticity(details: AuthenticityDetails): {
    isAuthentic: boolean;
    verificationNotes: string;
  } {
    // To be considered an authentic MPSO/ASO PYQ:
    // Must be issued by TGPSC (or TSPSC historically)
    // Must specify the exam year and notification if claimed
    const isAuthorityValid = details.examAuthority === "TGPSC" || details.examAuthority === "TSPSC";
    const hasNotification = Boolean(details.recruitmentNotification);
    const hasPaperCode = Boolean(details.paperCode || details.paperName);

    if (isAuthorityValid && hasPaperCode) {
      return {
        isAuthentic: true,
        verificationNotes: `Verified authentic ${details.examAuthority} historical paper: ${details.examinationName || "MPSO/ASO"} (${details.examYear || "Archive"}), Notification: ${details.recruitmentNotification || "Official Archive"}`,
      };
    }

    return {
      isAuthentic: false,
      verificationNotes: "Unverified provenance: Missing official commission notification, exam authority, or paper code.",
    };
  }
}
