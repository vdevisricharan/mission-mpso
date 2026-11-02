"use client";

import React from "react";
import Link from "next/link";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useTranslation } from "@/lib/i18n";

export interface MockItemConfig {
  id: string;
  titleTe: string;
  titleEn: string;
  paperId: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  descriptionTe: string;
  descriptionEn: string;
}

interface MocksListViewProps {
  mockTests: MockItemConfig[];
}

export function MocksListView({ mockTests }: MocksListViewProps) {
  const { t, isEnglish } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="primary">
            {isEnglish ? "TGPSC Notification 07/G/ES/2026" : "TGPSC నోటిఫికేషన్ 07/G/ES/2026"}
          </Badge>
          <Badge variant="warning">
            {isEnglish ? "Negative Marking Unconfirmed" : "నెగెటివ్ మార్కింగ్ అన్-కన్ఫర్మ్‌డ్"}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {t("mock_page_title")}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {t("mock_page_desc")}
        </p>

        <div className="mt-4 p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#A66A19] shrink-0 mt-0.5" />
          <div className="text-xs text-[#A66A19] leading-relaxed">
            <strong>{isEnglish ? "Important Notice:" : "ముఖ్య గమనిక:"} </strong>
            {t("negative_marking_notice")}
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider">
                  {mock.paperId === "paper_1"
                    ? isEnglish ? "Paper I" : "పేపర్ I"
                    : isEnglish ? "Paper II" : "పేపర్ II"}
                </span>
                <span className="text-xs text-[#65716D]">•</span>
                <span className="text-xs text-[#65716D] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#176B5B]" />
                  <span>{mock.durationMinutes} {isEnglish ? "Minutes" : "నిమిషాలు"}</span>
                </span>
                <span className="text-xs text-[#65716D]">•</span>
                <span className="text-xs text-[#65716D] font-medium">
                  {mock.totalQuestions} {isEnglish ? `Questions (${mock.totalMarks} Marks)` : `ప్రశ్నలు (${mock.totalMarks} మార్కులు)`}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#17211E] mb-1">
                {isEnglish ? mock.titleEn : mock.titleTe}
              </h3>
              <p className="text-xs text-[#65716D] mb-3">
                {isEnglish ? mock.titleTe : mock.titleEn}
              </p>
              <p className="text-xs sm:text-sm text-[#4A5552] leading-relaxed">
                {isEnglish ? mock.descriptionEn : mock.descriptionTe}
              </p>
            </div>

            <Link
              href={`/mocks/${mock.id}`}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-[#176B5B] text-white font-bold text-sm hover:bg-[#13584B] transition-colors flex items-center justify-center gap-2 touch-target shadow-sm whitespace-nowrap"
            >
              <span>{t("start_exam_btn")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
