"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Clock, Award } from "lucide-react";
import { SyllabusTopic } from "@/types/curriculum";
import { MasteryLevel } from "@/types/mastery";
import { Badge } from "../ui/Badge";
import { useTranslation } from "@/lib/i18n";

interface TopicCardProps {
  topic: SyllabusTopic;
  masteryLevel?: MasteryLevel;
  accuracyPercentage?: number;
}

export function TopicCard({
  topic,
  masteryLevel = "not_assessed",
  accuracyPercentage = 0,
}: TopicCardProps) {
  const { t, isEnglish } = useTranslation();

  const masteryConfig = {
    not_assessed: { labelTe: "పరిశీలించలేదు", labelEn: "Not Assessed", variant: "neutral" as const },
    beginning: { labelTe: "ప్రారంభ దశ", labelEn: "Beginning", variant: "warning" as const },
    developing: { labelTe: "అభివృద్ధి చెందుతోంది", labelEn: "Developing", variant: "warning" as const },
    practising: { labelTe: "సాధనలో ఉంది", labelEn: "Practising", variant: "info" as const },
    proficient: { labelTe: "ప్రావీణ్యత", labelEn: "Proficient", variant: "primary" as const },
    strong: { labelTe: "బలమైన పట్టు", labelEn: "Strong Mastery", variant: "success" as const },
  };

  const currentMastery = masteryConfig[masteryLevel];

  const paperLabel = isEnglish
    ? topic.paperId === "paper_1"
      ? "Paper I — General Studies"
      : "Paper II — Statistics"
    : topic.paperId === "paper_1"
    ? "పేపర్ I — జనరల్ స్టడీస్"
    : "పేపర్ II — స్టాటిస్టిక్స్";

  return (
    <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 hover:border-[#176B5B]/50 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#176B5B] uppercase tracking-wider">
            {paperLabel}
          </span>
          <Badge variant={currentMastery.variant} size="sm">
            {isEnglish ? currentMastery.labelEn : currentMastery.labelTe}
            {masteryLevel !== "not_assessed" && ` (${accuracyPercentage}%)`}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#17211E] mb-1.5 leading-snug">
          {isEnglish ? topic.titleEn : topic.titleTe}
        </h3>
        <p className="text-xs text-[#65716D] font-medium mb-3">
          {isEnglish ? topic.titleTe : topic.titleEn}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#65716D] line-clamp-2 mb-4 leading-relaxed">
          {isEnglish ? topic.descriptionEn || topic.descriptionTe : topic.descriptionTe}
        </p>

        {/* Meta Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#65716D] mb-5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#176B5B]" />
            <span>~{topic.estimatedStudyHours} {isEnglish ? "hours" : "గంటలు"}</span>
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#356EA0]" />
            <span>
              {isEnglish ? `~${topic.weightageEstimatedQuestions} marks` : `సుమారు ${topic.weightageEstimatedQuestions} మార్కులు`}
            </span>
          </span>
          {topic.isVerifiedOfficial && (
            <span className="text-[11px] text-[#176B5B] bg-[#E8F4F0] px-2 py-0.5 rounded-md font-medium">
              {isEnglish ? "Official Syllabus ✓" : "అధికారిక సిలబస్ ✓"}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E5EAE5]/60">
        <Link
          href={`/learn/${topic.id}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#E8F4F0] text-[#176B5B] hover:bg-[#D5ECE5] text-xs sm:text-sm font-semibold transition-colors touch-target"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t("read_lesson")}</span>
        </Link>

        <Link
          href={`/practice?topicId=${topic.id}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-[#E5EAE5] text-[#17211E] hover:bg-[#F5F6F2] text-xs sm:text-sm font-medium transition-colors touch-target"
        >
          <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
          <span>{t("practice_topic")}</span>
        </Link>
      </div>
    </div>
  );
}
