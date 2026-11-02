import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { CurriculumView } from "@/components/curriculum/CurriculumView";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  searchParams,
}: {
  searchParams?: Promise<{ paper?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";

  const resolvedSearchParams = await searchParams;
  const activePaper = (resolvedSearchParams?.paper as "paper_1" | "paper_2") || "paper_2";

  const allTopics = db.getSyllabusTopics();
  const masteryRecords = MasteryEngine.getUserTopicMastery(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <CurriculumView
        topics={allTopics}
        masteryRecords={masteryRecords}
        initialPaper={activePaper}
      />
    </AppShell>
  );
}
