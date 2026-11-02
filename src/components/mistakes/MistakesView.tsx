"use client";

import React from "react";
import Link from "next/link";
import { MistakeBookItem } from "@/types/mastery";
import { Badge } from "../ui/Badge";
import { AlertTriangle, CheckCircle2, Bookmark, RotateCcw, Sparkles } from "lucide-react";
import { MathBlock } from "../math/MathBlock";
import { useTranslation } from "@/lib/i18n";

interface MistakesViewProps {
  mistakes: MistakeBookItem[];
}

export function MistakesView({ mistakes }: MistakesViewProps) {
  const { t, isEnglish } = useTranslation();
  const unresolved = mistakes.filter((m) => !m.isResolved);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="warning">
            {isEnglish ? "Self-Correction Tool" : "స్వీయ దిద్దుబాటు సాధనం"}
          </Badge>
          <Badge variant="primary">
            {isEnglish ? "Spaced Repetition Integration" : "స్పేస్డ్ రివిజన్ అనుసంధానం"}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {t("mistakes_title")}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {t("mistakes_desc")}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs font-bold text-[#17211E]">
          <span className="text-[#A66A19]">
            {t("pending_reviews_label")}: {unresolved.length}
          </span>
          <span>•</span>
          <span className="text-[#1B8354]">
            {t("resolved_label")}: {mistakes.length - unresolved.length}
          </span>
        </div>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {mistakes.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-3xl p-6 transition-all shadow-xs ${
              item.isResolved ? "border-[#BEE7CE] bg-[#FAFCFA]" : "border-[#E5EAE5]"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm">
                  {item.question.paperId === "paper_1"
                    ? isEnglish ? "Paper I: GS" : "పేపర్ I: GS"
                    : isEnglish ? "Paper II: Statistics" : "పేపర్ II: Statistics"}
                </Badge>
                <span className="text-xs text-[#A66A19] font-semibold bg-[#FEF7ED] px-2.5 py-0.5 rounded-lg border border-[#F6DCBA]">
                  {item.mistakeCategory === "formula_confusion"
                    ? t("mistake_formula")
                    : item.mistakeCategory === "calculation_mistake"
                    ? t("mistake_calc")
                    : item.mistakeCategory === "concept_misunderstanding"
                    ? t("mistake_concept")
                    : t("mistake_reading")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#65716D]">
                  {isEnglish ? `Reviews: ${item.reviewCount} times` : `సమీక్షలు: ${item.reviewCount} సార్లు`}
                </span>
                {item.bookmarked && (
                  <Bookmark className="w-4 h-4 text-[#A66A19] fill-[#A66A19]" />
                )}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-[#17211E] mb-2">
              {isEnglish && item.question.questionTextEn
                ? item.question.questionTextEn
                : item.question.questionTextTe}
            </h3>
            {isEnglish ? (
              <p className="text-xs text-[#65716D] mb-3">
                {item.question.questionTextTe}
              </p>
            ) : (
              item.question.questionTextEn && (
                <p className="text-xs text-[#65716D] mb-3">
                  {item.question.questionTextEn}
                </p>
              )
            )}

            {item.question.questionMathLatex && (
              <div className="my-3">
                <MathBlock math={item.question.questionMathLatex} />
              </div>
            )}

            {/* Options Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-3 bg-[#FDF2F2] border border-[#F9D6D8] rounded-xl text-[#B33D44]">
                <span className="font-semibold">{t("your_answer_label")} </span>
                <strong>Option {item.studentAnswer}</strong>
              </div>
              <div className="p-3 bg-[#EEF9F2] border border-[#BEE7CE] rounded-xl text-[#1B8354]">
                <span className="font-semibold">{t("correct_answer_label")} </span>
                <strong>Option {item.question.correctOptionId}</strong>
              </div>
            </div>

            {/* AI Explanation / Correction */}
            <div className="p-4 bg-[#F5F6F2] rounded-2xl text-xs sm:text-sm text-[#17211E] leading-relaxed mb-4">
              <div className="font-bold text-[#176B5B] mb-1">
                {t("explanation_solution_label")}
              </div>
              <p>{item.aiExplanationTe}</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#E5EAE5]">
              <span className="text-[11px] text-[#65716D] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#356EA0]" />
                <span>{t("next_revision_label")}</span>
              </span>

              <Link
                href={`/tutor?topicId=${item.question.topicId}`}
                className="px-4 py-2 rounded-xl bg-[#E8F4F0] text-[#176B5B] hover:bg-[#D5ECE5] text-xs font-bold flex items-center gap-1.5 touch-target"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("solve_with_tutor")}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
