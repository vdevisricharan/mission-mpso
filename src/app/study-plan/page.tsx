import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { StudyPlanView } from "@/components/study-plan/StudyPlanView";

export const dynamic = "force-dynamic";

export default async function StudyPlanPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const plan = MasteryEngine.getOrCreateDailyPlan(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <StudyPlanView plan={plan} />
    </AppShell>
  );
}
