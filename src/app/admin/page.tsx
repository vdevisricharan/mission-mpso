import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const examConfig = db.getExamConfig();
  const topics = db.getSyllabusTopics();
  const questions = db.getQuestions();
  const auditLogs = db.getAuditLogs();

  async function handleUpdateExamConfig(config: any) {
    "use server";
    db.updateExamConfig(config, "admin_user");
  }

  async function handleApproveQuestion(qId: string) {
    "use server";
    const q = db.getQuestion(qId);
    if (q) {
      q.validationStatus = "approved";
      q.reviewedBy = "Admin";
      q.reviewedAt = new Date().toISOString();
      db.saveQuestion(q);
    }
  }

  async function handleRejectQuestion(qId: string) {
    "use server";
    const q = db.getQuestion(qId);
    if (q) {
      q.validationStatus = "rejected";
      db.saveQuestion(q);
    }
  }

  return (
    <AppShell initialRole="admin">
      <AdminPortal
        examConfig={examConfig}
        topics={topics}
        questions={questions}
        auditLogs={auditLogs}
        onUpdateExamConfig={handleUpdateExamConfig}
        onApproveQuestion={handleApproveQuestion}
        onRejectQuestion={handleRejectQuestion}
      />
    </AppShell>
  );
}
