"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  RotateCcw,
  BookOpen,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Question, QuestionOptionId, MistakeCategory } from "@/types/question";
import { MathBlock, MathInline } from "../math/MathBlock";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatTime } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface QuizInterfaceProps {
  questions: Question[];
  titleTe?: string;
  titleEn?: string;
  isTimed?: boolean;
  timeLimitSeconds?: number;
  onFinish?: (submissions: Record<string, any>) => void;
  onRecordMistake?: (q: Question, selected: QuestionOptionId, cat: MistakeCategory) => void;
}

export function QuizInterface({
  questions,
  titleTe = "అభ్యాస క్విజ్",
  titleEn = "Practice Quiz",
  isTimed = false,
  timeLimitSeconds = 600,
  onFinish,
  onRecordMistake,
}: QuizInterfaceProps) {
  const { t, isEnglish } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, QuestionOptionId>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [mistakeCategories, setMistakeCategories] = useState<Record<string, MistakeCategory>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentQ?.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === currentQ?.correctOptionId;

  // Timer countdown if timed
  useEffect(() => {
    if (!isTimed || isCompleted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimed, isCompleted]);

  const handleSelectOption = (optionId: QuestionOptionId) => {
    if (selectedAnswers[currentQ.id]) return; // already chosen

    const updatedAnswers = { ...selectedAnswers, [currentQ.id]: optionId };
    setSelectedAnswers(updatedAnswers);
    setShowExplanation({ ...showExplanation, [currentQ.id]: true });

    // If answer is incorrect, record mistake
    if (optionId !== currentQ.correctOptionId) {
      const defaultCategory: MistakeCategory = currentQ.numericalMetadata?.isNumerical
        ? "calculation_mistake"
        : "concept_misunderstanding";
      setMistakeCategories({ ...mistakeCategories, [currentQ.id]: defaultCategory });
      if (onRecordMistake) {
        onRecordMistake(currentQ, optionId, defaultCategory);
      }
    }
  };

  const handleCategoryChange = (cat: MistakeCategory) => {
    setMistakeCategories({ ...mistakeCategories, [currentQ.id]: cat });
    if (onRecordMistake && selectedOption) {
      onRecordMistake(currentQ, selectedOption, cat);
    }
  };

  const handleSubmitQuiz = () => {
    setIsCompleted(true);
    if (onFinish) {
      const submissions = Object.keys(selectedAnswers).reduce((acc, qId) => {
        const q = questions.find((item) => item.id === qId);
        const sel = selectedAnswers[qId];
        acc[qId] = {
          questionId: qId,
          selectedOptionId: sel,
          isCorrect: sel === q?.correctOptionId,
          mistakeCategory: mistakeCategories[qId] || "unclassified",
          timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
        };
        return acc;
      }, {} as Record<string, any>);
      onFinish(submissions);
    }
  };

  // If quiz is finished, show Summary Report
  if (isCompleted) {
    const total = questions.length;
    const attempted = Object.keys(selectedAnswers).length;
    const correctCount = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctOptionId
    ).length;
    const wrongCount = attempted - correctCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#E8F4F0] text-[#176B5B] mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-[#17211E] mb-2">
            {t("quiz_completed_title")}
          </h2>
          <p className="text-sm text-[#65716D] mb-6">
            {t("quiz_completed_desc")}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 bg-[#F5F6F2] rounded-2xl">
              <span className="block text-xs text-[#65716D] font-medium mb-1">{t("total_q_label")}</span>
              <span className="text-xl font-bold text-[#17211E]">{total}</span>
            </div>
            <div className="p-4 bg-[#EEF9F2] rounded-2xl">
              <span className="block text-xs text-[#1B8354] font-medium mb-1">{t("correct_label")}</span>
              <span className="text-xl font-bold text-[#1B8354]">{correctCount}</span>
            </div>
            <div className="p-4 bg-[#FDF2F2] rounded-2xl">
              <span className="block text-xs text-[#B33D44] font-medium mb-1">{t("incorrect_label")}</span>
              <span className="text-xl font-bold text-[#B33D44]">{wrongCount}</span>
            </div>
            <div className="p-4 bg-[#E8F4F0] rounded-2xl">
              <span className="block text-xs text-[#176B5B] font-medium mb-1">{t("accuracy_label")}</span>
              <span className="text-xl font-bold text-[#176B5B]">{accuracy}%</span>
            </div>
          </div>

          {wrongCount > 0 && (
            <div className="mb-8 p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl text-left">
              <div className="flex items-center gap-2 text-sm font-bold text-[#A66A19] mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{t("mistakes_saved_note")}</span>
              </div>
              <p className="text-xs text-[#65716D] leading-relaxed">
                {t("mistakes_saved_desc")}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#176B5B] text-white font-bold hover:bg-[#13584B] transition-colors touch-target"
            >
              {t("go_to_home")}
            </Link>
            <Link
              href="/mistakes"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E5EAE5] bg-white text-[#17211E] font-medium hover:bg-[#F5F6F2] transition-colors touch-target"
            >
              {t("view_mistake_book")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainTitle = isEnglish ? titleEn : titleTe;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      {/* Top Bar with Question Counter & Timer */}
      <div className="flex items-center justify-between mb-6 bg-white border border-[#E5EAE5] px-5 py-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider">
            {mainTitle}
          </span>
          <span className="text-xs text-[#65716D]">•</span>
          <span className="text-xs font-semibold text-[#17211E]">
            {t("question_counter")} {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {isTimed && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#A66A19] bg-[#FEF7ED] px-3 py-1.5 rounded-lg border border-[#F6DCBA]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#E5EAE5] h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-[#176B5B] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 mb-6 shadow-xs">
        {/* Topic Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant="primary" size="sm">
            {isEnglish
              ? currentQ.paperId === "paper_1" ? "Paper I: GS" : "Paper II: Statistics"
              : currentQ.paperId === "paper_1" ? "పేపర్ I: GS" : "పేపర్ II: Statistics"}
          </Badge>
          <span className="text-xs text-[#65716D] font-medium uppercase">
            {isEnglish
              ? currentQ.difficulty
              : currentQ.difficulty === "easy"
              ? "సులభం"
              : currentQ.difficulty === "medium"
              ? "మధ్యస్థం"
              : "కఠినం"}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-[#17211E] mb-3 leading-relaxed">
          {isEnglish && currentQ.questionTextEn ? currentQ.questionTextEn : currentQ.questionTextTe}
        </h2>
        {isEnglish ? (
          <p className="text-xs sm:text-sm text-[#65716D] mb-4">
            {currentQ.questionTextTe}
          </p>
        ) : (
          currentQ.questionTextEn && (
            <p className="text-xs sm:text-sm text-[#65716D] mb-4">
              {currentQ.questionTextEn}
            </p>
          )
        )}
        {currentQ.questionMathLatex && (
          <MathBlock math={currentQ.questionMathLatex} />
        )}

        {/* Options */}
        <div className="space-y-3 mt-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = opt.id === currentQ.correctOptionId;

            let optionStyle =
              "bg-white border-[#E5EAE5] text-[#17211E] hover:border-[#176B5B]/50 hover:bg-[#F5F6F2]";

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = "bg-[#EEF9F2] border-[#1B8354] text-[#1B8354] font-semibold";
              } else if (isSelected) {
                optionStyle = "bg-[#FDF2F2] border-[#B33D44] text-[#B33D44]";
              } else {
                optionStyle = "bg-white border-[#E5EAE5] text-[#65716D] opacity-60";
              }
            }

            const primaryText = isEnglish && opt.textEn ? opt.textEn : opt.textTe;
            const secondaryText = isEnglish ? opt.textTe : opt.textEn;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 touch-target select-none ${optionStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isAnswered && isCorrectOption
                      ? "bg-[#1B8354] text-white"
                      : isAnswered && isSelected
                      ? "bg-[#B33D44] text-white"
                      : "bg-[#F5F6F2] text-[#17211E]"
                  }`}
                >
                  {opt.id}
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium">
                    {primaryText}
                  </div>
                  {secondaryText && (
                    <div className="text-xs text-[#65716D] mt-0.5">
                      {secondaryText}
                    </div>
                  )}
                  {opt.mathLatex && <MathBlock math={opt.mathLatex} />}
                </div>
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#1B8354] shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-[#B33D44] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanatory Feedback */}
        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-[#E5EAE5] space-y-4">
            <div
              className={`p-4 rounded-2xl ${
                isCorrect ? "bg-[#EEF9F2] text-[#1B8354]" : "bg-[#FDF2F2] text-[#B33D44]"
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isCorrect ? t("correct_feedback") : t("incorrect_feedback")}
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-[#17211E]">
                {isEnglish && currentQ.explanationEn ? currentQ.explanationEn : currentQ.explanationTe}
              </div>
            </div>

            {currentQ.relevantFormulaLatex && (
              <div className="p-3 bg-[#F5F6F2] rounded-xl text-center">
                <span className="text-xs font-semibold text-[#65716D] block mb-1">
                  {t("formula_used_label")}
                </span>
                <MathBlock math={currentQ.relevantFormulaLatex} />
              </div>
            )}

            {/* Error Category Selector if wrong */}
            {!isCorrect && (
              <div className="p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl">
                <span className="text-xs font-bold text-[#A66A19] block mb-2">
                  {t("why_mistake_prompt")}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "concept_misunderstanding", label: t("mistake_concept") },
                    { id: "formula_confusion", label: t("mistake_formula") },
                    { id: "calculation_mistake", label: t("mistake_calc") },
                    { id: "question_reading_mistake", label: t("mistake_reading") },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id as MistakeCategory)}
                      className={`p-2 rounded-lg border text-left font-medium transition-colors ${
                        mistakeCategories[currentQ.id] === cat.id
                          ? "bg-[#A66A19] text-white border-[#A66A19]"
                          : "bg-white border-[#E5EAE5] text-[#17211E] hover:bg-[#F5F6F2]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("previous_question")}</span>
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="flex items-center gap-1.5"
          >
            <span>{t("next_question")}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            className="bg-[#1B8354] hover:bg-[#156E46]"
          >
            {t("submit_quiz")}
          </Button>
        )}
      </div>
    </div>
  );
}
