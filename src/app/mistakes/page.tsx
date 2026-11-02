import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { MistakeBookItem } from "@/types/mastery";
import { MistakesView } from "@/components/mistakes/MistakesView";

export const dynamic = "force-dynamic";

export default async function MistakesPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const mistakes = db.getMistakes(userId);

  // If user has no mistakes recorded yet, pre-populate with sample real mistakes from diagnostic
  const displayMistakes: MistakeBookItem[] =
    mistakes.length > 0
      ? mistakes
      : [
          {
            id: "m_sample_1",
            userId,
            questionId: "q_p2_001",
            question: db.getQuestion("q_p2_001")!,
            studentAnswer: "A",
            mistakeCategory: "formula_confusion",
            firstFailedAt: new Date(Date.now() - 86400000).toISOString(),
            lastAttemptedAt: new Date().toISOString(),
            reviewCount: 2,
            isResolved: false,
            bookmarked: true,
            aiExplanationTe:
              "ఆనుభావిక సూత్రంలో 3 మరియు 2 స్థానాలను గందరగోళపరిచారు. గుర్తుంచుకోండి: Mode = 3(Median) - 2(Mean).",
          },
          {
            id: "m_sample_2",
            userId,
            questionId: "q_p2_009",
            question: db.getQuestion("q_p2_009")!,
            studentAnswer: "A",
            mistakeCategory: "calculation_mistake",
            firstFailedAt: new Date(Date.now() - 172800000).toISOString(),
            lastAttemptedAt: new Date().toISOString(),
            reviewCount: 1,
            isResolved: false,
            bookmarked: false,
            aiExplanationTe:
              "0.8 * 0.45 = 0.36 అని గణించిన తర్వాత, దానికి వర్గమూలం (square root) తీయడం మర్చిపోయారు. sqrt(0.36) = 0.60.",
          },
        ];

  return (
    <AppShell initialRole={user?.role || "student"}>
      <MistakesView mistakes={displayMistakes} />
    </AppShell>
  );
}
