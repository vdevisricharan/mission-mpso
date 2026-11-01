import Link from "next/link";
import { Award, Clock, FileCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function MocksListPage() {
  const user = await getCurrentUser();
  const exam = db.getExamConfig();

  const mockTests = [
    {
      id: "paper_2_full",
      titleTe: "పేపర్ II: స్టాటిస్టిక్స్ (డిగ్రీ స్థాయి) — పూర్తి స్థాయి మాక్",
      titleEn: "Paper-II: Statistics (Degree Level) Full Mock Exam",
      paperId: "paper_2",
      totalQuestions: 150,
      durationMinutes: 150,
      totalMarks: 150,
      descriptionTe: "కేంద్రీయ ప్రవృత్తి, విస్తరణ, సంభావ్యత, సహసంబంధం, ప్రతిగమనం, కాలశ్రేణులు, శాంప్లింగ్ మరియు కంప్యూటర్ బేసిక్స్ అంశాల నుండి 150 ప్రశ్నలు.",
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
    },
  ];

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">TGPSC నోటిఫికేషన్ 07/G/ES/2026</Badge>
            <Badge variant="warning">నెగెటివ్ మార్కింగ్ అన్-కన్ఫర్మ్‌డ్</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            పూర్తి స్థాయి మాక్ పరీక్షలు (Mock Examinations)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            కమిషన్ నిబంధనల ప్రకారం 150 ప్రశ్నలు, 150 నిమిషాలు, కౌంట్‌డౌన్ టైమర్ మరియు OMR-శైలి ప్రశ్నల ప్యాలెట్‌తో నిజమైన పరీక్షా అనుభవాన్ని పొందండి.
          </p>

          <div className="mt-4 p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#A66A19] shrink-0 mt-0.5" />
            <div className="text-xs text-[#A66A19] leading-relaxed">
              <strong>ముఖ్య గమనిక:</strong> నోటిఫికేషన్ 07/G/ES/2026 లో నెగెటివ్ మార్కింగ్ నియమం పేర్కొనబడలేదు. అందువల్ల తప్పు సమాధానాలకు ఎలాంటి పెనాల్టీ విధించబడదు. అధికారిక మార్పులు వస్తే సిస్టమ్ స్వయంచాలకంగా అప్‌డేట్ అవుతుంది.
            </div>
          </div>
        </div>

        {/* Mock Exam Cards */}
        <div className="grid gap-4">
          {mockTests.map((mock) => (
            <div
              key={mock.id}
              className="bg-white border border-[#E5EAE5] rounded-3xl p-6 hover:border-[#176B5B]/50 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider">
                    {mock.paperId === "paper_1" ? "పేపర్ I" : "పేపర్ II"}
                  </span>
                  <span className="text-xs text-[#65716D]">•</span>
                  <span className="text-xs text-[#65716D] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>{mock.durationMinutes} నిమిషాలు</span>
                  </span>
                  <span className="text-xs text-[#65716D]">•</span>
                  <span className="text-xs text-[#65716D] font-medium">
                    {mock.totalQuestions} ప్రశ్నలు ({mock.totalMarks} మార్కులు)
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#17211E] mb-1">
                  {mock.titleTe}
                </h3>
                <p className="text-xs text-[#65716D] mb-3">{mock.titleEn}</p>
                <p className="text-xs sm:text-sm text-[#4A5552] leading-relaxed">
                  {mock.descriptionTe}
                </p>
              </div>

              <Link
                href={`/mocks/${mock.id}`}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#176B5B] text-white font-bold text-sm hover:bg-[#13584B] transition-colors whitespace-nowrap shadow-xs touch-target"
              >
                <span>పరీక్ష ప్రారంభించండి</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
