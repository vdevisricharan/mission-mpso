"use client";

import React from "react";
import Link from "next/link";
import { CurrentAffairsItem } from "@/types/current-affairs";
import { Badge } from "../ui/Badge";
import { Calendar, Globe, ExternalLink, BookOpen, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface CurrentAffairsViewProps {
  items: CurrentAffairsItem[];
}

export function CurrentAffairsView({ items }: CurrentAffairsViewProps) {
  const { t, isEnglish } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <Badge variant="primary" className="mb-2">
          {isEnglish ? "Paper I: General Studies" : "పేపర్ I: జనరల్ స్టడీస్"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {isEnglish
            ? "Telangana & National Current Affairs"
            : "తెలంగాణ & జాతీయ వర్తమాన వ్యవహారాలు (Current Affairs)"}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {isEnglish
            ? "Verified current events grounded in official government reports and economic surveys, contributing ~15-20 marks in Paper I."
            : "MPSO పరీక్షలో పేపర్ I లో సుమారు 15-20 మార్కులు కరెంట్ అఫైర్స్ నుండి వచ్చే అవకాశం ఉంది. అధికారిక ప్రభుత్వ నివేదికల ఆధారంగా ధృవీకరించిన వార్తా విశేషాలు."}
        </p>
      </div>

      {/* Current Affairs Articles */}
      <div className="space-y-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {item.category === "telangana_policies"
                    ? isEnglish ? "Telangana Policies" : "తెలంగాణ పథకాలు"
                    : item.category === "telangana_economy"
                    ? isEnglish ? "Telangana Economy" : "తెలంగాణ ఆర్థిక వ్యవస్థ"
                    : isEnglish ? "Science & Tech" : "సైన్స్ & టెక్నాలజీ"}
                </Badge>
                <span className="text-[#65716D] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.publishedDate}</span>
                </span>
              </div>

              <span className="text-[11px] text-[#1B8354] bg-[#EEF9F2] px-2 py-0.5 rounded-md font-semibold">
                {isEnglish ? "Officially Verified ✓" : "అధికారికంగా ధృవీకరించబడింది ✓"}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#17211E] leading-snug">
              {isEnglish ? item.titleEn : item.titleTe}
            </h2>
            {item.titleEn && (
              <p className="text-xs text-[#65716D]">
                {isEnglish ? item.titleTe : item.titleEn}
              </p>
            )}

            <p className="text-sm text-[#4A5552] leading-relaxed">
              {isEnglish && item.summaryEn ? item.summaryEn : item.summaryTe}
            </p>

            {/* Bullet Points */}
            <div className="p-4 bg-[#F5F6F2] rounded-2xl">
              <h3 className="text-xs font-bold text-[#176B5B] uppercase tracking-wider mb-2">
                {isEnglish ? "Exam Points:" : "పరీక్ష ముఖ్యాంశాలు:"}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#17211E]">
                {item.bulletPointsTe.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Source Citation & Practice Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#E5EAE5] text-xs text-[#65716D]">
              <span>
                {isEnglish ? "Source: " : "అధికారిక మూలం: "}
                <strong className="text-[#17211E]">{item.sourceOrganization}</strong>
              </span>

              <Link
                href="/practice?paperId=paper_1"
                className="text-[#176B5B] font-bold hover:underline flex items-center gap-1 touch-target"
              >
                <span>{isEnglish ? "Practice GS Questions" : "జనరల్ స్టడీస్ ప్రశ్నలు ప్రాక్టీస్ చేయండి"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
