"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { LessonContent, SyllabusTopic } from "@/types/curriculum";
import { MathBlock, MathInline } from "../math/MathBlock";
import { Badge } from "../ui/Badge";
import { useTranslation } from "@/lib/i18n";

interface LessonReaderProps {
  lesson: LessonContent;
  topic?: SyllabusTopic | null;
}

export function LessonReader({ lesson, topic }: LessonReaderProps) {
  const { t, isEnglish } = useTranslation();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#176B5B] hover:text-[#13584B] touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("back_to_syllabus")}</span>
        </Link>
        <Badge variant="primary" size="sm">
          {lesson.officialSyllabusMapping}
        </Badge>
      </div>

      {/* Main Header */}
      <header className="bg-white border border-[#E5EAE5] rounded-3xl p-6 md:p-8 mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#176B5B] uppercase tracking-wider">
          <span>{isEnglish ? topic?.unitTitleEn || "Unit" : topic?.unitTitleTe || "యూనిట్"}</span>
          <span>•</span>
          <span>
            {isEnglish
              ? `~${lesson.estimatedMinutes} ${t("study_duration")}`
              : `సుమారు ${lesson.estimatedMinutes} ${t("study_duration")}`}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2 leading-snug">
          {isEnglish ? lesson.titleEn || lesson.titleTe : lesson.titleTe}
        </h1>
        {lesson.titleEn && (
          <p className="text-sm sm:text-base text-[#65716D] font-medium mb-4">
            {isEnglish ? lesson.titleTe : lesson.titleEn}
          </p>
        )}
        <p className="text-sm sm:text-base text-[#17211E] leading-relaxed bg-[#F5F6F2] p-4 rounded-2xl border border-[#E5EAE5]">
          {isEnglish && lesson.overviewEn ? lesson.overviewEn : lesson.overviewTe}
        </p>
      </header>

      {/* Key Concepts Section */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#17211E] mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#A66A19]" />
          <span>{t("key_concepts")}</span>
        </h2>
        <div className="grid gap-4">
          {lesson.keyConceptsTe.map((kc, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5EAE5] rounded-2xl p-5 hover:border-[#176B5B]/30 transition-colors"
            >
              <h3 className="font-bold text-base text-[#17211E] mb-1.5">
                {isEnglish && kc.englishTerm ? kc.englishTerm : kc.concept}
                {isEnglish ? (
                  <span className="text-xs font-normal text-[#65716D] ml-2">
                    ({kc.concept})
                  </span>
                ) : kc.englishTerm ? (
                  <span className="text-xs font-normal text-[#65716D] ml-2">
                    ({kc.englishTerm})
                  </span>
                ) : null}
              </h3>
              <p className="text-sm text-[#4A5552] leading-relaxed">
                {kc.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulas Section */}
      {lesson.formulas && lesson.formulas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#17211E] mb-4 flex items-center gap-2">
            <span className="text-[#176B5B] font-serif italic text-xl">∑</span>
            <span>{t("formulas_title")}</span>
          </h2>
          <div className="space-y-4">
            {lesson.formulas.map((form) => (
              <div
                key={form.id}
                className="bg-white border border-[#E5EAE5] rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-[#17211E]">
                    {isEnglish ? form.nameEn || form.nameTe : form.nameTe}
                  </h3>
                  <span className="text-xs text-[#65716D] font-medium">
                    {isEnglish ? form.nameTe : form.nameEn}
                  </span>
                </div>

                {/* KaTeX Block */}
                <MathBlock math={form.latex} />

                {/* Symbols Explanation */}
                <div className="mt-4 pt-3 border-t border-[#E5EAE5]">
                  <h4 className="text-xs font-bold text-[#65716D] uppercase tracking-wider mb-2">
                    {t("formula_symbols_desc")}
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A5552]">
                    {form.symbolExplanationsTe.map((sym, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="font-serif font-bold text-[#176B5B]">
                          <MathInline math={sym.symbol} />
                        </span>
                        <span>: {sym.explanation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {form.sampleCalculationTe && (
                  <div className="mt-3 p-3 bg-[#E8F4F0] rounded-xl text-xs sm:text-sm text-[#104E43]">
                    <strong>{t("sample_calculation")}</strong> {form.sampleCalculationTe}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Worked Examples Section */}
      {lesson.workedExamples && lesson.workedExamples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#17211E] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#1B8354]" />
            <span>{t("worked_examples_title")}</span>
          </h2>
          <div className="space-y-5">
            {lesson.workedExamples.map((we) => (
              <div
                key={we.id}
                className="bg-white border border-[#E5EAE5] rounded-2xl p-6"
              >
                <h3 className="text-base font-bold text-[#17211E] mb-2">
                  {isEnglish ? we.titleEn || we.titleTe : we.titleTe}
                </h3>
                <div className="p-4 bg-[#F5F6F2] rounded-xl mb-4 text-sm font-medium text-[#17211E]">
                  <strong>{t("problem_label")}</strong> {isEnglish && we.problemEn ? we.problemEn : we.problemTe}
                </div>

                {/* Given Data */}
                <div className="mb-4 text-xs sm:text-sm text-[#65716D]">
                  <span className="font-bold text-[#17211E]">{t("given_data_label")} </span>
                  {we.givenDataTe.join(" | ")}
                </div>

                {/* Steps */}
                <div className="space-y-3 mb-4">
                  {we.stepByStepSolutionTe.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 bg-white border border-[#E5EAE5] rounded-xl"
                    >
                      <div className="text-xs font-bold text-[#176B5B] mb-1">
                        {t("step_label")} {step.stepNumber}
                      </div>
                      <p className="text-sm text-[#17211E] mb-1">
                        {step.description}
                      </p>
                      {step.mathLatex && <MathBlock math={step.mathLatex} />}
                    </div>
                  ))}
                </div>

                {/* Final Answer */}
                <div className="p-4 bg-[#EEF9F2] border border-[#BEE7CE] rounded-xl text-sm font-bold text-[#1B8354] mb-2">
                  <strong>{t("final_answer_label")}</strong> {we.finalAnswerTe}
                </div>
                <p className="text-xs text-[#65716D]">
                  <strong>{t("key_takeaway_label")}</strong> {we.keyTakeawayTe}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common Mistakes Section */}
      {lesson.commonMistakesTe && lesson.commonMistakesTe.length > 0 && (
        <section className="mb-8">
          <div className="bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl p-6">
            <h2 className="text-base sm:text-lg font-bold text-[#A66A19] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#A66A19]" />
              <span>{t("common_mistakes_title")}</span>
            </h2>
            <div className="space-y-4">
              {lesson.commonMistakesTe.map((cm, idx) => (
                <div key={idx} className="bg-white/90 p-4 rounded-xl border border-[#F6DCBA]">
                  <div className="text-sm font-bold text-[#B33D44] mb-1">
                    {t("mistake_label")} {cm.mistake}
                  </div>
                  <div className="text-sm font-semibold text-[#1B8354] mb-1">
                    {t("correction_label")} {cm.correction}
                  </div>
                  <p className="text-xs text-[#65716D]">
                    <strong>{t("reason_label")}</strong> {cm.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Revision Summary */}
      <section className="mb-10">
        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-6">
          <h2 className="text-base sm:text-lg font-bold text-[#17211E] mb-3">
            {t("quick_summary_title")}
          </h2>
          <ul className="space-y-2 text-sm text-[#4A5552]">
            {lesson.summaryPointsTe.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-20 md:bottom-6 bg-white/95 backdrop-blur border border-[#E5EAE5] p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#65716D] text-center sm:text-left">
          {t("lesson_finished_prompt")}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/tutor?topicId=${lesson.topicId}`}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8F4F0] text-[#176B5B] hover:bg-[#D5ECE5] text-sm font-bold touch-target"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("ask_ai_tutor")}</span>
          </Link>

          <Link
            href={`/practice?topicId=${lesson.topicId}`}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#176B5B] text-white hover:bg-[#13584B] text-sm font-bold touch-target shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("start_practice_quiz")}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
