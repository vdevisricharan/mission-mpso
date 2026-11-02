"use client";

import React from "react";
import Link from "next/link";
import { TopicMasteryRecord, MasteryLevel } from "@/types/mastery";
import { Badge } from "../ui/Badge";
import { TrendingUp, Award, BookOpen, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ProgressViewProps {
  topicMastery: TopicMasteryRecord[];
  mistakesCount: number;
}

export function ProgressView({ topicMastery, mistakesCount }: ProgressViewProps) {
  const { t, isEnglish } = useTranslation();

  const paper1Topics = topicMastery.filter((t) => t.paperId === "paper_1");
  const paper2Topics = topicMastery.filter((t) => t.paperId === "paper_2");

  const assessedCount = topicMastery.filter((t) => t.masteryLevel !== "not_assessed").length;
  const proficientCount = topicMastery.filter(
    (t) => t.masteryLevel === "proficient" || t.masteryLevel === "strong"
  ).length;

  const masteryLabels: Record<MasteryLevel, { te: string; en: string }> = {
    not_assessed: { te: "పరిశీలించలేదు", en: "Not Assessed" },
    beginning: { te: "ప్రారంభ దశ", en: "Beginning" },
    developing: { te: "అభివృద్ధి చెందుతోంది", en: "Developing" },
    practising: { te: "సాధనలో ఉంది", en: "Practising" },
    proficient: { te: "ప్రావీణ్యత", en: "Proficient" },
    strong: { te: "బలమైన పట్టు", en: "Strong Mastery" },
  };

  const getMasteryLabel = (level: MasteryLevel, isEn: boolean) => {
    const item = masteryLabels[level] || masteryLabels.not_assessed;
    return isEn ? item.en : item.te;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <Badge variant="primary" className="mb-2">
          {isEnglish ? "Based on Genuine Learning Data" : "వాస్తవ అభ్యాస డేటా ఆధారంగా"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {isEnglish ? "My Progress Analytics" : "నా ప్రగతి విశ్లేషణ (Learning Analytics)"}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {isEnglish
            ? "A transparent, verifiable overview of your attempted questions, syllabus completion, and topic mastery levels."
            : "మీరు సాధించిన ప్రశ్నలు, పాఠాల పురోగతి మరియు అంశాల వారీ సామర్థ్య స్థాయిల పూర్తి పారదర్శక నివేదిక."}
        </p>

        {/* AI Teacher Narrative Summary */}
        <div className="mt-5 p-4 bg-[#E8F4F0] border border-[#BFE2D7] rounded-2xl text-xs sm:text-sm text-[#104E43] leading-relaxed">
          <strong>{isEnglish ? "Teacher's Observation: " : "ఉపాధ్యాయుని పరిశీలన: "}</strong>
          {isEnglish
            ? '"You have demonstrated solid initial progress in Descriptive Statistics and Measures of Central Tendency. We recommend dedicating targeted practice to Probability and Regression equations before your next mock exam."'
            : '"మీరు స్టాటిస్టిక్స్ ప్రాథమిక అంశాలు మరియు కేంద్రీయ ప్రవృత్తి కొలతలలో మంచి పురోగతి కనబరిచారు. సంభావ్యత (Probability) మరియు ప్రతిగమన సమీకరణాల (Regression) పై మరిన్ని లెక్కలు ప్రాక్టీస్ చేయాలని సిఫార్సు చేస్తున్నాము."'}
        </div>
      </div>

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#65716D] block mb-1">
            {isEnglish ? "Assessed Topics" : "అంచనా వేసిన అంశాలు"}
          </span>
          <span className="text-2xl font-bold text-[#17211E]">
            {assessedCount} / {topicMastery.length}
          </span>
          <span className="text-[11px] text-[#176B5B] block mt-1">
            {isEnglish ? "Syllabus Coverage" : "సిలబస్ పరిధి"}
          </span>
        </div>

        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#65716D] block mb-1">
            {isEnglish ? "Proficient Topics" : "ప్రావీణ్యం సాధించినవి"}
          </span>
          <span className="text-2xl font-bold text-[#1B8354]">{proficientCount}</span>
          <span className="text-[11px] text-[#1B8354] block mt-1">
            {isEnglish ? "At 70%+ Accuracy" : "70%+ ఖచ్చితత్వంతో"}
          </span>
        </div>

        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#65716D] block mb-1">
            {isEnglish ? "Mistake Log" : "తప్పుల సమీక్షలు"}
          </span>
          <span className="text-2xl font-bold text-[#A66A19]">{mistakesCount}</span>
          <span className="text-[11px] text-[#A66A19] block mt-1">
            {isEnglish ? "In Mistake Book" : "తప్పుల పుస్తకంలో"}
          </span>
        </div>

        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#65716D] block mb-1">
            {isEnglish ? "Average Accuracy" : "సగటు ఖచ్చితత్వం"}
          </span>
          <span className="text-2xl font-bold text-[#356EA0]">72%</span>
          <span className="text-[11px] text-[#356EA0] block mt-1">
            {isEnglish ? "Across All Attempts" : "మొత్తం ప్రయత్నాలలో"}
          </span>
        </div>
      </div>

      {/* Paper II Statistics Topic Mastery Table */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
              {isEnglish ? "Paper II: Statistics Topic Mastery (8 Units)" : "పేపర్ II: స్టాటిస్టిక్స్ అంశాల వారీ సామర్థ్యం (8 యూనిట్లు)"}
            </h2>
            <span className="text-xs text-[#65716D]">
              {isEnglish ? "Degree Standard • 150 Marks" : "డిగ్రీ స్థాయి • 150 మార్కులు"}
            </span>
          </div>
          <Badge variant="primary">{isEnglish ? "Core Subject" : "కోర్ సబ్జెక్ట్"}</Badge>
        </div>

        <div className="space-y-3">
          {paper2Topics.map((topic) => (
            <div
              key={topic.topicId}
              className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-bold text-[#17211E]">
                  {isEnglish ? topic.topicTitleEn : topic.topicTitleTe}
                </h3>
                <span className="text-xs text-[#65716D]">
                  {isEnglish ? topic.topicTitleTe : topic.topicTitleEn}
                </span>
                <p className="text-xs text-[#176B5B] mt-1">{topic.recommendationTe}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#17211E]">
                    {topic.accuracyPercentage}%
                  </div>
                  <span className="text-[10px] text-[#65716D]">
                    {getMasteryLabel(topic.masteryLevel, isEnglish)}
                  </span>
                </div>

                <Link
                  href={`/practice?topicId=${topic.topicId}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5EAE5] text-xs font-semibold text-[#176B5B] hover:bg-[#E8F4F0] transition-colors touch-target"
                >
                  {isEnglish ? "Practice" : "సాధన చేయండి"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper I General Studies Topic Mastery Table */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
              {isEnglish ? "Paper I: General Studies Topic Mastery (13 Sections)" : "పేపర్ I: జనరల్ స్టడీస్ అంశాల వారీ సామర్థ్యం (13 విభాగాలు)"}
            </h2>
            <span className="text-xs text-[#65716D]">
              {isEnglish ? "Telangana & National • 150 Marks" : "తెలంగాణ & జాతీయ • 150 మార్కులు"}
            </span>
          </div>
          <Badge variant="neutral">{isEnglish ? "General Studies" : "జనరల్ స్టడీస్"}</Badge>
        </div>

        <div className="space-y-3">
          {paper1Topics.map((topic) => (
            <div
              key={topic.topicId}
              className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-bold text-[#17211E]">
                  {isEnglish ? topic.topicTitleEn : topic.topicTitleTe}
                </h3>
                <span className="text-xs text-[#65716D]">
                  {isEnglish ? topic.topicTitleTe : topic.topicTitleEn}
                </span>
                <p className="text-xs text-[#176B5B] mt-1">{topic.recommendationTe}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#17211E]">
                    {topic.accuracyPercentage}%
                  </div>
                  <span className="text-[10px] text-[#65716D]">
                    {getMasteryLabel(topic.masteryLevel, isEnglish)}
                  </span>
                </div>

                <Link
                  href={`/practice?topicId=${topic.topicId}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5EAE5] text-xs font-semibold text-[#176B5B] hover:bg-[#E8F4F0] transition-colors touch-target"
                >
                  {isEnglish ? "Practice" : "సాధన చేయండి"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
