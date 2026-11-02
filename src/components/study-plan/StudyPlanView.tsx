"use client";

import React from "react";
import Link from "next/link";
import { DailyStudyPlan } from "@/types/mastery";
import { Badge } from "../ui/Badge";
import { Calendar, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface StudyPlanViewProps {
  plan: DailyStudyPlan;
}

export function StudyPlanView({ plan }: StudyPlanViewProps) {
  const { t, pick, isEnglish } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="primary">
            {isEnglish ? "Adaptive Study Plan" : "అనుకూల ప్రణాళిక (Adaptive Planner)"}
          </Badge>
          <Badge variant="neutral">
            {isEnglish ? "Target: January 2027" : "లక్ష్యం: జనవరి 2027"}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
          {isEnglish ? "Personalized Daily Study Plan" : "వ్యక్తిగత చదువు ప్రణాళిక (Study Plan)"}
        </h1>
        <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
          {isEnglish
            ? `Calibrated according to your daily target of ${plan.totalTargetMinutes} minutes, prioritizing weaker topics for sustained preparation.`
            : `మీకు అందుబాటులో ఉన్న రోజువారీ ${plan.totalTargetMinutes} నిమిషాల ఆధారంగా మరియు బలహీన అంశాలకు ప్రాధాన్యతనిస్తూ రూపొందించబడిన నిరంతర ప్రణాళిక.`}
        </p>

        <div className="mt-4 p-4 bg-[#E8F4F0] border border-[#BFE2D7] rounded-2xl text-xs sm:text-sm text-[#104E43]">
          {isEnglish
            ? 'Good day! "Let us move forward steadily." Here are your prioritized study tasks for today.'
            : `${plan.dayGreetingTe} ${plan.summaryMessageTe}`}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
          {isEnglish ? "Today's Scheduled Tasks" : "నేటి కార్యాచరణ అంశాలు (Today's Scheduled Tasks)"}
        </h2>

        <div className="space-y-3">
          {plan.tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#176B5B]">
                    {task.taskType === "learn_statistics"
                      ? isEnglish ? "Paper II: Statistics" : "పేపర్ II: స్టాటిస్టిక్స్"
                      : task.taskType === "learn_general_studies"
                      ? isEnglish ? "Paper I: General Studies" : "పేపర్ I: జనరల్ స్టడీస్"
                      : task.taskType === "practice_questions"
                      ? isEnglish ? "Practice Quiz" : "ప్రాక్టీస్ క్విజ్"
                      : isEnglish ? "Revision" : "పునశ్చరణ"}
                  </span>
                  <span className="text-xs text-[#65716D]">•</span>
                  <span className="text-xs text-[#65716D] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#176B5B]" />
                    <span>~{task.durationMinutes} {isEnglish ? "mins" : "నిమిషాలు"}</span>
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#17211E]">
                  {pick(task, "title")}
                </h3>
                <p className="text-xs text-[#65716D] mt-0.5">
                  {pick(task, "reason")}
                </p>
              </div>

              <Link
                href={task.actionUrl}
                className="self-end sm:self-center px-4 py-2 rounded-xl bg-[#176B5B] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#13584B] transition-colors touch-target whitespace-nowrap"
              >
                <span>{isEnglish ? "Start Task" : "ప్రారంభించండి"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
