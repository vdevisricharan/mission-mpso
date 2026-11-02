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
  XCircle,
  ArrowRight,
  Sparkles,
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
  onSubmitMock: (session: MockExamSession) => Promise<void> | void;
  onRetakeMock?: (sessionId: string) => Promise<void> | void;
}

export function MockSimulator({
  session: initialSession,
  onSubmitMock,
  onRetakeMock,
}: MockSimulatorProps) {
  const { t, isEnglish } = useTranslation();
  const [session, setSession] = useState<MockExamSession>(initialSession);
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex || 0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFinished, setIsFinished] = useState(session.status !== "in_progress");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleFinalSubmit = async (autoExpired: boolean = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);
    setIsFinished(true);

    const completedSession: MockExamSession = {
      ...session,
      status: autoExpired ? "auto_submitted_expired" : "submitted",
      submittedAt: new Date().toISOString(),
    };
    setSession(completedSession);
    try {
      await onSubmitMock(completedSession);
    } catch (e) {
      console.error("Failed to save mock session:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeExam = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      if (onRetakeMock) {
        await onRetakeMock(session.id);
      }
      window.location.reload();
    } catch {
      setIsResetting(false);
    }
  };

  // State Counts for Palette
  const stateCounts = Object.values(session.questionStates).reduce(
    (acc, state) => {
      acc[state.status] = (acc[state.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // If exam has been submitted, render comprehensive performance report and solutions
  if (isFinished || session.status === "submitted" || session.status === "auto_submitted_expired") {
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    session.questions.forEach((q) => {
      const st = session.questionStates[q.id];
      if (!st || !st.selectedOptionId) {
        unattemptedCount++;
      } else if (st.selectedOptionId === q.correctOptionId) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = session.questions.length;
    const attemptedCount = correctCount + wrongCount;
    const score = correctCount;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const ocQualifies = percentage >= 40;
    const bcQualifies = percentage >= 35;
    const scStPhQualifies = percentage >= 30;

    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Header Summary Card */}
          <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F4F0] text-[#176B5B] mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider block mb-1">
              {isEnglish ? "Official TGPSC Mock Simulator" : "అధికారిక TGPSC మాక్ పరీక్ష ఫలితం"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
              {isEnglish ? session.titleEn || session.titleTe : session.titleTe}
            </h1>
            <p className="text-xs sm:text-sm text-[#65716D] max-w-xl mx-auto mb-6">
              {isEnglish
                ? "Your mock examination has been submitted and evaluated based on official 07/G/ES/2026 guidelines."
                : "మీ మాక్ పరీక్ష సమర్పించబడింది మరియు అధికారిక 07/G/ES/2026 నిబంధనల ప్రకారం మూల్యాంకనం చేయబడింది."}
            </p>

            {/* 4 Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 text-left">
              <div className="bg-[#F5F6F2] p-4 rounded-2xl border border-[#E5EAE5]">
                <span className="text-xs text-[#65716D] font-medium block mb-1">
                  {isEnglish ? "Total Score" : "సాధించిన మార్కులు"}
                </span>
                <span className="text-2xl font-extrabold text-[#17211E]">
                  {score} <span className="text-xs font-normal text-[#65716D]">/ {total}</span>
                </span>
                <span className="text-[11px] text-[#176B5B] font-semibold block mt-1">
                  {percentage}% {isEnglish ? "Score" : "శాతం"}
                </span>
              </div>

              <div className="bg-[#EEF9F2] p-4 rounded-2xl border border-[#CDEED7]">
                <span className="text-xs text-[#1B8354] font-medium block mb-1">
                  {isEnglish ? "Correct" : "సరైనవి"}
                </span>
                <span className="text-2xl font-extrabold text-[#1B8354]">
                  {correctCount}
                </span>
                <span className="text-[11px] text-[#1B8354] font-semibold block mt-1">
                  +1 {isEnglish ? "Mark each" : "మార్కు ప్రతి దానికి"}
                </span>
              </div>

              <div className="bg-[#FDF2F2] p-4 rounded-2xl border border-[#F9D6D8]">
                <span className="text-xs text-[#B33D44] font-medium block mb-1">
                  {isEnglish ? "Incorrect" : "తప్పులు"}
                </span>
                <span className="text-2xl font-extrabold text-[#B33D44]">
                  {wrongCount}
                </span>
                <span className="text-[11px] text-[#B33D44] font-semibold block mt-1">
                  0 {isEnglish ? "penalty (unconfirmed)" : "పెనాల్టీ (అన్-కన్ఫర్మ్‌డ్)"}
                </span>
              </div>

              <div className="bg-[#EDF4FA] p-4 rounded-2xl border border-[#D0E2F2]">
                <span className="text-xs text-[#356EA0] font-medium block mb-1">
                  {isEnglish ? "Skipped" : "వదిలేసినవి"}
                </span>
                <span className="text-2xl font-extrabold text-[#356EA0]">
                  {unattemptedCount}
                </span>
                <span className="text-[11px] text-[#356EA0] font-semibold block mt-1">
                  {attemptedCount}/{total} {isEnglish ? "attempted" : "ప్రయత్నించారు"}
                </span>
              </div>
            </div>

            {/* Qualifying Status Badge */}
            <div className="p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl text-left mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A66A19] mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{isEnglish ? "TGPSC Qualifying Benchmark Analysis" : "TGPSC అర్హత ప్రమాణాల విశ్లేషణ"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70">
                  <span>OC / EWS (Min 40%):</span>
                  <strong className={ocQualifies ? "text-[#1B8354]" : "text-[#B33D44]"}>
                    {ocQualifies ? (isEnglish ? "Qualified ✓" : "అర్హత సాధించారు ✓") : (isEnglish ? "Not Met ✗" : "అర్హత రాలేదు ✗")}
                  </strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70">
                  <span>BC (Min 35%):</span>
                  <strong className={bcQualifies ? "text-[#1B8354]" : "text-[#B33D44]"}>
                    {bcQualifies ? (isEnglish ? "Qualified ✓" : "అర్హత సాధించారు ✓") : (isEnglish ? "Not Met ✗" : "అర్హత రాలేదు ✗")}
                  </strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70">
                  <span>SC / ST / PH (Min 30%):</span>
                  <strong className={scStPhQualifies ? "text-[#1B8354]" : "text-[#B33D44]"}>
                    {scStPhQualifies ? (isEnglish ? "Qualified ✓" : "అర్హత సాధించారు ✓") : (isEnglish ? "Not Met ✗" : "అర్హత రాలేదు ✗")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetakeExam}
                disabled={isResetting}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#176B5B] text-white font-bold text-sm hover:bg-[#13584B] transition-colors flex items-center justify-center gap-2 touch-target shadow-sm disabled:opacity-60"
              >
                <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
                <span>
                  {isResetting
                    ? (isEnglish ? "Resetting Exam..." : "రీసెట్ అవుతోంది...")
                    : (isEnglish ? "Retake This Mock Exam" : "ఈ మాక్ పరీక్షను మళ్లీ రాయండి")}
                </span>
              </button>

              <Link
                href="/mocks"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#E5EAE5] bg-white text-[#17211E] font-semibold text-sm hover:bg-[#F5F6F2] transition-colors flex items-center justify-center gap-2 touch-target"
              >
                <span>{isEnglish ? "All Mock Tests" : "అన్ని మాక్ పరీక్షలు"}</span>
              </Link>

              <Link
                href="/mistakes"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FEF7ED] border border-[#F6DCBA] text-[#A66A19] font-bold text-sm hover:bg-[#FDEBD0] transition-colors flex items-center justify-center gap-2 touch-target"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isEnglish ? "View Mistake Book" : "తప్పుల చిట్టా"}</span>
              </Link>
            </div>
          </div>

          {/* Detailed Question Review & Solutions */}
          <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5]">
              <h2 className="text-lg font-bold text-[#17211E]">
                {isEnglish ? "Detailed Solutions & Question Analysis" : "వివరణాత్మక సమాధానాలు & విశ్లేషణ"}
              </h2>
              <span className="text-xs font-semibold text-[#65716D]">
                {total} {isEnglish ? "Questions Evaluated" : "ప్రశ్నల పరిశీలన"}
              </span>
            </div>

            <div className="space-y-6">
              {session.questions.map((q, idx) => {
                const st = session.questionStates[q.id];
                const selectedOpt = st?.selectedOptionId;
                const isCorrect = selectedOpt === q.correctOptionId;
                const isSkipped = !selectedOpt;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-[#E5EAE5] bg-[#FAFAF7] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#176B5B]">
                        {isEnglish ? `Question ${idx + 1}` : `ప్రశ్న ${idx + 1}`}
                      </span>

                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF9F2] text-[#1B8354] text-xs font-bold border border-[#CDEED7]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEnglish ? "Correct (+1)" : "సరియైనది (+1)"}</span>
                        </span>
                      )}
                      {!isCorrect && !isSkipped && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FDF2F2] text-[#B33D44] text-xs font-bold border border-[#F9D6D8]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isEnglish ? "Incorrect (0)" : "తప్పు (0)"}</span>
                        </span>
                      )}
                      {isSkipped && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5F6F2] text-[#65716D] text-xs font-bold border border-[#E5EAE5]">
                          <span>{isEnglish ? "Skipped (0)" : "వదిలేసారు (0)"}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#17211E] leading-relaxed">
                      {isEnglish && q.questionTextEn ? q.questionTextEn : q.questionTextTe}
                    </h3>
                    {isEnglish ? (
                      <p className="text-xs text-[#65716D]">{q.questionTextTe}</p>
                    ) : (
                      q.questionTextEn && (
                        <p className="text-xs text-[#65716D]">{q.questionTextEn}</p>
                      )
                    )}

                    {q.questionMathLatex && (
                      <MathBlock math={q.questionMathLatex} />
                    )}

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {q.options.map((opt) => {
                        const isChosen = selectedOpt === opt.id;
                        const isAnswer = opt.id === q.correctOptionId;

                        let optBg = "bg-white border-[#E5EAE5] text-[#17211E]";
                        if (isAnswer) {
                          optBg = "bg-[#EEF9F2] border-[#1B8354] text-[#104E43] font-bold";
                        } else if (isChosen && !isAnswer) {
                          optBg = "bg-[#FDF2F2] border-[#B33D44] text-[#B33D44]";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${optBg}`}
                          >
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 bg-black/5">
                              {opt.id}
                            </span>
                            <span className="flex-1">
                              {isEnglish && opt.textEn ? opt.textEn : opt.textTe}
                              {isEnglish && opt.textTe && (
                                <span className="text-[11px] text-[#65716D] block font-normal">
                                  {opt.textTe}
                                </span>
                              )}
                              {!isEnglish && opt.textEn && (
                                <span className="text-[11px] text-[#65716D] block font-normal">
                                  {opt.textEn}
                                </span>
                              )}
                            </span>
                            {isAnswer && (
                              <span className="text-[11px] text-[#1B8354] font-bold shrink-0">
                                {isEnglish ? "Correct Answer ✓" : "సరైన సమాధానం ✓"}
                              </span>
                            )}
                            {isChosen && !isAnswer && (
                              <span className="text-[11px] text-[#B33D44] font-bold shrink-0">
                                {isEnglish ? "Your Answer ✗" : "మీ సమాధానం ✗"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3.5 rounded-xl bg-[#E8F4F0] border border-[#BFE2D7] text-xs text-[#104E43] leading-relaxed mt-2">
                      <strong>{isEnglish ? "Official Syllabus Explanation:" : "అధికారిక వివరణ:"} </strong>
                      {isEnglish && q.explanationEn ? q.explanationEn : q.explanationTe}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Top Banner with Exam Info & Server Countdown */}
      <header className="bg-white border-b border-[#E5EAE5] px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#176B5B] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              M
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-[#17211E] truncate">
                {isEnglish ? session.titleEn || session.titleTe : session.titleTe}
              </h1>
              <span className="text-[10px] sm:text-[11px] text-[#65716D] block truncate">
                {isEnglish
                  ? `07/G/ES/2026 • ${session.totalQuestions} Questions • ${session.totalDurationMinutes} Mins`
                  : `07/G/ES/2026 • ${session.totalQuestions} ప్రశ్నలు • ${session.totalDurationMinutes} నిమిషాలు`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Warning indicator for unconfirmed negative marking */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FEF7ED] border border-[#F6DCBA] text-[11px] font-semibold text-[#A66A19]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t("negative_marking_warning")}</span>
            </div>

            {/* Authoritative Timer */}
            <div
              role="timer"
              aria-label={isEnglish ? `Remaining exam time: ${formatTime(secondsRemaining)}` : `మిగిలి ఉన్న పరీక్ష సమయం: ${formatTime(secondsRemaining)}`}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#17211E] text-white font-mono text-sm sm:text-base font-bold"
            >
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

              const statusAria =
                state?.status === "answered"
                  ? isEnglish ? "Answered" : "సమాధానం ఇచ్చినది"
                  : state?.status === "unanswered"
                  ? isEnglish ? "Not Answered" : "సమాధానం ఇవ్వనిది"
                  : state?.status === "marked_for_review"
                  ? isEnglish ? "Marked for Review" : "రివ్యూ కొరకు మార్క్ చేయబడినది"
                  : state?.status === "answered_and_marked"
                  ? isEnglish ? "Answered & Marked for Review" : "సమాధానం ఇచ్చి రివ్యూ కొరకు మార్క్ చేయబడినది"
                  : isEnglish ? "Not Visited" : "చూడని ప్రశ్న";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`${isEnglish ? "Question" : "ప్రశ్న"} ${idx + 1}: ${statusAria}`}
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
                disabled={isSubmitting}
                className="bg-[#1B8354] hover:bg-[#156E46]"
              >
                {isSubmitting
                  ? (isEnglish ? "Submitting..." : "సమర్పిస్తున్నాము...")
                  : t("confirm_submit_action")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
