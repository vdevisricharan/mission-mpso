import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { TopicCard } from "@/components/curriculum/TopicCard";
import { Badge } from "@/components/ui/Badge";

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
  const filteredTopics = allTopics.filter((t) => t.paperId === activePaper);
  const masteryRecords = MasteryEngine.getUserTopicMastery(userId);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">అధికారిక సిలబస్ 07/G/ES/2026</Badge>
                <Badge variant="neutral">మొత్తం 21 అంశాలు</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
                నేర్చుకోండి — అధికారిక సిలబస్ & పాఠాలు
              </h1>
              <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
                తెలంగాణ పబ్లిక్ సర్వీస్ కమిషన్ MPSO/ASO నోటిఫికేషన్ నెం. 07/G/ES/2026 అనుబంధం-II ఆధారంగా రూపొందించిన పూర్తి పాఠ్య ప్రణాళిక.
              </p>
            </div>
          </div>
        </div>

        {/* Paper Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <a
            href="/learn?paper=paper_2"
            className={`p-4 rounded-2xl border text-center transition-all touch-target ${
              activePaper === "paper_2"
                ? "bg-[#176B5B] text-white border-[#176B5B] shadow-sm font-bold"
                : "bg-white text-[#17211E] border-[#E5EAE5] hover:bg-[#F5F6F2] font-semibold"
            }`}
          >
            <div className="text-sm sm:text-base mb-0.5">పేపర్ II: స్టాటిస్టిక్స్</div>
            <div className={`text-[11px] ${activePaper === "paper_2" ? "text-[#E8F4F0]" : "text-[#65716D]"}`}>
              డిగ్రీ స్థాయి • 8 యూనిట్లు • 150 మార్కులు
            </div>
          </a>

          <a
            href="/learn?paper=paper_1"
            className={`p-4 rounded-2xl border text-center transition-all touch-target ${
              activePaper === "paper_1"
                ? "bg-[#176B5B] text-white border-[#176B5B] shadow-sm font-bold"
                : "bg-white text-[#17211E] border-[#E5EAE5] hover:bg-[#F5F6F2] font-semibold"
            }`}
          >
            <div className="text-sm sm:text-base mb-0.5">పేపర్ I: జనరల్ స్టడీస్</div>
            <div className={`text-[11px] ${activePaper === "paper_1" ? "text-[#E8F4F0]" : "text-[#65716D]"}`}>
              తెలంగాణ & జాతీయ • 13 విభాగాలు • 150 మార్కులు
            </div>
          </a>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const mastery = masteryRecords.find((m) => m.topicId === topic.id);
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                masteryLevel={mastery?.masteryLevel || "not_assessed"}
                accuracyPercentage={mastery?.accuracyPercentage || 0}
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
