"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { MockExamSession, QuestionStatus } from "@/types/mock";
import { QuestionOptionId } from "@/types/question";
import { MathBlock } from "../math/MathBlock";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatTime } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface MockSimulatorProps {
  session: MockExamSession;
  onSubmitMock: (session: MockExamSession) => void;
}

export function MockSimulator({ session: initialSession, onSubmitMock }: MockSimulatorProps) {
  const { t, isEnglish } = useTranslation();
  const [session, setSession] = useState<MockExamSession>(initialSession);
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex || 0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFinished, setIsFinished] = useState(session.status !== "in_progress");

  // Server-authoritative timer: calculate remaining seconds from expiresAt
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const expiresMs = new Date(session.expiresAt).getTime();
    const nowMs = Date.now();
    return Math.max(0, Math.floor((expiresMs - nowMs) / 1000));
  });

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      const expiresMs = new Date(session.expiresAt).getTime();
      const diffSecs = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setSecondsRemaining(diffSecs);

      if (diffSecs <= 0) {
        clearInterval(interval);
        handleFinalSubmit(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session.expiresAt, isFinished]);

  const currentQ = session.questions[currentIndex];
  const currentState = session.questionStates[currentQ?.id] || {
    questionId: currentQ?.id,
    questionNumber: currentIndex + 1,
    paperId: currentQ?.paperId,
    selectedOptionId: null,
    status: "not_visited",
    timeSpentSeconds: 0,
  };

  const handleSelectOption = (optId: QuestionOptionId) => {
    const isMarked =
      currentState.status === "marked_for_review" ||
      currentState.status === "answered_and_marked";
    const nextStatus: QuestionStatus = isMarked ? "answered_and_marked" : "answered";

    setSession((prev) => ({
      ...prev,
      questionStates: {
        ...prev.questionStates,
        [currentQ.id]: {
          ...currentState,
          selectedOptionId: optId,
          status: nextStatus,
        },
      },
    }));
  };

  const handleClearResponse = () => {
    setSession((prev) => ({
      ...prev,
      questionStates: {
        ...prev.questionStates,
        [currentQ.id]: {
          ...currentState,
          selectedOptionId: null,
          status: "unanswered",
        },
      },
    }));
  };

  const handleToggleMarkReview = () => {
    let nextStatus: QuestionStatus = "marked_for_review";
    if (currentState.selectedOptionId) {
      nextStatus =
        currentState.status === "answered_and_marked"
          ? "answered"
          : "answered_and_marked";
    } else {
      nextStatus =
        currentState.status === "marked_for_review" ? "unanswered" : "marked_for_review";
    }

    setSession((prev) => ({
      ...prev,
      questionStates: {
        ...prev.questionStates,
        [currentQ.id]: {
          ...currentState,
          status: nextStatus,
        },
      },
    }));
  };

  const handleFinalSubmit = (autoExpired: boolean = false) => {
    setShowSubmitModal(false);
    setIsFinished(true);

    const completedSession: MockExamSession = {
      ...session,
      status: autoExpired ? "auto_submitted_expired" : "submitted",
      submittedAt: new Date().toISOString(),
    };
    setSession(completedSession);
    onSubmitMock(completedSession);
  };

  // State Counts for Palette
  const stateCounts = Object.values(session.questionStates).reduce(
    (acc, state) => {
      acc[state.status] = (acc[state.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Top Banner with Exam Info & Server Countdown */}
      <header className="bg-white border-b border-[#E5EAE5] px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#176B5B] text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#17211E]">
                {isEnglish ? session.titleEn || session.titleTe : session.titleTe}
              </h1>
              <span className="text-[11px] text-[#65716D]">
                {isEnglish
                  ? `Notification 07/G/ES/2026 • ${session.totalQuestions} Questions • ${session.totalDurationMinutes} Minutes`
                  : `నోటిఫికేషన్ 07/G/ES/2026 • ${session.totalQuestions} ప్రశ్నలు • ${session.totalDurationMinutes} నిమిషాలు`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Warning indicator for unconfirmed negative marking */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FEF7ED] border border-[#F6DCBA] text-[11px] font-semibold text-[#A66A19]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t("negative_marking_warning")}</span>
            </div>

            {/* Authoritative Timer */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#17211E] text-white font-mono text-sm sm:text-base font-bold">
              <Clock className="w-4 h-4 text-[#176B5B]" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="bg-[#1B8354] hover:bg-[#156E46]"
            >
              {t("submit_exam_btn")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Examination Viewport */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4 md:py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Presentation Area */}
        <div className="flex-1 flex flex-col bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5] mb-6">
            <span className="text-sm font-extrabold text-[#176B5B]">
              {t("question_counter")}: {currentIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {isEnglish ? "+1 Mark" : "+1 మార్కు"}
              </Badge>
              <Badge variant="neutral" size="sm">
                {isEnglish ? "0 Penalty (Unconfirmed)" : "0 పెనాల్టీ (అన్-కన్ఫర్మ్‌డ్)"}
              </Badge>
            </div>
          </div>

          {/* Question Text */}
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-bold text-[#17211E] mb-3 leading-relaxed">
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

            {/* Options Palette */}
            <div className="space-y-3 mt-6">
              {currentQ.options.map((opt) => {
                const isSelected = currentState.selectedOptionId === opt.id;
                const primaryText = isEnglish && opt.textEn ? opt.textEn : opt.textTe;
                const secondaryText = isEnglish ? opt.textTe : opt.textEn;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 touch-target select-none ${
                      isSelected
                        ? "bg-[#E8F4F0] border-[#176B5B] text-[#104E43] font-semibold"
                        : "bg-white border-[#E5EAE5] text-[#17211E] hover:border-[#176B5B]/40 hover:bg-[#F5F6F2]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#176B5B] text-white"
                          : "bg-[#F5F6F2] text-[#17211E]"
                      }`}
                    >
                      {opt.id}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base">{primaryText}</div>
                      {secondaryText && (
                        <div className="text-xs text-[#65716D] mt-0.5">
                          {secondaryText}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="mt-8 pt-6 border-t border-[#E5EAE5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMarkReview}
                className="flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4 text-[#A66A19]" />
                <span>{t("mark_for_review_btn")}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearResponse}
                disabled={!currentState.selectedOptionId}
                className="text-[#65716D]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>{t("clear_response_btn")}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>{t("previous_question")}</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                disabled={currentIndex === session.questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                <span>{t("next_question")}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: OMR-Style Question Palette */}
        <aside className="w-full lg:w-80 bg-white border border-[#E5EAE5] rounded-3xl p-5 shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-[#17211E] mb-3">
            {t("question_palette_title")}
          </h3>

          {/* Status Legends */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#65716D] mb-4 pb-4 border-b border-[#E5EAE5]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#1B8354] text-white flex items-center justify-center font-bold text-[10px]">
                {stateCounts["answered"] || 0}
              </span>
              <span>{t("status_answered")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#B33D44] text-white flex items-center justify-center font-bold text-[10px]">
                {stateCounts["unanswered"] || 0}
              </span>
              <span>{t("status_unanswered")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#356EA0] text-white flex items-center justify-center font-bold text-[10px]">
                {stateCounts["marked_for_review"] || 0}
              </span>
              <span>{t("status_marked")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#F5F6F2] text-[#65716D] border border-[#E5EAE5] flex items-center justify-center font-bold text-[10px]">
                {stateCounts["not_visited"] || 0}
              </span>
              <span>{t("status_not_visited")}</span>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="flex-1 overflow-y-auto max-h-[350px] grid grid-cols-5 gap-2 pr-1">
            {session.questions.map((q, idx) => {
              const state = session.questionStates[q.id];
              const isSelectedQ = idx === currentIndex;
              let bg = "bg-[#F5F6F2] text-[#17211E] border-[#E5EAE5]";

              if (state?.status === "answered") {
                bg = "bg-[#1B8354] text-white border-[#1B8354]";
              } else if (state?.status === "unanswered") {
                bg = "bg-[#B33D44] text-white border-[#B33D44]";
              } else if (state?.status === "marked_for_review") {
                bg = "bg-[#356EA0] text-white border-[#356EA0]";
              } else if (state?.status === "answered_and_marked") {
                bg = "bg-[#356EA0] text-white border-[#1B8354] ring-2 ring-[#1B8354]";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl font-bold text-xs border flex items-center justify-center transition-all touch-target select-none ${bg} ${
                    isSelectedQ ? "scale-105 shadow-md font-extrabold ring-2 ring-[#176B5B]" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Button in Palette */}
          <div className="mt-4 pt-4 border-t border-[#E5EAE5]">
            <Button
              variant="primary"
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-[#1B8354] hover:bg-[#156E46]"
            >
              {t("finish_exam_btn")}
            </Button>
          </div>
        </aside>
      </div>

      {/* Final Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5EAE5]">
            <h3 className="text-xl font-extrabold text-[#17211E] mb-2">
              {t("confirm_submit_title")}
            </h3>
            <p className="text-xs sm:text-sm text-[#65716D] mb-4 leading-relaxed">
              {t("confirm_submit_desc")}
            </p>

            <div className="p-4 bg-[#F5F6F2] rounded-2xl mb-6 space-y-1.5 text-xs text-[#17211E]">
              <div>
                {t("status_answered")}: <strong>{stateCounts["answered"] || 0}</strong>
              </div>
              <div>
                {t("status_unanswered")}: <strong>{stateCounts["unanswered"] || 0}</strong>
              </div>
              <div>
                {t("status_marked")}: <strong>{stateCounts["marked_for_review"] || 0}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(false)}
              >
                {t("resume_exam_btn")}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleFinalSubmit(false)}
                className="bg-[#1B8354] hover:bg-[#156E46]"
              >
                {t("confirm_submit_action")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
