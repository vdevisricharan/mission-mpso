import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MasteryEngine } from "@/lib/adaptive/mastery-engine";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Calendar, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudyPlanPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const plan = MasteryEngine.getOrCreateDailyPlan(userId);
  const exam = db.getExamConfig();

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">అనుకూల ప్రణాళిక (Adaptive Planner)</Badge>
            <Badge variant="neutral">లక్ష్యం: జనవరి 2027</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            వ్యక్తిగత చదువు ప్రణాళిక (Study Plan)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            మీకు అందుబాటులో ఉన్న రోజువారీ {plan.totalTargetMinutes} నిమిషాల ఆధారంగా మరియు బలహీన అంశాలకు ప్రాధాన్యతనిస్తూ రూపొందించబడిన నిరంతర ప్రణాళిక.
          </p>

          <div className="mt-4 p-4 bg-[#E8F4F0] border border-[#BFE2D7] rounded-2xl text-xs sm:text-sm text-[#104E43]">
            {plan.dayGreetingTe} {plan.summaryMessageTe}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
            నేటి కార్యాచరణ అంశాలు (Today's Scheduled Tasks)
          </h2>

          <div className="space-y-3">
            {plan.tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#176B5B]">
                      {task.taskType === "learn_statistics"
                        ? "పేపర్ II: స్టాటిస్టిక్స్"
                        : task.taskType === "learn_general_studies"
                        ? "పేపర్ I: జనరల్ స్టడీస్"
                        : task.taskType === "practice_questions"
                        ? "ప్రాక్టీస్ క్విజ్"
                        : "పునశ్చరణ"}
                    </span>
                    <span className="text-xs text-[#65716D]">•</span>
                    <span className="text-xs text-[#65716D] font-semibold">
                      ~{task.durationMinutes} నిమిషాలు
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#17211E]">{task.titleTe}</h3>
                  <p className="text-xs text-[#65716D] mt-0.5">{task.reasonTe}</p>
                </div>

                <Link
                  href={task.actionUrl}
                  className="px-4 py-2 rounded-xl bg-[#176B5B] text-white hover:bg-[#13584B] text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap touch-target shadow-xs"
                >
                  <span>ప్రారంభించండి</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Day Policy Note */}
        <div className="p-4 bg-[#FEF7ED] border border-[#F6DCBA] rounded-2xl text-xs text-[#A66A19] leading-relaxed">
          <strong>ఒత్తిడి లేని అధ్యయనం:</strong> మీరు ఏ రోజైనా చదవలేకపోతే ఆందోళన చెందకండి. సిస్టమ్ తదుపరి రోజుకు ఎలాంటి భారమైన పెండింగ్‌లు లేకుండా, అత్యంత ప్రాధాన్యత గల అంశాలను మాత్రమే సర్దుబాటు చేస్తుంది.
        </div>
      </div>
    </AppShell>
  );
}
