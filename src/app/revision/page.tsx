import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { RevisionView } from "@/components/revision/RevisionView";

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const dueItems = db.getDueRevisionItems(userId);

  // Core formulas for quick revision
  const lessons = db.getLessons();
  const formulas = lessons.flatMap((l) => l.formulas || []);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <RevisionView dueItems={dueItems} formulas={formulas} />
    </AppShell>
  );
}
