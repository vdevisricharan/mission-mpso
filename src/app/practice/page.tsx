import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { QuizInterface } from "@/components/practice/QuizInterface";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";

export const dynamic = "force-dynamic";

export default async function PracticePage({
  searchParams,
}: {
  searchParams?: Promise<{ topicId?: string; paperId?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const resolvedSearchParams = await searchParams;
  const topicId = resolvedSearchParams?.topicId;

  // Fetch approved questions
  const questions = db.getQuestions({
    topicId,
    validationStatus: "approved",
  });

  const topic = topicId ? db.getTopic(topicId) : null;
  const titleTe = topic ? `${topic.titleTe} — ప్రాక్టీస్ క్విజ్` : "MPSO సమగ్ర అభ్యాస క్విజ్";

  return (
    <AppShell initialRole={user?.role || "student"}>
      <QuizInterface
        questions={questions.length > 0 ? questions : db.getQuestions({ validationStatus: "approved" }).slice(0, 10)}
        titleTe={titleTe}
        isTimed={false}
      />
    </AppShell>
  );
}
