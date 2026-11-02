"use client";

import React from "react";
import Link from "next/link";
import { FormulaItem } from "@/types/curriculum";
import { RevisionItem } from "@/types/mastery";
import { Badge } from "../ui/Badge";
import { RotateCcw, CheckCircle2, Clock, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { MathBlock } from "../math/MathBlock";
import { useTranslation } from "@/lib/i18n";

interface RevisionViewProps {
  dueItems: RevisionItem[];
  formulas: FormulaItem[];
}

export function RevisionView({ dueItems, formulas }: RevisionViewProps) {
  const { t, isEnglish } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <Badge variant="primary" className="mb-2">
          {isEnglish ? "Spaced Repetition System" : "స్పేస్డ్ రిపీటీషన్ సిస్టమ్ (Spaced Repetition)"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {isEnglish ? "Today's Revision Queue" : "నేటి పునశ్చరణ (Today's Revision Queue)"}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {isEnglish
            ? "Scientifically spaced review intervals (1, 3, 7, 14, 30 days) to prevent forgetting and cement long-term conceptual retention until the exam."
            : "సైంటిఫిక్ స్పేస్డ్ రిపీటీషన్ అల్గారిథమ్ (1, 3, 7, 14, 30 రోజుల వ్యవధులు) ద్వారా మతిమరుపును అరికట్టి పరీక్ష వరకు దీర్ఘకాలిక జ్ఞాపకశక్తిని పెంపొందిస్తుంది."}
        </p>
      </div>

      {/* Due Items or Completion Notice */}
      {dueItems.length > 0 ? (
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
            {isEnglish ? "Pending Spaced Reviews" : "పెండింగ్ పునశ్చరణ అంశాలు"}
          </h2>
          <div className="space-y-3">
            {dueItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold text-[#176B5B] uppercase mb-1">
                    {item.topicId} • {isEnglish ? `Interval ${item.intervalDays} days` : `వ్యవధి ${item.intervalDays} రోజులు`}
                  </div>
                  <h3 className="text-sm font-bold text-[#17211E]">
                    {item.referenceId}
                  </h3>
                </div>
                <Link
                  href="/practice"
                  className="px-4 py-2 rounded-xl bg-[#176B5B] text-white text-xs font-bold hover:bg-[#13584B] transition-colors"
                >
                  {isEnglish ? "Review Now" : "ఇప్పుడే సమీక్షించండి"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#EEF9F2] border border-[#BEE7CE] rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-[#1B8354] font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            {isEnglish
              ? "All spaced revision items for today are completed! Review core formulas below."
              : "నేటి పునశ్చరణ అంశాలన్నీ పూర్తయ్యాయి! క్రింది కీలక సూత్రాలను పునశ్చరణ చేసుకోండి."}
          </span>
        </div>
      )}

      {/* Quick Formula Flashcards */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
          <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
            {isEnglish ? "Essential Formula Flashcards" : "కీలక సూత్రాల ఫ్లాష్‌కార్డులు (Quick Formulas)"}
          </h2>
          <Badge variant="info">{isEnglish ? "Quick Recall" : "త్వరిత రీకాల్"}</Badge>
        </div>

        <div className="grid gap-4">
          {formulas.slice(0, 4).map((form) => (
            <div
              key={form.id}
              className="p-5 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#17211E]">
                  {isEnglish ? form.nameEn || form.nameTe : form.nameTe}
                </h3>
                <span className="text-xs text-[#65716D]">
                  {isEnglish ? form.nameTe : form.nameEn}
                </span>
              </div>
              <MathBlock math={form.latex} />
              <p className="text-xs text-[#65716D]">
                <strong>{isEnglish ? "Usage: " : "వినియోగం: "}</strong> {form.usageTe}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
