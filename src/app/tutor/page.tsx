import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { TutorChat } from "@/components/tutor/TutorChat";

export const dynamic = "force-dynamic";

export default async function TutorPage({
  searchParams,
}: {
  searchParams?: Promise<{ topicId?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const initialTopicId = resolvedSearchParams?.topicId;

  const topics = db.getSyllabusTopics();

  return (
    <AppShell initialRole={user?.role || "student"}>
      <TutorChat initialTopicId={initialTopicId} topics={topics} />
    </AppShell>
  );
}
