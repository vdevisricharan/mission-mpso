import { VERIFIED_CURRENT_AFFAIRS } from "@/lib/current-affairs/data";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { CurrentAffairsView } from "@/components/current-affairs/CurrentAffairsView";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const user = await getCurrentUser();
  const items = VERIFIED_CURRENT_AFFAIRS;

  return (
    <AppShell initialRole={user?.role || "student"}>
      <CurrentAffairsView items={items} />
    </AppShell>
  );
}
