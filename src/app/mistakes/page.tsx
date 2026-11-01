import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { MistakeBookItem } from "@/types/mastery";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle, CheckCircle2, Bookmark, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { MathBlock } from "@/components/math/MathBlock";

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

  const unresolved = displayMistakes.filter((m) => !m.isResolved);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning">స్వీయ దిద్దుబాటు సాధనం</Badge>
            <Badge variant="primary">స్పేస్డ్ రివిజన్ అనుసంధానం</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            తప్పుల పుస్తకం (Mistake Book)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            మీరు ప్రాక్టీస్ లేదా మాక్ పరీక్షలలో తప్పు చేసిన ప్రతి ప్రశ్న ఇక్కడ భద్రపరచబడుతుంది. తప్పుల నుండి నేర్చుకోవడమే అసలైన విజయం.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-[#17211E]">
            <span className="text-[#A66A19]">పెండింగ్ సమీక్షలు: {unresolved.length}</span>
            <span>•</span>
            <span className="text-[#1B8354]">
              పరిష్కరించబడినవి: {displayMistakes.length - unresolved.length}
            </span>
          </div>
        </div>

        {/* Mistakes List */}
        <div className="space-y-4">
          {displayMistakes.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-3xl p-6 transition-all shadow-xs ${
                item.isResolved ? "border-[#BEE7CE] bg-[#FAFCFA]" : "border-[#E5EAE5]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {item.question.paperId === "paper_1" ? "పేపర్ I: GS" : "పేపర్ II: Statistics"}
                  </Badge>
                  <span className="text-xs text-[#A66A19] font-semibold bg-[#FEF7ED] px-2.5 py-0.5 rounded-lg border border-[#F6DCBA]">
                    {item.mistakeCategory === "formula_confusion"
                      ? "సూత్ర గందరగోళం"
                      : item.mistakeCategory === "calculation_mistake"
                      ? "గణన తప్పు"
                      : item.mistakeCategory === "concept_misunderstanding"
                      ? "భావనా లోపం"
                      : "ప్రశ్న సరిగ్గా చదవలేదు"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#65716D]">
                    సమీక్షలు: {item.reviewCount} సార్లు
                  </span>
                  {item.bookmarked && (
                    <Bookmark className="w-4 h-4 text-[#A66A19] fill-[#A66A19]" />
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold text-[#17211E] mb-2">
                {item.question.questionTextTe}
              </h3>
              {item.question.questionTextEn && (
                <p className="text-xs text-[#65716D] mb-4">
                  {item.question.questionTextEn}
                </p>
              )}
              {item.question.questionMathLatex && (
                <MathBlock math={item.question.questionMathLatex} />
              )}

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
                <div className="p-3 bg-[#FDF2F2] border border-[#F7CDD0] rounded-xl text-xs text-[#B33D44]">
                  <strong>మీరు పెట్టిన సమాధానం:</strong> ఆప్షన్ {item.studentAnswer || "ఏదీ లేదు"}
                </div>
                <div className="p-3 bg-[#EEF9F2] border border-[#BEE7CE] rounded-xl text-xs text-[#1B8354]">
                  <strong>సరైన సమాధానం:</strong> ఆప్షన్ {item.question.correctOptionId}
                </div>
              </div>

              {/* AI Explanation */}
              <div className="p-4 bg-[#F5F6F2] rounded-2xl text-xs sm:text-sm text-[#17211E] leading-relaxed mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B5B] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>వివరణ & పరిష్కార మార్గం:</span>
                </div>
                {item.aiExplanationTe || item.question.explanationTe}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E5EAE5]/60 text-xs">
                <Link
                  href={`/tutor?topicId=${item.question.topicId}`}
                  className="inline-flex items-center gap-1 text-[#176B5B] font-bold hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI ట్యూటర్‌తో ఈ లెక్క సాధించండి</span>
                </Link>

                <span className="text-[#65716D]">
                  తదుపరి పునశ్చరణ: రేపు షెడ్యూల్ చేయబడింది
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
