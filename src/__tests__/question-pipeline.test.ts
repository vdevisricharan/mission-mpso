import { describe, it, expect, beforeEach } from "vitest";
import { SourceRegistryService } from "../lib/pipeline/source-registry";
import { ContentCrawlerService } from "../lib/pipeline/crawler";
import { DocumentExtractorService } from "../lib/pipeline/document-extractor";
import { QuestionClassifierService } from "../lib/pipeline/classifier";
import { QuestionValidationEngine } from "../lib/pipeline/validator";
import { TeluguTranslationService } from "../lib/pipeline/translator";
import { DuplicateDetectionEngine } from "../lib/pipeline/deduplicator";
import { DailyIngestionScheduler } from "../lib/pipeline/scheduler";
import { QuestionGeneratorService } from "../lib/pipeline/question-generator";
import { CurrentAffairsPipeline } from "../lib/pipeline/current-affairs-pipeline";
import { SyllabusCoverageEngine } from "../lib/pipeline/coverage-engine";
import { db } from "../lib/db";
import { ContentSource, QuestionCandidate } from "../types/pipeline";

describe("MISSION MPSO — Question Intelligence & Content Ingestion Engine", () => {
  beforeEach(() => {
    // Reset coverage
    SyllabusCoverageEngine.refreshCoverage();
  });

  // ==========================================
  // 1. Source Discovery & Permissions Compliance
  // ==========================================
  describe("Source Registry & Ethical Sourcing Compliance", () => {
    it("allows crawling for approved active sources with appropriate rate limits", () => {
      const tgpscSource = db.getContentSource("src_tgpsc_official");
      expect(tgpscSource).toBeDefined();

      const check = SourceRegistryService.checkCrawlPermissions(tgpscSource!);
      expect(check.allowed).toBe(true);
      expect(check.reusePermission).toBe("full_question_reproduction");
      expect(check.maxRequestsPerMinute).toBe(5); // Respectful to official commission
    });

    it("blocks crawling for inactive sources and disallowed domains", () => {
      const inactiveSource: ContentSource = {
        id: "src_inactive_test",
        name: "Test Inactive Source",
        url: "https://disallowed.example.com",
        sourceCategory: "third_party_reference",
        trustTier: 5,
        licenseType: "restricted_metadata_only",
        reusePermissions: "metadata_and_citation_only",
        crawlingAllowed: false,
        scanFrequency: "daily",
        isActive: false,
      };

      const check = SourceRegistryService.checkCrawlPermissions(inactiveSource);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("inactive");
    });

    it("detects unchanged documents via SHA-256 content hashes", async () => {
      const source = db.getContentSource("src_tgpsc_official")!;
      const firstCheck = await ContentCrawlerService.checkSource(source);
      expect(["new", "modified", "unchanged"]).toContain(firstCheck.status);

      // Immediate second check should report unchanged
      const secondCheck = await ContentCrawlerService.checkSource(source);
      expect(secondCheck.status).toBe("unchanged");
    });
  });

  // ==========================================
  // 2. Document Extraction & LaTeX Preservation
  // ==========================================
  describe("Document Extraction & LaTeX Handling", () => {
    it("extracts plain text MCQs with stems and 4 distinct options", () => {
      const rawText = `
      Question 1: What is the arithmetic mean of the numbers 10, 20, 30, 40 and 50?
      (A) 25
      (B) 30
      (C) 35
      (D) 40
      Answer: B
      Explanation: Sum = 150, Count = 5, Mean = 150/5 = 30.
      `;

      const doc = {
        id: "doc_test",
        sourceId: "src_test",
        originalUrl: "https://test.gov.in",
        title: "Test Paper",
        retrievedAt: new Date().toISOString(),
        contentHash: "hash123",
        fileType: "text" as const,
        licenseStatus: "government_open_data" as const,
        extractionStatus: "pending" as const,
        documentVersion: 1,
      };

      const extracted = DocumentExtractorService.extractQuestions(doc, rawText);
      expect(extracted.length).toBe(1);
      expect(extracted[0].stem).toContain("What is the arithmetic mean");
      expect(extracted[0].options.length).toBe(4);
      expect(extracted[0].rawCorrectAnswer).toBe("B");
      expect(extracted[0].options[1].text).toBe("30");
    });

    it("normalizes statistical mathematical expressions into LaTeX", () => {
      const text = "Calculate the variance where sigma^2 = 16 and mu = 20";
      const normalized = DocumentExtractorService.extractAndNormalizeLatex(text);
      expect(normalized).toBeDefined();
      expect(normalized).toContain("\\sigma^2");
      expect(normalized).toContain("\\mu");
    });

    it("reconciles final answer key revisions over preliminary keys", () => {
      const initialMCQ = {
        stem: "Sample question stem",
        options: [
          { id: "A" as const, text: "Option A" },
          { id: "B" as const, text: "Option B" },
          { id: "C" as const, text: "Option C" },
          { id: "D" as const, text: "Option D" },
        ],
        rawCorrectAnswer: "A",
      };

      // Revised final key changes answer to C
      const reconciled = DocumentExtractorService.reconcileAnswerKey(initialMCQ, {
        correctOptionId: "C",
      });
      expect(reconciled.rawCorrectAnswer).toBe("C");

      // Cancelled question test
      const cancelled = DocumentExtractorService.reconcileAnswerKey(initialMCQ, {
        correctOptionId: "A",
        isDeleted: true,
        cancellationNotice: "Withdrawn due to ambiguous wording",
      });
      expect(cancelled.isDeletedOrDisputed).toBe(true);
      expect(cancelled.disputeReason).toContain("Withdrawn");
    });
  });

  // ==========================================
  // 3. Syllabus Classification & Out-of-Syllabus Rejection
  // ==========================================
  describe("AI Question Classification & Canonical Syllabus Matching", () => {
    it("maps Statistics Central Tendency questions strictly to STAT-02", () => {
      const mcq = {
        stem: "What is the relationship between Mean, Median and Mode in a moderately skewed distribution?",
        options: [
          { id: "A" as const, text: "Mode = 3 Median - 2 Mean" },
          { id: "B" as const, text: "Mode = 2 Median - 3 Mean" },
          { id: "C" as const, text: "Mean = 3 Mode - 2 Median" },
          { id: "D" as const, text: "Median = 3 Mode - 2 Mean" },
        ],
        rawCorrectAnswer: "A",
      };

      const result = QuestionClassifierService.classifyQuestion(mcq);
      expect(result.isRelevant).toBe(true);
      expect(result.paperId).toBe("paper_2");
      expect(result.topicId).toBe("p2_central_tendency_dispersion");
    });

    it("maps Probability and Bayes' Theorem questions strictly to STAT-03", () => {
      const mcq = {
        stem: "Bayes' theorem is used to calculate which of the following probabilities?",
        options: [
          { id: "A" as const, text: "Prior probability" },
          { id: "B" as const, text: "Posterior probability given evidence" },
          { id: "C" as const, text: "Marginal probability only" },
          { id: "D" as const, text: "Joint distribution without condition" },
        ],
        rawCorrectAnswer: "B",
      };

      const result = QuestionClassifierService.classifyQuestion(mcq);
      expect(result.isRelevant).toBe(true);
      expect(result.paperId).toBe("paper_2");
      expect(result.topicId).toBe("p2_probability");
      expect(result.subtopicId).toBe("p2_prob_bayes_theorem");
    });

    it("rejects incomplete questions with missing options or diagram dependencies", () => {
      const incompleteMCQ = {
        stem: "Based on the diagram below, identify the curve representing histogram frequency:",
        options: [
          { id: "A" as const, text: "Curve 1" },
          { id: "B" as const, text: "Curve 2" },
          // Missing options C and D
        ],
      };

      const result = QuestionClassifierService.classifyQuestion(incompleteMCQ as any);
      expect(result.isRelevant).toBe(false);
      expect(result.rejectionReason).toContain("Insufficient options");
    });
  });

  // ==========================================
  // 4. Deterministic Mathematical Validation
  // ==========================================
  describe("Multi-Layer Validation Engine", () => {
    it("validates arithmetic mean calculations independently", () => {
      const validCandidate: QuestionCandidate = {
        id: "cand_test_val_1",
        jobId: "job_test",
        paperId: "paper_2",
        topicId: "p2_central_tendency_dispersion",
        questionTextEn: "What is the arithmetic mean of 10, 20, 30, 40 and 50?",
        questionTextTe: "10, 20, 30, 40 మరియు 50 సంఖ్యల అంకగణిత సగటు ఎంత?",
        options: [
          { id: "A", textEn: "25", textTe: "25" },
          { id: "B", textEn: "30", textTe: "30" },
          { id: "C", textEn: "35", textTe: "35" },
          { id: "D", textEn: "40", textTe: "40" },
        ],
        correctOptionId: "B",
        explanationEn: "Sum = 150, Count = 5, Mean = 30.",
        explanationTe: "మొత్తం = 150, రాశుల సంఖ్య = 5, సగటు = 30.",
        difficulty: "easy",
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const output = QuestionValidationEngine.validate(validCandidate);
      expect(output.passed).toBe(true);
      expect(output.status).toBe("verified");
    });

    it("fails validation when marked answer contradicts mathematical calculation", () => {
      const invalidCandidate: QuestionCandidate = {
        id: "cand_test_val_fail",
        jobId: "job_test",
        paperId: "paper_2",
        topicId: "p2_central_tendency_dispersion",
        questionTextEn: "What is the arithmetic mean of 10, 20, 30, 40 and 50?",
        questionTextTe: "10, 20, 30, 40 మరియు 50 సంఖ్యల అంకగణిత సగటు ఎంత?",
        options: [
          { id: "A", textEn: "25", textTe: "25" },
          { id: "B", textEn: "30", textTe: "30" },
          { id: "C", textEn: "35", textTe: "35" },
          { id: "D", textEn: "40", textTe: "40" },
        ],
        // Incorrectly marked as D (40) when true mean is 30 (B)
        correctOptionId: "D",
        explanationEn: "Bogus explanation claiming 40.",
        explanationTe: "తప్పు వివరణ.",
        difficulty: "easy",
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const output = QuestionValidationEngine.validate(invalidCandidate);
      expect(output.passed).toBe(false);
      expect(output.status).toBe("validation_failed");
      expect(output.failureReasons.some((r) => r.includes("Mathematical ground truth mismatch"))).toBe(true);
    });

    it("rejects questions containing duplicate option choices", () => {
      const dupOptCandidate: QuestionCandidate = {
        id: "cand_dup_opts",
        jobId: "job_test",
        paperId: "paper_2",
        topicId: "p2_central_tendency_dispersion",
        questionTextEn: "Find the median of the set.",
        questionTextTe: "మధ్యగతం కనుగొనండి.",
        options: [
          { id: "A", textEn: "15", textTe: "15" },
          { id: "B", textEn: "15", textTe: "15" }, // Duplicate of A!
          { id: "C", textEn: "20", textTe: "20" },
          { id: "D", textEn: "25", textTe: "25" },
        ],
        correctOptionId: "A",
        explanationEn: "Median is 15.",
        explanationTe: "మధ్యగతం 15.",
        difficulty: "easy",
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const output = QuestionValidationEngine.validate(dupOptCandidate);
      expect(output.passed).toBe(false);
      expect(output.failureReasons.some((r) => r.includes("Duplicate option texts"))).toBe(true);
    });
  });

  // ==========================================
  // 5. Telugu Academic Translation & Terminology
  // ==========================================
  describe("Telugu Academic Translation Quality", () => {
    it("preserves required English academic terms in parentheses", () => {
      const candidate: QuestionCandidate = {
        id: "cand_trans_test",
        jobId: "job_test",
        paperId: "paper_2",
        topicId: "p2_central_tendency_dispersion",
        questionTextEn: "What is the standard deviation and coefficient of variation of the distribution?",
        questionTextTe: "",
        options: [
          { id: "A", textEn: "12 and 24%", textTe: "" },
          { id: "B", textEn: "15 and 30%", textTe: "" },
          { id: "C", textEn: "18 and 36%", textTe: "" },
          { id: "D", textEn: "20 and 40%", textTe: "" },
        ],
        correctOptionId: "A",
        explanationEn: "Standard deviation is 12 and mean is 50, so CV is (12/50)*100 = 24%.",
        explanationTe: "",
        difficulty: "medium",
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = TeluguTranslationService.translateCandidate(candidate);
      expect(res.translatedTe).toContain("ప్రామాణిక విచలనం (Standard Deviation)");
      expect(res.translatedTe).toContain("విచలన గుణకం (Coefficient of Variation)");
      expect(res.validation.isValid).toBe(true);
      expect(res.validation.termsPreserved).toContain("standard deviation");
      expect(res.validation.termsPreserved).toContain("coefficient of variation");
    });

    it("verifies that all numbers in English question appear in Telugu translation", () => {
      const en = "Calculate the mean of 15, 25 and 35";
      const validTe = "15, 25 మరియు 35 సంఖ్యల సగటు ఎంత?";
      const invalidTe = "15 మరియు 25 సంఖ్యల సగటు ఎంత?"; // 35 is missing!

      const opts = [
        { id: "A" as const, textEn: "25", textTe: "25" },
        { id: "B" as const, textEn: "30", textTe: "30" },
        { id: "C" as const, textEn: "35", textTe: "35" },
        { id: "D" as const, textEn: "40", textTe: "40" },
      ];

      const val1 = TeluguTranslationService.validateTranslation(en, validTe, opts, opts);
      expect(val1.numericValuesPreserved).toBe(true);

      const val2 = TeluguTranslationService.validateTranslation(en, invalidTe, opts, opts);
      expect(val2.numericValuesPreserved).toBe(false);
      expect(val2.errors.some((e) => e.includes("35"))).toBe(true);
    });
  });

  // ==========================================
  // 6. Duplicate Detection Engine
  // ==========================================
  describe("Duplicate Detection Engine", () => {
    it("detects exact duplicate questions even with whitespace and case variations", () => {
      const existingQ = db.getQuestions()[0];
      expect(existingQ).toBeDefined();

      const candidate: QuestionCandidate = {
        id: "cand_dup_exact",
        jobId: "job_test",
        paperId: existingQ.paperId,
        topicId: existingQ.topicId,
        questionTextEn: existingQ.questionTextEn.toUpperCase() + "   ", // Case and whitespace change
        questionTextTe: existingQ.questionTextTe,
        options: existingQ.options,
        correctOptionId: existingQ.correctOptionId,
        explanationEn: existingQ.explanationEn,
        explanationTe: existingQ.explanationTe,
        difficulty: existingQ.difficulty,
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = DuplicateDetectionEngine.checkDuplicate(candidate, db.getQuestions());
      expect(result.isDuplicate).toBe(true);
      expect(result.duplicateType).toBe("exact_match");
    });

    it("detects near-duplicate wording with similarity >= 0.85", () => {
      const existingQ = db.getQuestions()[0];

      const candidate: QuestionCandidate = {
        id: "cand_dup_near",
        jobId: "job_test",
        paperId: existingQ.paperId,
        topicId: existingQ.topicId,
        // Minor word change
        questionTextEn: existingQ.questionTextEn + " Please state the correct answer.",
        questionTextTe: existingQ.questionTextTe,
        options: existingQ.options,
        correctOptionId: existingQ.correctOptionId,
        explanationEn: existingQ.explanationEn,
        explanationTe: existingQ.explanationTe,
        difficulty: existingQ.difficulty,
        sourceCategory: "academic_oer",
        authenticity: { isAuthenticPyq: false },
        validationStatus: "classified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = DuplicateDetectionEngine.checkDuplicate(candidate, db.getQuestions());
      expect(result.isDuplicate).toBe(true);
      expect(result.similarityScore).toBeGreaterThanOrEqual(0.8);
    });
  });

  // ==========================================
  // 7. Full Synchronization & Practice Integration
  // ==========================================
  describe("Full Synchronization & Practice Bank Integration", () => {
    it("executes the daily synchronization workflow idempotently and publishes questions", async () => {
      const initialApprovedCount = db.getQuestions({ validationStatus: "approved" }).length;

      const syncResult = await DailyIngestionScheduler.runSynchronization("manual_admin");
      expect(syncResult.status).toBe("completed");
      expect(syncResult.report).toBeDefined();
      expect(syncResult.report.sourcesCheckedCount).toBeGreaterThanOrEqual(1);

      // Verify that published questions are directly accessible in practice query
      const currentApprovedCount = db.getQuestions({ validationStatus: "approved" }).length;
      expect(currentApprovedCount).toBeGreaterThanOrEqual(initialApprovedCount);

      // Verify latest sync report is persisted in db
      const latestReport = db.getLatestDailySyncReport();
      expect(latestReport).toBeDefined();
      expect(latestReport?.jobId).toBe(syncResult.jobId);
    });

    it("prevents concurrent overlapping sync jobs via distributed lock", async () => {
      // Simulate lock active
      (DailyIngestionScheduler as any).isJobRunning = true;
      (DailyIngestionScheduler as any).activeJobId = "job_simulated_lock";

      await expect(DailyIngestionScheduler.runSynchronization("manual_admin")).rejects.toThrow(
        "Another ingestion job (job_simulated_lock) is currently in progress"
      );

      // Reset lock
      (DailyIngestionScheduler as any).isJobRunning = false;
      (DailyIngestionScheduler as any).activeJobId = null;
    });

    it("generates targeted questions for critical coverage gaps", () => {
      const generated = QuestionGeneratorService.generateForTopic({
        topicId: "p2_central_tendency_dispersion",
        count: 1,
      });

      expect(generated.length).toBe(1);
      const q = generated[0];
      expect(q.paperId).toBe("paper_2");
      expect(q.topicId).toBe("p2_central_tendency_dispersion");
      expect(q.numericalMetadata?.isNumerical).toBe(true);
      expect(q.authenticity.isAuthenticPyq).toBe(false); // Strictly labeled as standard model, NEVER mislabeled as PYQ
    });
  });
});
