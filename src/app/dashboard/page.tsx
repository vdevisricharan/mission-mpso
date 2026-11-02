import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const examConfig = db.getExamConfig();
  const studyPlan = MasteryEngine.getOrCreateDailyPlan(userId);
  const mistakes = db.getMistakes(userId).filter((m) => !m.isResolved);
  const dueRevisions = db.getDueRevisionItems(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <StudentDashboard
        displayName={user?.studentPreferences?.displayName || "భాగ్య"}
        examConfig={examConfig}
        studyPlan={studyPlan}
        mistakesCount={mistakes.length}
        dueRevisionsCount={dueRevisions.length}
      />
    </AppShell>
  );
}
