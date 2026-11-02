"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Calendar,
} from "lucide-react";
import { DailyStudyPlan, DailyStudyTask } from "@/types/mastery";
import { OfficialExamConfig } from "@/types/exam";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useTranslation } from "@/lib/i18n";

interface StudentDashboardProps {
  displayName?: string;
  examConfig: OfficialExamConfig;
  studyPlan: DailyStudyPlan;
  mistakesCount?: number;
  dueRevisionsCount?: number;
}

export function StudentDashboard({
  displayName = "భాగ్య",
  examConfig,
  studyPlan,
  mistakesCount = 3,
  dueRevisionsCount = 2,
}: StudentDashboardProps) {
  const { t, pick, isEnglish } = useTranslation();
  const [tasks, setTasks] = useState<DailyStudyTask[]>(studyPlan.tasks);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* 1. Warm Greeting & Daily Affirmation */}
      <section className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4F0] text-[#176B5B] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnglish ? "MISSION MPSO 2026-27" : "మిషన్ MPSO 2026-27"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
              {isEnglish ? `Good day, ${displayName}!` : `శుభోదయం, ${displayName} గారూ!`}
            </h1>
            <p className="text-sm sm:text-base text-[#65716D] max-w-xl">
              {isEnglish
                ? '"Let us make progress today." Your personalized daily study plan is ready.'
                : '"ఈరోజు మనం కొంచెం ముందుకు వెళ్దాం." మీ లక్ష్యం కోసం రూపొందించిన నేటి చదువు ప్రణాళిక సిద్ధంగా ఉంది.'}
            </p>
          </div>

          <Link
            href="/tutor"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#176B5B] text-white font-bold text-sm shadow-sm hover:bg-[#13584B] transition-all touch-target"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("ask_ai_tutor")}</span>
          </Link>
        </div>
      </section>

      {/* 2. Official Exam Reminder Card */}
      <div className="bg-[#104E43] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-[#BFE2D7] uppercase tracking-wider mb-1">
              <span>{isEnglish ? `Official Notification ${examConfig.notificationNumber}` : `అధికారిక నోటిఫికేషన్ ${examConfig.notificationNumber}`}</span>
              <span className="hidden sm:inline">•</span>
              <span>{isEnglish ? "Telangana Public Service Commission (TGPSC)" : "తెలంగాణ పబ్లిక్ సర్వీస్ కమిషన్ (TGPSC)"}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              {isEnglish ? "Mandal Planning & Statistical Officers (MPSO / ASO)" : "మండల్ ప్లానింగ్ & స్టాటిస్టికల్ ఆఫీసర్స్ (MPSO / ASO)"}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#E8F4F0]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#BFE2D7] shrink-0" />
                <span>
                  {isEnglish ? "Exam Timeline: " : "పరీక్ష సమయం: "}
                  <strong>{examConfig.tentativeExamMonth} {isEnglish ? "(Tentative)" : "(తాత్కాలికం)"}</strong>
                </span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                {isEnglish
                  ? "Total Questions: 300 (Paper I: 150 + Paper II: 150)"
                  : "మొత్తం ప్రశ్నలు: 300 (పేపర్ I: 150 + పేపర్ II: 150)"}
              </span>
            </div>
          </div>

          <Link
            href="/mocks"
            className="px-4 py-2.5 rounded-xl bg-white text-[#104E43] font-bold text-xs sm:text-sm hover:bg-[#E8F4F0] transition-colors whitespace-nowrap shadow-xs touch-target"
          >
            {t("take_mock_test")}
          </Link>
        </div>
      </div>

      {/* 3. Four Quick Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#65716D]">{t("metric_target_time")}</span>
            <Clock className="w-4 h-4 text-[#176B5B]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#17211E]">
            {studyPlan.totalTargetMinutes} <span className="text-xs font-normal text-[#65716D]">{t("minutes_unit")}</span>
          </div>
          <div className="text-[11px] text-[#176B5B] mt-1 font-medium">{t("daily_consistency")}</div>
        </div>

        <div className="bg-white border border-[#E5EAE5] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#65716D]">{t("metric_completed_tasks")}</span>
            <CheckCircle2 className="w-4 h-4 text-[#1B8354]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#17211E]">
            {completedCount} / {tasks.length}
          </div>
          <div className="text-[11px] text-[#1B8354] mt-1 font-medium">{progressPercent}% {t("completed_percent")}</div>
        </div>

        <Link
          href="/mistakes"
          className="bg-white border border-[#E5EAE5] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#A66A19]/50 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#65716D]">{t("metric_mistake_book")}</span>
            <AlertTriangle className="w-4 h-4 text-[#A66A19]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#17211E]">
            {mistakesCount} <span className="text-xs font-normal text-[#65716D]">{t("questions_unit")}</span>
          </div>
          <div className="text-[11px] text-[#A66A19] mt-1 font-medium">{t("click_to_review")}</div>
        </Link>

        <Link
          href="/revision"
          className="bg-white border border-[#E5EAE5] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#356EA0]/50 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#65716D]">{t("metric_today_revision")}</span>
            <RotateCcw className="w-4 h-4 text-[#356EA0]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#17211E]">
            {dueRevisionsCount} <span className="text-xs font-normal text-[#65716D]">{t("items_unit")}</span>
          </div>
          <div className="text-[11px] text-[#356EA0] mt-1 font-medium">{t("spaced_repetition_queue")}</div>
        </Link>
      </div>

      {/* 4. Today's Personalized Study Tasks */}
      <section className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAE5]">
          <div>
            <h3 className="text-lg font-bold text-[#17211E]">
              {t("today_plan_title")}
            </h3>
            <p className="text-xs text-[#65716D]">
              {t("today_plan_sub")}
            </p>
          </div>
          <span className="text-xs font-bold text-[#176B5B] bg-[#E8F4F0] px-3 py-1 rounded-lg">
            {completedCount} / {tasks.length} {t("tasks_completed_count")}
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.isCompleted
                  ? "bg-[#F5F6F2] border-[#E5EAE5] opacity-75"
                  : "bg-white border-[#E5EAE5] hover:border-[#176B5B]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center transition-colors touch-target ${
                    task.isCompleted
                      ? "bg-[#176B5B] border-[#176B5B] text-white"
                      : "border-[#CBD5CB] bg-white hover:border-[#176B5B]"
                  }`}
                  aria-label="Mark task completed"
                >
                  {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <h4
                    className={`text-sm sm:text-base font-bold ${
                      task.isCompleted ? "line-through text-[#65716D]" : "text-[#17211E]"
                    }`}
                  >
                    {pick(task, "title")}
                  </h4>
                  <p className="text-xs text-[#65716D] mt-0.5">
                    {pick(task, "reason")} • <span className="font-semibold text-[#176B5B]">~{task.durationMinutes} {t("minutes_unit")}</span>
                  </p>
                </div>
              </div>

              <Link
                href={task.actionUrl}
                className="self-end sm:self-center px-4 py-2 rounded-xl bg-[#E8F4F0] text-[#176B5B] hover:bg-[#D5ECE5] text-xs font-bold flex items-center gap-1.5 touch-target whitespace-nowrap"
              >
                <span>{t("start_task")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/learn"
          className="bg-white border border-[#E5EAE5] rounded-2xl p-5 hover:border-[#176B5B]/50 transition-all shadow-xs flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E8F4F0] text-[#176B5B] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#17211E]">{t("official_syllabus_card")}</h4>
            <span className="text-xs text-[#65716D]">{t("official_syllabus_desc")}</span>
          </div>
        </Link>

        <Link
          href="/practice"
          className="bg-white border border-[#E5EAE5] rounded-2xl p-5 hover:border-[#176B5B]/50 transition-all shadow-xs flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EEF9F2] text-[#1B8354] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#17211E]">{t("topic_practice_card")}</h4>
            <span className="text-xs text-[#65716D]">{t("topic_practice_desc")}</span>
          </div>
        </Link>

        <Link
          href="/progress"
          className="bg-white border border-[#E5EAE5] rounded-2xl p-5 hover:border-[#176B5B]/50 transition-all shadow-xs flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EDF4FA] text-[#356EA0] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#17211E]">{t("progress_report_card")}</h4>
            <span className="text-xs text-[#65716D]">{t("progress_report_desc")}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
