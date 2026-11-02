"use client";

import React, { useState } from "react";
import {
  Shield,
  Settings,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Download,
  Search,
  Plus,
  RefreshCw,
  Award,
} from "lucide-react";
import { OfficialExamConfig } from "@/types/exam";
import { SyllabusTopic } from "@/types/curriculum";
import { Question } from "@/types/question";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface AdminPortalProps {
  examConfig: OfficialExamConfig;
  topics: SyllabusTopic[];
  questions: Question[];
  auditLogs: any[];
  onUpdateExamConfig: (config: Partial<OfficialExamConfig>) => void;
  onApproveQuestion: (qId: string) => void;
  onRejectQuestion: (qId: string) => void;
}

export function AdminPortal({
  examConfig,
  topics,
  questions: initialQuestions,
  auditLogs,
  onUpdateExamConfig,
  onApproveQuestion,
  onRejectQuestion,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "exam_config" | "syllabus" | "questions" | "review" | "logs"
  >("overview");

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [examDate, setExamDate] = useState(examConfig.confirmedExamDate || "");
  const [negativeMarking, setNegativeMarking] = useState(examConfig.negativeMarkingPolicy);
  const [filterQuery, setFilterQuery] = useState("");

  const pendingQuestions = questions.filter(
    (q) => q.validationStatus === "review_required" || q.validationStatus === "draft"
  );

  const handleApprove = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, validationStatus: "approved" } : q))
    );
    onApproveQuestion(qId);
  };

  const handleReject = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, validationStatus: "rejected" } : q))
    );
    onRejectQuestion(qId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#176B5B] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211E]">
                అడ్మినిస్ట్రేషన్ కంటెంట్ మేనేజర్ (CMS)
              </h1>
              <Badge variant="primary" size="sm">
                అధికారిక నిర్వాహకుడు
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#65716D]">
              TGPSC నోటిఫికేషన్ 07/G/ES/2026 నియమాలు, సిలబస్ మరియు ప్రశ్నల నాణ్యతా నిర్వహణ
            </p>
          </div>
        </div>

        {/* Export Data Button */}
        <button
          onClick={() => {
            const dataStr =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify({ examConfig, questions, topics }, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `mpso_data_export_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5EAE5] bg-[#F5F6F2] hover:bg-[#E5EAE5] text-xs sm:text-sm font-semibold text-[#17211E] touch-target"
        >
          <Download className="w-4 h-4 text-[#176B5B]" />
          <span>డేటా బ్యాకప్ డౌన్‌లోడ్ (.JSON)</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#E5EAE5] scroll-smooth overscroll-x-contain">
        {[
          { id: "overview", label: "డ్యాష్‌బోర్డ్" },
          { id: "exam_config", label: "పరీక్ష నిబంధనలు (Exam Config)" },
          { id: "syllabus", label: "సిలబస్ & పాఠాలు" },
          { id: "questions", label: "ప్రశ్నల నిధి (Question Bank)" },
          { id: "review", label: `AI సమీక్ష (${pendingQuestions.length})` },
          { id: "logs", label: "ఆడిట్ లాగ్స్" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors touch-target ${
              activeTab === tab.id
                ? "bg-[#176B5B] text-white shadow-xs"
                : "bg-white border border-[#E5EAE5] text-[#65716D] hover:bg-[#F5F6F2] hover:text-[#17211E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#65716D] block mb-1">మొత్తం సిలబస్ అంశాలు</span>
              <span className="text-2xl font-bold text-[#17211E]">{topics.length}</span>
              <span className="text-[11px] text-[#176B5B] block mt-1">పేపర్ I: 13 | పేపర్ II: 8</span>
            </div>
            <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#65716D] block mb-1">ధృవీకరించిన ప్రశ్నలు</span>
              <span className="text-2xl font-bold text-[#1B8354]">
                {questions.filter((q) => q.validationStatus === "approved").length}
              </span>
              <span className="text-[11px] text-[#1B8354] block mt-1">మాక్ పరీక్షలకు సిద్ధం</span>
            </div>
            <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#65716D] block mb-1">సమీక్షించాల్సినవి</span>
              <span className="text-2xl font-bold text-[#A66A19]">{pendingQuestions.length}</span>
              <span className="text-[11px] text-[#A66A19] block mt-1">AI డ్రాఫ్ట్‌లు పెండింగ్‌లో ఉన్నాయి</span>
            </div>
            <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#65716D] block mb-1">నెగెటివ్ మార్కింగ్ విధానం</span>
              <span className="text-sm font-bold text-[#B33D44] block truncate">
                {examConfig.negativeMarkingPolicy.toUpperCase()}
              </span>
              <span className="text-[11px] text-[#65716D] block mt-1">అధికారికంగా ఇంకా రాలేదు</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exam Config */}
      {activeTab === "exam_config" && (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5]">
            <div>
              <h2 className="text-lg font-bold text-[#17211E]">
                అధికారిక నోటిఫికేషన్ నిబంధనల నిర్వహణ
              </h2>
              <p className="text-xs text-[#65716D]">
                నోటిఫికేషన్ నంబర్ 07/G/ES/2026, తేదీ 28/10/2026
              </p>
            </div>
            <Badge variant="primary">అధికారిక డేటా సోర్స్</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#17211E] mb-2">
                ధృవీకరించబడిన పరీక్ష తేదీ (Confirmed Date)
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E]"
              />
              <span className="text-[11px] text-[#65716D] mt-1 block">
                ప్రస్తుత తాత్కాలిక షెడ్యూల్: {examConfig.tentativeExamMonth}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] mb-2">
                నెగెటివ్ మార్కింగ్ విధానం (Negative Marking Policy)
              </label>
              <select
                value={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.value as any)}
                className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E]"
              >
                <option value="unconfirmed">అన్-కన్ఫర్మ్‌డ్ (నోటిఫికేషన్‌లో పేర్కొనలేదు)</option>
                <option value="none">నెగెటివ్ మార్కింగ్ లేదు (0 పెనాల్టీ)</option>
                <option value="one_fourth">1/4 పెనాల్టీ (0.25 మార్కులు)</option>
                <option value="one_third">1/3 పెనాల్టీ (0.33 మార్కులు)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl text-xs text-[#A66A19] leading-relaxed">
            <strong>గమనిక:</strong> నోటిఫికేషన్ 07/G/ES/2026 లో నెగెటివ్ మార్కింగ్ గురించి స్పష్టత లేదు. కమిషన్ నుండి వెబ్ నోట్ విడుదలయ్యే వరకు దీనిని అన్-కన్ఫర్మ్‌డ్‌గానే ప్రదర్శించాలి.
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                onUpdateExamConfig({
                  confirmedExamDate: examDate || null,
                  negativeMarkingPolicy: negativeMarking as any,
                });
                alert("పరీక్ష నిబంధనలు విజయవంతంగా భద్రపరచబడ్డాయి.");
              }}
            >
              నిబంధనలు అప్‌డేట్ చేయండి
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Syllabus */}
      {activeTab === "syllabus" && (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#17211E]">
            అధికారిక సిలబస్ జాబితా (21 అంశాలు)
          </h2>
          <div className="divide-y divide-[#E5EAE5]">
            {topics.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#176B5B]">
                    {t.paperId === "paper_1" ? "పేపర్ I" : "పేపర్ II"} • యూనిట్ {t.unitNumber}
                  </span>
                  <h4 className="font-bold text-sm text-[#17211E]">{t.titleTe}</h4>
                  <span className="text-xs text-[#65716D]">{t.titleEn}</span>
                </div>
                <Badge variant="primary" size="sm">
                  అధికారిక ధృవీకరణ ✓
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Question Bank */}
      {activeTab === "questions" && (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#17211E]">
              ప్రశ్నల నిధి (మొత్తం: {questions.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#65716D]" />
              <input
                type="text"
                placeholder="ప్రశ్నను వెతకండి..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl text-xs text-[#17211E]"
              />
            </div>
          </div>

          <div className="divide-y divide-[#E5EAE5] max-h-[500px] overflow-y-auto">
            {questions
              .filter(
                (q) =>
                  q.questionTextTe.includes(filterQuery) ||
                  q.questionTextEn.includes(filterQuery)
              )
              .map((q) => (
                <div key={q.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="primary" size="sm">
                      {q.paperId === "paper_1" ? "పేపర్ I" : "పేపర్ II"}
                    </Badge>
                    <Badge
                      variant={q.validationStatus === "approved" ? "success" : "warning"}
                      size="sm"
                    >
                      {q.validationStatus}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-[#17211E]">{q.questionTextTe}</h4>
                  <p className="text-xs text-[#65716D]">{q.explanationTe}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 5: AI Review Workflow */}
      {activeTab === "review" && (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#17211E]">
            AI రూపొందించిన ప్రశ్నల సమీక్ష మరియు ఆమోదం (Review Workflow)
          </h2>
          {pendingQuestions.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#65716D]">
              ప్రస్తుతం సమీక్షకు ఎలాంటి ప్రశ్నలు పెండింగ్‌లో లేవు. అన్ని ప్రశ్నలు ఆమోదించబడ్డాయి.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingQuestions.map((q) => (
                <div key={q.id} className="border border-[#E5EAE5] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">{q.validationStatus}</Badge>
                    <span className="text-xs text-[#65716D]">సోర్స్: {q.sourceType}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#17211E]">{q.questionTextTe}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-lg border ${
                          opt.id === q.correctOptionId
                            ? "bg-[#EEF9F2] border-[#1B8354] font-bold text-[#1B8354]"
                            : "bg-[#F5F6F2] border-[#E5EAE5]"
                        }`}
                      >
                        {opt.id}. {opt.textTe}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(q.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      తిరస్కరించు (Reject)
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(q.id)}
                      className="bg-[#1B8354] hover:bg-[#156E46]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      ఆమోదించు (Approve)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Audit Logs */}
      {activeTab === "logs" && (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-[#17211E]">సిస్టమ్ ఆడిట్ లాగ్స్</h2>
          <div className="divide-y divide-[#E5EAE5] max-h-96 overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="py-2.5 text-xs text-[#17211E] flex items-center justify-between">
                <div>
                  <strong>{log.action}</strong>
                  <span className="text-[#65716D] ml-2">{JSON.stringify(log.details)}</span>
                </div>
                <span className="text-[#65716D] font-mono text-[11px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
