"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, CheckCircle2, User, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DiagnosticAssessment } from "@/components/practice/DiagnosticAssessment";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"preferences" | "diagnostic">("preferences");

  // State
  const [displayName, setDisplayName] = useState("భాగ్య");
  const [educationBackground, setEducationBackground] = useState("B.Sc. (Statistics)");
  const [statisticsFamiliarity, setStatisticsFamiliarity] = useState<"beginner" | "intermediate" | "comfortable">("intermediate");
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [studyWindow, setStudyWindow] = useState<"morning" | "afternoon" | "evening" | "flexible">("morning");
  const [enableVoice, setEnableVoice] = useState(true);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem("mission_mpso_student_name", displayName);
      localStorage.setItem("mission_mpso_daily_minutes", dailyMinutes.toString());
    } catch {}
    setStep("diagnostic");
  };

  const handleCompleteDiagnostic = (results: any) => {
    try {
      localStorage.setItem("mission_mpso_diagnostic_completed", "true");
    } catch {}
    router.push("/dashboard");
  };

  if (step === "diagnostic") {
    return <DiagnosticAssessment onCompleteDiagnostic={handleCompleteDiagnostic} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 sm:py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F4F0] text-[#176B5B] mx-auto flex items-center justify-center font-bold text-xl mb-3">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-1">
            స్వాగతం! (Welcome)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D]">
            మీ కోసం వ్యక్తిగతీకరించిన అభ్యాస ప్రణాళికను సిద్ధం చేయడానికి కొన్ని ప్రాథమిక వివరాలు తెలపండి.
          </p>
        </div>

        <div className="space-y-5">
          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              మీ పేరు / మిమ్మల్ని ఎలా పిలవాలి?
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ఉదా: భాగ్య"
              className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-3 text-sm text-[#17211E] focus:outline-none focus:ring-2 focus:ring-[#176B5B]"
            />
          </div>

          {/* 2. Education */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              మీ విద్యా నేపథ్యం (Educational Background)
            </label>
            <select
              value={educationBackground}
              onChange={(e) => setEducationBackground(e.target.value)}
              className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-3 text-sm text-[#17211E] focus:outline-none focus:ring-2 focus:ring-[#176B5B]"
            >
              <option value="B.Sc. (Statistics)">B.Sc. (Statistics)</option>
              <option value="B.Sc. (Mathematics with Statistics)">B.Sc. (Mathematics with Statistics)</option>
              <option value="B.A. (Economics with Statistics)">B.A. (Economics with Statistics)</option>
              <option value="B.Com (with Statistics)">B.Com (with Statistics)</option>
              <option value="B.Sc. (Computer Science with Statistics)">B.Sc. (Computer Science with Statistics)</option>
              <option value="ఇతర డిగ్రీ">ఇతర డిగ్రీ</option>
            </select>
          </div>

          {/* 3. Statistics Familiarity */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              గణాంకశాస్త్రంలో (Statistics) మీ ప్రస్తుత అవగాహన
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "beginner", label: "ప్రారంభ దశ", desc: "మొదటినుండి నేర్చుకోవాలి" },
                { id: "intermediate", label: "మధ్యస్థం", desc: "కొంత అవగాహన ఉంది" },
                { id: "comfortable", label: "మంచి పట్టు", desc: "డిగ్రీలో చదివాను" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setStatisticsFamiliarity(lvl.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all touch-target select-none ${
                    statisticsFamiliarity === lvl.id
                      ? "bg-[#E8F4F0] border-[#176B5B] text-[#104E43]"
                      : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                  }`}
                >
                  <div className="font-bold text-xs mb-0.5">{lvl.label}</div>
                  <div className="text-[10px] text-[#65716D]">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Daily Study Time */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              రోజుకు మీరు కేటాయించగల చదువు సమయం
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[60, 120, 180, 240].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyMinutes(mins)}
                  className={`py-2.5 rounded-xl border font-bold text-xs transition-all touch-target select-none ${
                    dailyMinutes === mins
                      ? "bg-[#176B5B] text-white border-[#176B5B]"
                      : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                  }`}
                >
                  {mins / 60} గంటలు
                </button>
              ))}
            </div>
          </div>

          {/* 5. Preferred Window */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              మీకు అనుకూలమైన సమయం
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              {[
                { id: "morning", label: "ఉదయం" },
                { id: "afternoon", label: "మధ్యాహ్నం" },
                { id: "evening", label: "సాయంత్రం / రాత్రి" },
              ].map((win) => (
                <button
                  key={win.id}
                  type="button"
                  onClick={() => setStudyWindow(win.id as any)}
                  className={`py-2.5 rounded-xl border transition-all touch-target select-none ${
                    studyWindow === win.id
                      ? "bg-[#E8F4F0] border-[#176B5B] text-[#104E43] font-bold"
                      : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                  }`}
                >
                  {win.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Voice Learning */}
          <div className="flex items-center justify-between p-4 bg-[#F5F6F2] rounded-2xl border border-[#E5EAE5]">
            <div>
              <span className="text-xs font-bold text-[#17211E] block">
                తెలుగు వాయిస్ అభ్యాసం (Voice Learning)
              </span>
              <span className="text-[11px] text-[#65716D]">
                AI ట్యూటర్ వివరణలను తెలుగులో చదివి వినిపిస్తుంది
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableVoice}
              onChange={(e) => setEnableVoice(e.target.checked)}
              className="w-5 h-5 accent-[#176B5B] cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSavePreferences}
              className="w-full flex items-center justify-center gap-2"
            >
              <span>తర్వాతి దశ: ప్రారంభ నిర్ధారణ పరీక్ష (Diagnostic Test)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
