import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { DailyIngestionScheduler } from "@/lib/pipeline/scheduler";
import { QuestionGeneratorService } from "@/lib/pipeline/question-generator";
import { TeluguTranslationService } from "@/lib/pipeline/translator";
import { QuestionValidationEngine } from "@/lib/pipeline/validator";
import { SyllabusCoverageEngine } from "@/lib/pipeline/coverage-engine";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const examConfig = db.getExamConfig();
  const topics = db.getSyllabusTopics();
  const questions = db.getQuestions();
  const auditLogs = db.getAuditLogs();

  // Question Intelligence entities
  const contentSources = db.getContentSources();
  const ingestionJobs = db.getIngestionJobs(10);
  const questionCandidates = db.getQuestionCandidates();
  const syllabusCoverage = db.getSyllabusCoverage();
  const latestSyncReport = db.getLatestDailySyncReport();
  const dailySyncReports = db.getDailySyncReports(15);

  async function handleUpdateExamConfig(config: any) {
    "use server";
    db.updateExamConfig(config, "admin_user");
    revalidatePath("/admin");
  }

  async function handleApproveQuestion(qId: string) {
    "use server";
    const q = db.getQuestion(qId);
    if (q) {
      q.validationStatus = "approved";
      q.reviewedBy = "Admin";
      q.reviewedAt = new Date().toISOString();
      db.saveQuestion(q);
      revalidatePath("/admin");
    }
  }

  async function handleRejectQuestion(qId: string) {
    "use server";
    const q = db.getQuestion(qId);
    if (q) {
      q.validationStatus = "rejected";
      db.saveQuestion(q);
      revalidatePath("/admin");
    }
  }

  async function handleRunSyncNow() {
    "use server";
    await DailyIngestionScheduler.runSynchronization("manual_admin");
    revalidatePath("/admin");
  }

  async function handleFillCoverageGaps(topicId?: string) {
    "use server";
    const targetTopics = topicId
      ? [topicId]
      : SyllabusCoverageEngine.analyzeGaps().topPriorityTopicsForGeneration.slice(0, 3);

    for (const tid of targetTopics) {
      const candidates = QuestionGeneratorService.generateForTopic({
        topicId: tid,
        count: 2,
        jobId: "job_admin_gap_fill",
      });

      for (const cand of candidates) {
        const trans = TeluguTranslationService.translateCandidate(cand);
        cand.questionTextTe = trans.translatedTe;
        cand.explanationTe = trans.explanationTe;
        cand.options = trans.optionsTe;

        const val = QuestionValidationEngine.validate(cand);
        if (val.passed) {
          cand.validationStatus = "verified";
          db.saveQuestionCandidate(cand);
          db.publishCandidate(cand.id, "AdminGapFiller");
        } else {
          cand.validationStatus = "review_required";
          db.saveQuestionCandidate(cand);
        }
      }
    }

    SyllabusCoverageEngine.refreshCoverage();
    revalidatePath("/admin");
  }

  async function handlePublishCandidate(candId: string) {
    "use server";
    db.publishCandidate(candId, "Admin");
    revalidatePath("/admin");
  }

  async function handleRejectCandidate(candId: string, reason: string) {
    "use server";
    db.rejectCandidate(candId, reason);
    revalidatePath("/admin");
  }

  async function handleToggleSource(sourceId: string) {
    "use server";
    const src = db.getContentSource(sourceId);
    if (src) {
      src.isActive = !src.isActive;
      db.saveContentSource(src);
      revalidatePath("/admin");
    }
  }

  return (
    <AppShell initialRole="admin">
      <AdminPortal
        examConfig={examConfig}
        topics={topics}
        questions={questions}
        auditLogs={auditLogs}
        contentSources={contentSources}
        ingestionJobs={ingestionJobs}
        questionCandidates={questionCandidates}
        syllabusCoverage={syllabusCoverage}
        latestSyncReport={latestSyncReport}
        dailySyncReports={dailySyncReports}
        onUpdateExamConfig={handleUpdateExamConfig}
        onApproveQuestion={handleApproveQuestion}
        onRejectQuestion={handleRejectQuestion}
        onRunSyncNow={handleRunSyncNow}
        onFillCoverageGaps={handleFillCoverageGaps}
        onPublishCandidate={handlePublishCandidate}
        onRejectCandidate={handleRejectCandidate}
        onToggleSource={handleToggleSource}
      />
    </AppShell>
  );
}
