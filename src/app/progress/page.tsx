import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressView } from "@/components/progress/ProgressView";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const topicMastery = MasteryEngine.getUserTopicMastery(userId);
  const mistakes = db.getMistakes(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <ProgressView topicMastery={topicMastery} mistakesCount={mistakes.length} />
    </AppShell>
  );
}
