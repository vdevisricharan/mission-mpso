"use client";

import React, { useState } from "react";
import { SyllabusTopic } from "@/types/curriculum";
import { TopicMasteryRecord } from "@/types/mastery";
import { TopicCard } from "./TopicCard";
import { Badge } from "../ui/Badge";
import { useTranslation } from "@/lib/i18n";

interface CurriculumViewProps {
  topics: SyllabusTopic[];
  masteryRecords: TopicMasteryRecord[];
  initialPaper?: "paper_1" | "paper_2";
}

export function CurriculumView({
  topics,
  masteryRecords,
  initialPaper = "paper_2",
}: CurriculumViewProps) {
  const { t, isEnglish } = useTranslation();
  const [activePaper, setActivePaper] = useState<"paper_1" | "paper_2">(initialPaper);

  const filteredTopics = topics.filter((t) => t.paperId === activePaper);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="primary">
                {isEnglish ? "Official Syllabus 07/G/ES/2026" : "అధికారిక సిలబస్ 07/G/ES/2026"}
              </Badge>
              <Badge variant="neutral">
                {isEnglish ? "Total 21 Units" : "మొత్తం 21 అంశాలు"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
              {t("curriculum_title")}
            </h1>
            <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
              {t("curriculum_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Paper Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <button
          onClick={() => setActivePaper("paper_2")}
          className={`p-4 rounded-2xl border text-center transition-all touch-target ${
            activePaper === "paper_2"
              ? "bg-[#176B5B] text-white border-[#176B5B] shadow-sm font-bold"
              : "bg-white text-[#17211E] border-[#E5EAE5] hover:bg-[#F5F6F2] font-semibold"
          }`}
        >
          <div className="text-sm sm:text-base mb-0.5">{t("paper_2_title")}</div>
          <div className={`text-[11px] ${activePaper === "paper_2" ? "text-[#E8F4F0]" : "text-[#65716D]"}`}>
            {t("paper_2_subtitle")}
          </div>
        </button>

        <button
          onClick={() => setActivePaper("paper_1")}
          className={`p-4 rounded-2xl border text-center transition-all touch-target ${
            activePaper === "paper_1"
              ? "bg-[#176B5B] text-white border-[#176B5B] shadow-sm font-bold"
              : "bg-white text-[#17211E] border-[#E5EAE5] hover:bg-[#F5F6F2] font-semibold"
          }`}
        >
          <div className="text-sm sm:text-base mb-0.5">{t("paper_1_title")}</div>
          <div className={`text-[11px] ${activePaper === "paper_1" ? "text-[#E8F4F0]" : "text-[#65716D]"}`}>
            {t("paper_1_subtitle")}
          </div>
        </button>
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
  );
}
