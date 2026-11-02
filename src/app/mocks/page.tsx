import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { MocksListView, MockItemConfig } from "@/components/mock/MocksListView";

export const dynamic = "force-dynamic";

export default async function MocksListPage() {
  const user = await getCurrentUser();

  const mockTests: MockItemConfig[] = [
    {
      id: "paper_2_full",
      titleTe: "పేపర్ II: స్టాటిస్టిక్స్ (డిగ్రీ స్థాయి) — పూర్తి స్థాయి మాక్",
      titleEn: "Paper-II: Statistics (Degree Level) Full Mock Exam",
      paperId: "paper_2",
      totalQuestions: 150,
      durationMinutes: 150,
      totalMarks: 150,
      descriptionTe: "కేంద్రీయ ప్రవృత్తి, విస్తరణ, సంభావ్యత, సహసంబంధం, ప్రతిగమనం, కాలశ్రేణులు, శాంప్లింగ్ మరియు కంప్యూటర్ బేసిక్స్ అంశాల నుండి 150 ప్రశ్నలు.",
      descriptionEn: "150 objective questions covering Central Tendency, Dispersion, Probability, Correlation, Regression, Time Series, Sampling, and Computer Basics.",
    },
    {
      id: "paper_1_full",
      titleTe: "పేపర్ I: జనరల్ స్టడీస్ & జనరల్ ఎబిలిటీస్ — పూర్తి స్థాయి మాక్",
      titleEn: "Paper-I: General Studies & Abilities Full Mock Exam",
      paperId: "paper_1",
      totalQuestions: 150,
      durationMinutes: 150,
      totalMarks: 150,
      descriptionTe: "వర్తమాన వ్యవహారాలు, తెలంగాణ చరిత్ర, ఉద్యమం, రాజ్యాంగం, సమాజం, ఎకానమీ మరియు రీజనింగ్ విభాగాల నుండి 150 ప్రశ్నలు.",
      descriptionEn: "150 objective questions covering Current Affairs, Telangana History & Movement, Indian Constitution, Society, Economy, and Logical Reasoning.",
    },
    {
      id: "mini_mock_practice",
      titleTe: "MPSO మినీ మాక్ టెస్ట్ (త్వరిత సాధన పరీక్ష)",
      titleEn: "MPSO Mini Practice Mock Exam (15 Questions)",
      paperId: "paper_2",
      totalQuestions: 15,
      durationMinutes: 20,
      totalMarks: 15,
      descriptionTe: "పరీక్షా వాతావరణం అలవాటు పడటానికి 15 నిమిషాల త్వరిత మాక్ టెస్ట్.",
      descriptionEn: "A 15-question, 20-minute rapid diagnostic test to get accustomed to real exam pacing and the OMR interface.",
    },
  ];

  return (
    <AppShell initialRole={user?.role || "student"}>
      <MocksListView mockTests={mockTests} />
    </AppShell>
  );
}
