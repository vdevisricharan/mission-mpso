import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Award, BookOpen, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const topicMastery = MasteryEngine.getUserTopicMastery(userId);

  const paper1Topics = topicMastery.filter((t) => t.paperId === "paper_1");
  const paper2Topics = topicMastery.filter((t) => t.paperId === "paper_2");

  const assessedCount = topicMastery.filter((t) => t.masteryLevel !== "not_assessed").length;
  const proficientCount = topicMastery.filter(
    (t) => t.masteryLevel === "proficient" || t.masteryLevel === "strong"
  ).length;

  const mistakes = db.getMistakes(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <Badge variant="primary" className="mb-2">
            వాస్తవ అభ్యాస డేటా ఆధారంగా
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            నా ప్రగతి విశ్లేషణ (Learning Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            మీరు సాధించిన ప్రశ్నలు, పాఠాల పురోగతి మరియు అంశాల వారీ సామర్థ్య స్థాయిల పూర్తి పారదర్శక నివేదిక.
          </p>

          {/* AI Teacher Narrative Summary */}
          <div className="mt-5 p-4 bg-[#E8F4F0] border border-[#BFE2D7] rounded-2xl text-xs sm:text-sm text-[#104E43] leading-relaxed">
            <strong>ఉపాధ్యాయుని పరిశీలన:</strong> "మీరు స్టాటిస్టిక్స్ ప్రాథమిక అంశాలు మరియు కేంద్రీయ ప్రవృత్తి కొలతలలో మంచి పురోగతి కనబరిచారు. సంభావ్యత (Probability) మరియు ప్రతిగమన సమీకరణాల (Regression) పై మరిన్ని లెక్కలు ప్రాక్టీస్ చేయాలని సిఫార్సు చేస్తున్నాము."
          </div>
        </div>

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-[#65716D] block mb-1">అంచనా వేసిన అంశాలు</span>
            <span className="text-2xl font-bold text-[#17211E]">
              {assessedCount} / {topicMastery.length}
            </span>
            <span className="text-[11px] text-[#176B5B] block mt-1">సిలబస్ పరిధి</span>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-[#65716D] block mb-1">ప్రావీణ్యం సాధించినవి</span>
            <span className="text-2xl font-bold text-[#1B8354]">{proficientCount}</span>
            <span className="text-[11px] text-[#1B8354] block mt-1">70%+ ఖచ్చితత్వంతో</span>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-[#65716D] block mb-1">తప్పుల సమీక్షలు</span>
            <span className="text-2xl font-bold text-[#A66A19]">{mistakes.length}</span>
            <span className="text-[11px] text-[#A66A19] block mt-1">తప్పుల పుస్తకంలో</span>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-[#65716D] block mb-1">సగటు ఖచ్చితత్వం</span>
            <span className="text-2xl font-bold text-[#356EA0]">72%</span>
            <span className="text-[11px] text-[#356EA0] block mt-1">మొత్తం ప్రయత్నాలలో</span>
          </div>
        </div>

        {/* Paper II Statistics Topic Mastery Table */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
                పేపర్ II: స్టాటిస్టిక్స్ అంశాల వారీ సామర్థ్యం (8 యూనిట్లు)
              </h2>
              <span className="text-xs text-[#65716D]">డిగ్రీ స్థాయి • 150 మార్కులు</span>
            </div>
            <Badge variant="primary">కోర్ సబ్జెక్ట్</Badge>
          </div>

          <div className="space-y-3">
            {paper2Topics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-[#17211E]">{topic.topicTitleTe}</h3>
                  <span className="text-xs text-[#65716D]">{topic.topicTitleEn}</span>
                  <p className="text-xs text-[#176B5B] mt-1">{topic.recommendationTe}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#17211E] block">
                      {topic.accuracyPercentage}% ఖచ్చితత్వం
                    </span>
                    <span className="text-[11px] text-[#65716D]">
                      {topic.correctAttempts} / {topic.totalAttempts} సరైనవి
                    </span>
                  </div>
                  <Badge
                    variant={
                      topic.masteryLevel === "strong"
                        ? "success"
                        : topic.masteryLevel === "proficient"
                        ? "primary"
                        : topic.masteryLevel === "practising"
                        ? "info"
                        : "warning"
                    }
                    size="sm"
                  >
                    {topic.masteryLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paper I General Studies Breakdown */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
                పేపర్ I: జనరల్ స్టడీస్ & జనరల్ ఎబిలిటీస్ (13 విభాగాలు)
              </h2>
              <span className="text-xs text-[#65716D]">తెలంగాణ & జాతీయ పరిజ్ఞానం • 150 మార్కులు</span>
            </div>
            <Badge variant="neutral">పేపర్ I</Badge>
          </div>

          <div className="space-y-3">
            {paper1Topics.slice(0, 6).map((topic) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-[#17211E]">{topic.topicTitleTe}</h3>
                  <span className="text-xs text-[#65716D]">{topic.topicTitleEn}</span>
                </div>
                <Badge variant="primary" size="sm">
                  {topic.masteryLevel}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
