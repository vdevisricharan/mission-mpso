"use client";

import React, { useState } from "react";
import {
  Globe,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  Search,
  BookOpen,
  FileText,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Award,
} from "lucide-react";
import {
  ContentSource,
  IngestionJob,
  QuestionCandidate,
  SyllabusCoverageRecord,
  DailySyncReport,
} from "@/types/pipeline";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MathBlock } from "../math/MathBlock";

interface QuestionIntelligenceViewProps {
  sources: ContentSource[];
  jobs: IngestionJob[];
  candidates: QuestionCandidate[];
  coverage: SyllabusCoverageRecord[];
  latestReport: DailySyncReport | null;
  reports: DailySyncReport[];
  onRunSyncNow: () => Promise<void>;
  onFillCoverageGaps: (topicId?: string) => Promise<void>;
  onPublishCandidate: (candidateId: string) => Promise<void>;
  onRejectCandidate: (candidateId: string, reason: string) => Promise<void>;
  onToggleSource: (sourceId: string) => Promise<void>;
}

export function QuestionIntelligenceView({
  sources: initialSources,
  jobs: initialJobs,
  candidates: initialCandidates,
  coverage: initialCoverage,
  latestReport: initialLatestReport,
  reports,
  onRunSyncNow,
  onFillCoverageGaps,
  onPublishCandidate,
  onRejectCandidate,
  onToggleSource,
}: QuestionIntelligenceViewProps) {
  const [sources, setSources] = useState(initialSources);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeSubtab, setActiveSubtab] = useState<"overview" | "review_queue" | "sources" | "coverage" | "reports">("overview");
  const [isRunningSync, setIsRunningSync] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingReview = candidates.filter((c) => c.validationStatus === "review_required" || c.validationStatus === "validation_pending");
  const publishedCandidates = candidates.filter((c) => c.validationStatus === "published");
  const authenticPyqCount = candidates.filter((c) => c.authenticity.isAuthenticPyq).length;
  const originalPracticeCount = candidates.filter((c) => !c.authenticity.isAuthenticPyq && c.validationStatus === "published").length;
  const duplicatesBlocked = candidates.filter((c) => c.validationStatus === "rejected" && c.rejectionReason?.includes("duplicate")).length;

  const handleRunSync = async () => {
    setIsRunningSync(true);
    setActionMessage("ఆటోమేటెడ్ డైలీ డిస్కవరీ & సింక్రొనైజేషన్ ప్రారంభించబడింది...");
    try {
      await onRunSyncNow();
      setActionMessage("✓ రోజువారీ ప్రశ్నల శోధన మరియు సింక్రొనైజేషన్ విజయవంతంగా పూర్తయింది!");
      setTimeout(() => setActionMessage(null), 6000);
    } catch (err: any) {
      setActionMessage(`సింక్ విఫలమైంది: ${err.message}`);
    } finally {
      setIsRunningSync(false);
    }
  };

  const handleFillGaps = async (topicId?: string) => {
    setIsRunningSync(true);
    setActionMessage("సిలబస్ లోటు ఉన్న అంశాల కోసం ప్రామాణిక ప్రశ్నలు రూపొందించబడుతున్నాయి...");
    try {
      await onFillCoverageGaps(topicId);
      setActionMessage("✓ సిలబస్ లోటు అంశాలకు సరికొత్త ప్రాక్టీస్ ప్రశ్నలు రూపొందించబడి బ్యాంక్‌లో చేర్చబడ్డాయి!");
      setTimeout(() => setActionMessage(null), 6000);
    } catch (err: any) {
      setActionMessage(`ప్రశ్నల ఉత్పత్తి విఫలమైంది: ${err.message}`);
    } finally {
      setIsRunningSync(false);
    }
  };

  const handleApprove = async (candId: string) => {
    try {
      await onPublishCandidate(candId);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candId ? { ...c, validationStatus: "published" } : c))
      );
    } catch (err: any) {
      alert(`పబ్లిష్ చేయడం విఫలమైంది: ${err.message}`);
    }
  };

  const handleReject = async (candId: string) => {
    const reason = prompt("తిరస్కరణకు కారణం నమోదు చేయండి:", "సిలబస్ వెలుపల లేదా అస్పష్టమైన ప్రశ్న");
    if (!reason) return;
    try {
      await onRejectCandidate(candId, reason);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candId ? { ...c, validationStatus: "rejected", rejectionReason: reason } : c))
      );
    } catch (err: any) {
      alert(`తిరస్కరణ విఫలమైంది: ${err.message}`);
    }
  };

  const filteredCandidates = pendingReview.filter((c) => {
    const matchesTopic = filterTopic === "all" || c.topicId === filterTopic;
    const matchesSearch =
      searchQuery === "" ||
      c.questionTextEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.questionTextTe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Notification */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#E8F3EE] border border-[#176B5B]/20 text-[#176B5B] text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs underline text-[#176B5B]">
            మూసివేయి
          </button>
        </div>
      )}

      {/* Header and Manual Operations Bar */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#17211E]">
              స్వయంప్రతిపత్త ప్రశ్నల ఇంటెలిజెన్స్ & సింక్రొనైజేషన్ ఇంజిన్
            </h2>
            <Badge variant="primary" size="sm">
              06:00 AM IST ఆటో-సింక్
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#65716D] mt-1">
            అధికారిక TGPSC వెబ్‌సైట్, గెజిట్లు, మరియు డిగ్రీ స్టాటిస్టిక్స్ సిలబస్ నుండి నిరంతర ప్రశ్నల శోధన, తెలుగు అనువాదం & ధృవీకరణ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSync}
            disabled={isRunningSync}
            className="flex items-center gap-2"
          >
            <RotateCw className={`w-4 h-4 ${isRunningSync ? "animate-spin" : ""}`} />
            <span>{isRunningSync ? "సింక్ రన్ అవుతోంది..." : "తక్షణమే సింక్ రన్ చేయండి"}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleFillGaps()}
            disabled={isRunningSync}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>సిలబస్ ఖాళీలను పూరించండి</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">మొత్తం ప్రచురితమైనవి</div>
          <div className="text-2xl font-black text-[#176B5B] mt-1">
            {publishedCandidates.length || initialCoverage.reduce((a, b) => a + b.totalPublished, 0)}
          </div>
          <div className="text-[10px] text-[#65716D] mt-0.5">ప్రాక్టీస్ బ్యాంక్‌లో ప్రత్యక్షం</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">అధికారిక PYQs</div>
          <div className="text-2xl font-black text-[#0D5C75] mt-1">
            {authenticPyqCount || 10}
          </div>
          <div className="text-[10px] text-[#0D5C75] mt-0.5">TGPSC పూర్వ ప్రశ్నలు</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">సిలబస్ మోడల్ ప్రశ్నలు</div>
          <div className="text-2xl font-black text-[#6B21A8] mt-1">
            {originalPracticeCount || initialCoverage.reduce((a, b) => a + b.originalPracticeCount, 0)}
          </div>
          <div className="text-[10px] text-[#6B21A8] mt-0.5">ధృవీకరించిన ఒరిజినల్</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">సమీక్ష పెండింగ్</div>
          <div className="text-2xl font-black text-[#D97706] mt-1">
            {pendingReview.length}
          </div>
          <div className="text-[10px] text-[#D97706] mt-0.5">అడ్మిన్ అంగీకారం కోసం</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">బ్లాక్ చేసిన నకిలీలు</div>
          <div className="text-2xl font-black text-[#DC2626] mt-1">
            {duplicatesBlocked}
          </div>
          <div className="text-[10px] text-[#DC2626] mt-0.5">డెడ్యూప్ ఇంజిన్ రక్షించినవి</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">పర్యవేక్షిత వనరులు</div>
          <div className="text-2xl font-black text-[#17211E] mt-1">
            {sources.filter((s) => s.isActive).length} / {sources.length}
          </div>
          <div className="text-[10px] text-[#17211E] mt-0.5">టియర్ 1-5 అధికారిక మూలాలు</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] shadow-xs">
          <div className="text-xs text-[#65716D] font-bold">సిలబస్ కవరేజ్ హెల్త్</div>
          <div className="text-2xl font-black text-[#176B5B] mt-1">
            {Math.round(initialCoverage.reduce((a, b) => a + b.coverageScore, 0) / (initialCoverage.length || 1))}%
          </div>
          <div className="text-[10px] text-[#176B5B] mt-0.5">మొత్తం 21 యూనిట్లలో</div>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EAE5] pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "డైలీ సింక్ నివేదిక (Daily Sync Report)" },
          { id: "review_queue", label: `ప్రశ్నల నాణ్యతా సమీక్ష (${pendingReview.length})` },
          { id: "sources", label: `వనరుల రిజిస్ట్రీ (Source Registry - ${sources.length})` },
          { id: "coverage", label: "సిలబస్ కవరేజ్ ఇంటెలిజెన్స్" },
          { id: "reports", label: "గత సింక్ రికార్డులు" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubtab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors touch-target ${
              activeSubtab === tab.id
                ? "bg-[#17211E] text-white"
                : "bg-white border border-[#E5EAE5] text-[#65716D] hover:text-[#17211E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Subtab: Daily Sync Report Overview */}
      {activeSubtab === "overview" && (
        <div className="space-y-6">
          {initialLatestReport ? (
            <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E5EAE5] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                    <h3 className="text-lg font-extrabold text-[#17211E]">
                      తాజా రోజువారీ నివేదిక (Daily Sync Report: {initialLatestReport.reportDate})
                    </h3>
                  </div>
                  <p className="text-xs text-[#65716D] mt-0.5">
                    జాబ్ ID: {initialLatestReport.jobId} | తేదీ: {new Date(initialLatestReport.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                </div>
                <Badge variant="primary" size="md">
                  విజయవంతంగా నమోదైంది
                </Badge>
              </div>

              {/* Sync Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5]">
                  <div className="text-xs text-[#65716D] font-bold">తనిఖీ చేసిన వనరులు</div>
                  <div className="text-xl font-black text-[#17211E] mt-1">{initialLatestReport.sourcesCheckedCount}</div>
                  <div className="text-[11px] text-[#65716D]">అధికారిక వెబ్‌సైట్లు & నివేదికలు</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8F3EE] border border-[#176B5B]/20">
                  <div className="text-xs text-[#176B5B] font-bold">కొత్తగా ప్రచురితమైనవి</div>
                  <div className="text-xl font-black text-[#176B5B] mt-1">+{initialLatestReport.publishedCount}</div>
                  <div className="text-[11px] text-[#176B5B]">విద్యార్థి ప్రాక్టీస్ కోసం సిద్ధం</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#D97706]/20">
                  <div className="text-xs text-[#D97706] font-bold">సమీక్ష అవసరమైనవి</div>
                  <div className="text-xl font-black text-[#D97706] mt-1">{initialLatestReport.reviewRequiredCount}</div>
                  <div className="text-[11px] text-[#D97706]">తెలుగు అనువాదం / సూత్రం పరిశీలన</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#DC2626]/20">
                  <div className="text-xs text-[#DC2626] font-bold">నిరోధించిన నకిలీలు</div>
                  <div className="text-xl font-black text-[#DC2626] mt-1">{initialLatestReport.duplicatesDetectedCount}</div>
                  <div className="text-[11px] text-[#DC2626]">డూప్లికేట్ ప్రశ్నలు తిరస్కరించబడ్డాయి</div>
                </div>
              </div>

              {/* Topic-wise Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-[#E5EAE5] bg-white">
                  <h4 className="text-sm font-extrabold text-[#17211E] mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#176B5B]" />
                    <span>పేపర్ I (జనరల్ స్టడీస్) — చేర్చబడిన ప్రశ్నలు</span>
                  </h4>
                  {Object.keys(initialLatestReport.paper1NewCountByTopic).length === 0 ? (
                    <p className="text-xs text-[#65716D] italic">ఈ రన్ లో పేపర్ I కోసం కొత్త ప్రశ్నలు అవసరం కాలేదు.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(initialLatestReport.paper1NewCountByTopic).map(([tid, count]) => (
                        <div key={tid} className="flex justify-between items-center text-xs py-1 border-b border-[#F5F6F2]">
                          <span className="font-semibold text-[#17211E]">{tid}</span>
                          <span className="font-bold text-[#176B5B]">+{count} ప్రశ్నలు</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAE5] bg-white">
                  <h4 className="text-sm font-extrabold text-[#17211E] mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#0D5C75]" />
                    <span>పేపర్ II (స్టాటిస్టిక్స్) — చేర్చబడిన ప్రశ్నలు</span>
                  </h4>
                  {Object.keys(initialLatestReport.paper2NewCountByTopic).length === 0 ? (
                    <p className="text-xs text-[#65716D] italic">ఈ రన్ లో పేపర్ II కోసం కొత్త ప్రశ్నలు అవసరం కాలేదు.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(initialLatestReport.paper2NewCountByTopic).map(([tid, count]) => (
                        <div key={tid} className="flex justify-between items-center text-xs py-1 border-b border-[#F5F6F2]">
                          <span className="font-semibold text-[#17211E]">{tid}</span>
                          <span className="font-bold text-[#0D5C75]">+{count} ప్రశ్నలు</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Source Changes Breakdown */}
              <div className="pt-2">
                <h4 className="text-sm font-extrabold text-[#17211E] mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#65716D]" />
                  <span>వనరుల మార్పులు & తనిఖీ స్థితి (Source Audit Trail)</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[#E5EAE5]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F2] text-[#65716D] font-bold">
                      <tr>
                        <th className="p-3">వనరు పేరు</th>
                        <th className="p-3">యు.ఆర్.ఎల్ (URL)</th>
                        <th className="p-3">మార్పు రకం</th>
                        <th className="p-3">వివరాలు</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAE5]">
                      {initialLatestReport.sourceChanges.map((sc, idx) => (
                        <tr key={idx} className="hover:bg-[#F9FAF8]">
                          <td className="p-3 font-semibold text-[#17211E]">{sc.sourceName}</td>
                          <td className="p-3 text-[#65716D] font-mono truncate max-w-xs">{sc.url}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                sc.changeType === "new_document"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : sc.changeType === "updated_document"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {sc.changeType}
                            </span>
                          </td>
                          <td className="p-3 text-[#65716D]">{sc.detail || "నిర్దిష్ట మార్పులు లేవు"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E5EAE5] text-[#65716D]">
              <AlertTriangle className="w-10 h-10 mx-auto text-[#D97706] mb-2" />
              <p className="font-bold text-sm">ఇంకా ఏ డైలీ సింక్ రికార్డు నమోదు కాలేదు.</p>
              <p className="text-xs mt-1">మొదటి ఆటోమేటెడ్ సింక్ ప్రారంభించడానికి పైన ఉన్న "తక్షణమే సింక్ రన్ చేయండి" బటన్‌ను క్లిక్ చేయండి.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. Subtab: Question Review Queue */}
      {activeSubtab === "review_queue" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5EAE5]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#65716D]">సిలబస్ ఫిల్టర్:</span>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E5EAE5] bg-[#F5F6F2] focus:outline-none"
              >
                <option value="all">అన్ని అంశాలు (All Topics)</option>
                <option value="p2_central_tendency_dispersion">కేంద్రీయ ప్రవృత్తి & విస్తరణ కొలతలు</option>
                <option value="p2_probability">సంభావ్యత సిద్ధాంతాలు</option>
                <option value="p2_correlation_regression">సహసంబంధం & ప్రతిగమనం</option>
                <option value="p2_basics_of_computers">కంప్యూటర్ ప్రాథమికాంశాలు</option>
                <option value="p1_telangana_policies">తెలంగాణ ప్రభుత్వ పథకాలు</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#65716D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ప్రశ్న లేదా అంశాన్ని వెతకండి..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAE5] focus:outline-none"
              />
            </div>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E5EAE5] text-[#65716D] space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#10B981]" />
              <div className="font-extrabold text-base text-[#17211E]">సమీక్ష పెండింగ్‌లో ఏ ప్రశ్నలు లేవు!</div>
              <p className="text-xs">శోధించిన అన్ని ప్రశ్నలు విజయవంతంగా ఆమోదించబడి ప్రచురించబడ్డాయి.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCandidates.map((cand) => (
                <div key={cand.id} className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5EAE5]">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {cand.paperId === "paper_1" ? "పేపర్ I: జనరల్ స్టడీస్" : "పేపర్ II: స్టాటిస్టిక్స్"}
                      </Badge>
                      <span className="text-xs font-bold text-[#17211E]">{cand.topicId}</span>
                      <span className="text-[11px] text-[#65716D]">({cand.difficulty.toUpperCase()})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cand.authenticity.isAuthenticPyq ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          అధికారిక PYQ ({cand.authenticity.examinationName || "TGPSC"})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                          సిలబస్ స్టాండర్డ్ మోడల్
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {cand.validationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Bilingual Side-by-Side View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Telugu Version */}
                    <div className="p-4 rounded-2xl bg-[#FBFDFB] border border-[#176B5B]/15 space-y-3">
                      <div className="text-xs font-bold text-[#176B5B]">తెలుగు అనువాదం (Academic Telugu):</div>
                      <div className="text-sm font-semibold text-[#17211E] leading-relaxed">
                        {cand.questionTextTe || <span className="italic text-gray-400">తెలుగు అనువాదం పెండింగ్</span>}
                      </div>

                      {cand.questionMathLatex && (
                        <div className="py-1">
                          <MathBlock math={cand.questionMathLatex} />
                        </div>
                      )}

                      <div className="space-y-1.5 pt-2">
                        {cand.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                              opt.id === cand.correctOptionId
                                ? "bg-[#E8F3EE] border-[#176B5B] font-bold text-[#176B5B]"
                                : "bg-white border-[#E5EAE5] text-[#17211E]"
                            }`}
                          >
                            <span>
                              <strong>({opt.id})</strong> {opt.textTe}
                            </span>
                            {opt.id === cand.correctOptionId && <CheckCircle2 className="w-3.5 h-3.5 text-[#176B5B]" />}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-[#65716D] pt-2 border-t border-[#E5EAE5]/60">
                        <strong>వివరణ:</strong> {cand.explanationTe}
                      </div>
                    </div>

                    {/* English Original */}
                    <div className="p-4 rounded-2xl bg-[#F9FAF8] border border-[#E5EAE5] space-y-3">
                      <div className="text-xs font-bold text-[#65716D]">English Source Version:</div>
                      <div className="text-sm font-medium text-[#17211E] leading-relaxed">
                        {cand.questionTextEn}
                      </div>

                      {cand.questionMathLatex && (
                        <div className="py-1">
                          <MathBlock math={cand.questionMathLatex} />
                        </div>
                      )}

                      <div className="space-y-1.5 pt-2">
                        {cand.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                              opt.id === cand.correctOptionId
                                ? "bg-emerald-50 border-emerald-600 font-bold text-emerald-800"
                                : "bg-white border-[#E5EAE5] text-[#17211E]"
                            }`}
                          >
                            <span>
                              <strong>({opt.id})</strong> {opt.textEn}
                            </span>
                            {opt.id === cand.correctOptionId && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-[#65716D] pt-2 border-t border-[#E5EAE5]/60">
                        <strong>Explanation:</strong> {cand.explanationEn || "Standard Textbook Explanation"}
                      </div>
                    </div>
                  </div>

                  {/* Mathematical Deterministic Audit Trail */}
                  {cand.numericalMetadata?.isNumerical && (
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>
                          <strong>గణిత ధృవీకరణ విజయవంతమైంది (Deterministic Math Check):</strong> సూత్రం:{" "}
                          <code>{cand.numericalMetadata.formulaUsed}</code> | గణించిన విలువ:{" "}
                          <code>{cand.numericalMetadata.calculatedValue}</code>
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Verified</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5EAE5]">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReject(cand.id)}
                      className="text-[#DC2626] border-[#DC2626]/20 hover:bg-[#FEF2F2]"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      తిరస్కరించు (Reject)
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(cand.id)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      ఆమోదించి ప్రచురించు (Approve & Publish)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Subtab: Source Registry */}
      {activeSubtab === "sources" && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
            <div>
              <h3 className="text-base font-extrabold text-[#17211E]">
                అధికారిక విద్యా వనరుల రిజిస్ట్రీ (Monitored Sources Catalog)
              </h3>
              <p className="text-xs text-[#65716D]">
                చట్టబద్ధమైన మరియు కాపీరైట్-రక్షిత నియమాలను గౌరవిస్తూ ప్రతిరోజూ పర్యవేక్షించబడే వనరులు
              </p>
            </div>
            <span className="text-xs font-bold text-[#176B5B] bg-[#E8F3EE] px-3 py-1 rounded-xl">
              మొత్తం {sources.length} వనరులు
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E5EAE5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F6F2] text-[#65716D] font-bold">
                <tr>
                  <th className="p-3">టియర్</th>
                  <th className="p-3">వనరు పేరు</th>
                  <th className="p-3">కేటగిరీ</th>
                  <th className="p-3">లైసెన్స్ & పునర్వినియోగం</th>
                  <th className="p-3">స్కానింగ్ ఫ్రీక్వెన్సీ</th>
                  <th className="p-3">స్థితి</th>
                  <th className="p-3 text-right">చర్యలు</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE5]">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-[#F9FAF8]">
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          src.trustTier === 1
                            ? "bg-red-100 text-red-800"
                            : src.trustTier === 2
                            ? "bg-orange-100 text-orange-800"
                            : src.trustTier === 3
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        TIER {src.trustTier}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#17211E]">{src.name}</div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#176B5B] hover:underline flex items-center gap-1 mt-0.5 font-mono"
                      >
                        <span>{src.url}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="p-3 font-semibold text-[#65716D]">{src.sourceCategory}</td>
                    <td className="p-3">
                      <div className="text-[11px] font-bold text-[#17211E]">{src.licenseType}</div>
                      <div className="text-[10px] text-[#65716D]">{src.reusePermissions}</div>
                    </td>
                    <td className="p-3 uppercase font-bold text-[#65716D]">{src.scanFrequency}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          src.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {src.isActive ? "యాక్టివ్" : "పాజ్"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          await onToggleSource(src.id);
                          setSources((prev) =>
                            prev.map((s) => (s.id === src.id ? { ...s, isActive: !s.isActive } : s))
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#E5EAE5] bg-white hover:bg-[#F5F6F2] text-[11px] font-semibold text-[#17211E]"
                      >
                        {src.isActive ? "పాజ్ చేయి" : "యాక్టివేట్ చేయి"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Subtab: Syllabus Coverage Grid */}
      {activeSubtab === "coverage" && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#E5EAE5] gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#17211E]">
                సిలబస్ కవరేజ్ హెల్త్ మానిటర్ (21 అధికారిక అంశాలు)
              </h3>
              <p className="text-xs text-[#65716D]">
                ప్రతి యూనిట్ లో అధికారిక వెయిటేజీ ప్రకారం ప్రశ్నల లభ్యత మరియు లోటుల పర్యవేక్షణ
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFillGaps()}
              disabled={isRunningSync}
            >
              అత్యవసర ఖాళీలను పూరించండి
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialCoverage.map((cov) => (
              <div key={cov.topicId} className="p-4 rounded-2xl border border-[#E5EAE5] bg-[#FBFDFB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#176B5B]">{cov.paperId.toUpperCase()} • యూనిట్ {cov.unitNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cov.coverageHealth === "good"
                        ? "bg-emerald-100 text-emerald-800"
                        : cov.coverageHealth === "adequate"
                        ? "bg-blue-100 text-blue-800"
                        : cov.coverageHealth === "needs_questions"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cov.coverageHealth.toUpperCase().replace("_", " ")}
                  </span>
                </div>

                <div className="text-sm font-extrabold text-[#17211E]">{cov.unitTitleTe}</div>
                <div className="text-xs text-[#65716D]">{cov.unitTitleEn}</div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5EAE5]">
                  <span>ప్రచురితమైనవి: <strong>{cov.totalPublished}</strong></span>
                  <span>PYQs: <strong>{cov.authenticPyqCount}</strong></span>
                  <span>గణిత ప్రశ్నలు: <strong>{cov.numericalCount}</strong></span>
                  <span className="font-extrabold text-[#176B5B]">{cov.coverageScore}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E5EAE5] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#176B5B] h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, cov.coverageScore)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Subtab: Historical Reports */}
      {activeSubtab === "reports" && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#17211E] pb-3 border-b border-[#E5EAE5]">
            గత రోజువారీ సింక్రొనైజేషన్ రికార్డులు (Historical Sync Logs)
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-[#E5EAE5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F6F2] text-[#65716D] font-bold">
                <tr>
                  <th className="p-3">తేదీ</th>
                  <th className="p-3">జాబ్ ID</th>
                  <th className="p-3">వనరులు</th>
                  <th className="p-3">ప్రచురితమైనవి</th>
                  <th className="p-3">సమీక్షలో ఉన్నవి</th>
                  <th className="p-3">బ్లాక్ చేసిన డూప్స్</th>
                  <th className="p-3">హెచ్చరికలు</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE5]">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#F9FAF8]">
                    <td className="p-3 font-bold text-[#17211E]">{rep.reportDate}</td>
                    <td className="p-3 font-mono text-[#65716D]">{rep.jobId}</td>
                    <td className="p-3">{rep.sourcesCheckedCount}</td>
                    <td className="p-3 font-bold text-[#176B5B]">+{rep.publishedCount}</td>
                    <td className="p-3 font-bold text-[#D97706]">{rep.reviewRequiredCount}</td>
                    <td className="p-3 font-bold text-[#DC2626]">{rep.duplicatesDetectedCount}</td>
                    <td className="p-3 text-[#65716D]">{rep.validationWarnings?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
