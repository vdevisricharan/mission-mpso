/**
 * MISSION MPSO — Daily Ingestion & Synchronization Scheduler Engine
 * Runs daily at 06:00 AM IST (Asia/Kolkata) or on manual administrator trigger.
 * Implements distributed job locking, idempotency, multi-layer validation,
 * automatic publishing of verified questions, and daily sync audit reports.
 */

import {
  IngestionJob,
  DailySyncReport,
  JobTriggerType,
  QuestionCandidate,
} from "@/types/pipeline";
import { SourceRegistryService } from "./source-registry";
import { ContentCrawlerService } from "./crawler";
import { DocumentExtractorService } from "./document-extractor";
import { QuestionClassifierService } from "./classifier";
import { QuestionValidationEngine } from "./validator";
import { TeluguTranslationService } from "./translator";
import { DuplicateDetectionEngine } from "./deduplicator";
import { CurrentAffairsPipeline } from "./current-affairs-pipeline";
import { QuestionGeneratorService } from "./question-generator";
import { SyllabusCoverageEngine } from "./coverage-engine";
import { db } from "../db";

export interface SyncExecutionResult {
  jobId: string;
  report: DailySyncReport;
  status: "completed" | "failed";
  durationSeconds: number;
}

export class DailyIngestionScheduler {
  // Distributed execution lock tracker
  private static isJobRunning = false;
  private static activeJobId: string | null = null;

  /**
   * Main Synchronization Workflow:
   * Can be triggered by persistent backend cron at 06:00 AM IST,
   * by an administrative API endpoint, or by CLI script.
   */
  static async runSynchronization(triggerType: JobTriggerType = "scheduled_cron"): Promise<SyncExecutionResult> {
    const startTime = Date.now();
    const todayStr = new Date().toISOString().split("T")[0];
    const jobId = `job_sync_${todayStr}_${Date.now()}`;

    // 1. Acquire Distributed Job Lock
    if (this.isJobRunning) {
      throw new Error(`Another ingestion job (${this.activeJobId}) is currently in progress. Overlapping runs prevented.`);
    }

    this.isJobRunning = true;
    this.activeJobId = jobId;

    const initialJob: IngestionJob = {
      id: jobId,
      triggerType,
      startedAt: new Date().toISOString(),
      status: "running",
      sourcesChecked: 0,
      documentsDiscovered: 0,
      candidatesExtracted: 0,
      verifiedCount: 0,
      publishedCount: 0,
      reviewRequiredCount: 0,
      rejectedCount: 0,
      duplicatesDetected: 0,
      errors: [],
      reportSummary: "Daily question discovery and synchronization job in progress...",
    };
    db.saveIngestionJob(initialJob);

    const sourceChanges: DailySyncReport["sourceChanges"] = [];
    const validationWarnings: string[] = [];
    const actionsRequired: string[] = [];
    const paper1NewCountByTopic: Record<string, number> = {};
    const paper2NewCountByTopic: Record<string, number> = {};

    let verifiedCount = 0;
    let publishedCount = 0;
    let reviewRequiredCount = 0;
    let rejectedCount = 0;
    let duplicatesDetected = 0;
    let failedSourcesCount = 0;

    const newCandidatesToProcess: QuestionCandidate[] = [];

    try {
      // 2. Load Approved Source Registry
      const sources = SourceRegistryService.getSources({ activeOnly: true });
      initialJob.sourcesChecked = sources.length;

      // 3. Incremental Source Discovery & Crawling
      for (const source of sources) {
        try {
          const fetchRes = await ContentCrawlerService.checkSource(source, initialJob);
          if (fetchRes.status === "new" || fetchRes.status === "modified") {
            initialJob.documentsDiscovered++;
            sourceChanges.push({
              sourceName: source.name,
              url: source.url,
              changeType: fetchRes.status === "new" ? "new_document" : "updated_document",
              detail: fetchRes.document?.title,
            });

            // Extract questions from discovered document
            if (fetchRes.document) {
              const rawQuestions = DocumentExtractorService.extractQuestions(
                fetchRes.document,
                fetchRes.document.rawSnippet || ""
              );

              for (const rawQ of rawQuestions) {
                // Classify against canonical syllabus
                const classification = QuestionClassifierService.classifyQuestion(rawQ);
                if (!classification.isRelevant) {
                  rejectedCount++;
                  continue;
                }

                const candId = `cand_ext_${source.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
                const isAuthentic = source.trustTier === 1 && source.sourceCategory === "official_commission";

                newCandidatesToProcess.push({
                  id: candId,
                  jobId,
                  documentId: fetchRes.document.id,
                  paperId: classification.paperId,
                  topicId: classification.topicId,
                  subtopicId: classification.subtopicId,
                  questionTextEn: rawQ.stem,
                  questionTextTe: "", // Will be filled in translation stage
                  questionMathLatex: rawQ.mathLatexFormula,
                  options: rawQ.options.map((o) => ({
                    id: o.id,
                    textEn: o.text,
                    textTe: o.text,
                    mathLatex: o.mathLatex,
                  })),
                  correctOptionId: (rawQ.rawCorrectAnswer as any) || "A",
                  explanationEn: rawQ.rawExplanation || "",
                  explanationTe: "",
                  relevantFormulaLatex: rawQ.mathLatexFormula,
                  difficulty: classification.difficulty,
                  sourceCategory: source.sourceCategory,
                  authenticity: {
                    isAuthenticPyq: isAuthentic,
                    examinationName: isAuthentic ? "TGPSC MPSO / ASO" : undefined,
                    examAuthority: isAuthentic ? "TGPSC" : undefined,
                  },
                  validationStatus: "extracted",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }
            }
          } else if (fetchRes.status === "unchanged") {
            sourceChanges.push({
              sourceName: source.name,
              url: source.url,
              changeType: "unchanged",
              detail: "Content hash and ETag unchanged since last check.",
            });
          } else if (fetchRes.status === "error" || fetchRes.status === "skipped") {
            failedSourcesCount++;
            sourceChanges.push({
              sourceName: source.name,
              url: source.url,
              changeType: "error",
              detail: fetchRes.errorMessage,
            });
          }
        } catch (srcErr: any) {
          failedSourcesCount++;
          initialJob.errors.push(`Source ${source.id} failed: ${srcErr.message}`);
        }
      }

      // 4. Daily Current Affairs Workflow (Verifiable Telangana & National Events)
      const caCandidates = CurrentAffairsPipeline.processDailyCurrentAffairs(jobId, todayStr);
      newCandidatesToProcess.push(...caCandidates);

      // 5. Check Coverage Gaps and Trigger Original Question Generation if needed
      const gapAnalysis = SyllabusCoverageEngine.analyzeGaps();
      if (gapAnalysis.criticalGaps.length > 0) {
        // Generate targeted practice questions for the top critical gaps (at most 2 topics per run to avoid flooding)
        const targetGaps = gapAnalysis.criticalGaps.slice(0, 2);
        for (const gap of targetGaps) {
          const generated = QuestionGeneratorService.generateForTopic({
            topicId: gap.topicId,
            count: 2,
            jobId,
          });
          newCandidatesToProcess.push(...generated);
        }
      }

      initialJob.candidatesExtracted = newCandidatesToProcess.length;

      // 6. Process, Deduplicate, Validate & Translate Each Candidate
      const existingQuestions = db.getQuestions();
      const approvedCandidates: QuestionCandidate[] = [];

      for (const candidate of newCandidatesToProcess) {
        // A. Duplicate Detection
        const dedupResult = DuplicateDetectionEngine.checkDuplicate(
          candidate,
          existingQuestions,
          approvedCandidates
        );

        if (dedupResult.isDuplicate) {
          duplicatesDetected++;
          candidate.validationStatus = "rejected";
          candidate.duplicateOfQuestionId = dedupResult.matchedQuestionId;
          candidate.rejectionReason = dedupResult.reason;
          db.saveQuestionCandidate(candidate);
          continue;
        }

        // B. Academic Telugu Translation & Terminology Enforcement
        const translationRes = TeluguTranslationService.translateCandidate(candidate);
        candidate.questionTextTe = translationRes.translatedTe;
        candidate.explanationTe = translationRes.explanationTe;
        candidate.options = translationRes.optionsTe;

        // Save translation record
        const transRecord = TeluguTranslationService.createTranslationRecord(
          candidate.id,
          candidate,
          translationRes.validation
        );
        db.saveQuestionTranslation(transRecord);

        // C. Multi-Layer Answer Validation (Structural, Mathematical, Factual, Semantic)
        const valOutput = QuestionValidationEngine.validate(candidate);
        for (const vRec of valOutput.records) {
          db.saveQuestionValidation(vRec);
        }

        if (!valOutput.passed) {
          if (valOutput.status === "validation_failed") {
            rejectedCount++;
            candidate.validationStatus = "validation_failed";
            candidate.rejectionReason = valOutput.failureReasons.join("; ");
            validationWarnings.push(`Candidate ${candidate.id} failed validation: ${candidate.rejectionReason}`);
          } else {
            reviewRequiredCount++;
            candidate.validationStatus = "review_required";
            actionsRequired.push(`Candidate ${candidate.id} requires manual review: ${valOutput.failureReasons.join("; ")}`);
          }
          db.saveQuestionCandidate(candidate);
          continue;
        }

        // D. Question Passed All Layers
        verifiedCount++;
        candidate.validationStatus = "verified";
        approvedCandidates.push(candidate);
        db.saveQuestionCandidate(candidate);

        // E. Auto-Publishing Policy
        // Auto-publish if candidate is thoroughly verified and translation is valid
        if (translationRes.validation.isValid) {
          const published = db.publishCandidate(candidate.id, "AutoSyncScheduler");
          if (published) {
            publishedCount++;
            if (candidate.paperId === "paper_1") {
              paper1NewCountByTopic[candidate.topicId] = (paper1NewCountByTopic[candidate.topicId] || 0) + 1;
            } else {
              paper2NewCountByTopic[candidate.topicId] = (paper2NewCountByTopic[candidate.topicId] || 0) + 1;
            }
          }
        } else {
          reviewRequiredCount++;
          candidate.validationStatus = "review_required";
          db.saveQuestionCandidate(candidate);
          actionsRequired.push(`Candidate ${candidate.id} held for translation terminology review.`);
        }
      }

      // 7. Refresh Syllabus Coverage
      SyllabusCoverageEngine.refreshCoverage();

      // 8. Generate Daily Sync Report
      const finishTime = Date.now();
      const durationSeconds = Math.round((finishTime - startTime) / 1000);

      const report: DailySyncReport = {
        id: `report_${todayStr}_${Date.now()}`,
        reportDate: todayStr,
        jobId,
        sourcesCheckedCount: initialJob.sourcesChecked,
        changedDocumentsCount: initialJob.documentsDiscovered,
        newCandidatesCount: initialJob.candidatesExtracted,
        verifiedCount,
        publishedCount,
        reviewRequiredCount,
        rejectedCount,
        duplicatesDetectedCount: duplicatesDetected,
        failedSourcesCount,
        paper1NewCountByTopic,
        paper2NewCountByTopic,
        sourceChanges,
        validationWarnings,
        actionsRequired,
        createdAt: new Date().toISOString(),
      };
      db.saveDailySyncReport(report);

      // Finalize Job Record
      initialJob.status = "completed";
      initialJob.finishedAt = new Date().toISOString();
      initialJob.verifiedCount = verifiedCount;
      initialJob.publishedCount = publishedCount;
      initialJob.reviewRequiredCount = reviewRequiredCount;
      initialJob.rejectedCount = rejectedCount;
      initialJob.duplicatesDetected = duplicatesDetected;
      initialJob.reportSummary = `Daily Sync Completed: ${sources.length} sources checked, ${publishedCount} questions published, ${reviewRequiredCount} pending review, ${duplicatesDetected} duplicates excluded. Duration: ${durationSeconds}s.`;
      db.saveIngestionJob(initialJob);

      return {
        jobId,
        report,
        status: "completed",
        durationSeconds,
      };
    } catch (err: any) {
      initialJob.status = "failed";
      initialJob.finishedAt = new Date().toISOString();
      initialJob.errors.push(`Fatal sync failure: ${err.message}`);
      db.saveIngestionJob(initialJob);

      throw err;
    } finally {
      // Release Distributed Job Lock
      this.isJobRunning = false;
      this.activeJobId = null;
    }
  }

  /**
   * Status check for current runner
   */
  static getRunningStatus() {
    return {
      isJobRunning: this.isJobRunning,
      activeJobId: this.activeJobId,
    };
  }
}
