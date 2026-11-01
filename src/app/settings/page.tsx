"use client";

import React, { useState, useEffect } from "react";
import { usePreferences } from "@/components/layout/TextSizeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Type, Globe, Clock, Volume2, Shield } from "lucide-react";

export default function SettingsPage() {
  const { textSize, setTextSize, language, setLanguage } = usePreferences();
  const [displayName, setDisplayName] = useState("రమ్య");
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [enableVoice, setEnableVoice] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem("mission_mpso_student_name");
      if (savedName) setDisplayName(savedName);
      const savedMins = localStorage.getItem("mission_mpso_daily_minutes");
      if (savedMins) setDailyMinutes(parseInt(savedMins, 10));
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("mission_mpso_student_name", displayName);
      localStorage.setItem("mission_mpso_daily_minutes", dailyMinutes.toString());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {}
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">అనుకూలీకరణ (Preferences)</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            సెట్టింగ్‌లు (Settings)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D]">
            మీ అభ్యాస అనుభవాన్ని, ఫాంట్ పరిమాణాన్ని మరియు రోజువారీ సమయాన్ని మీ సౌలభ్యానికి తగినట్లు మార్చుకోండి.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-[#EEF9F2] border border-[#BEE7CE] rounded-2xl text-xs sm:text-sm font-bold text-[#1B8354]">
            ✓ సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి!
          </div>
        )}

        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              విద్యార్థిని పేరు (Display Name)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E]"
            />
          </div>

          {/* Text Size */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#176B5B]" />
              <span>అక్షరాల పరిమాణం (Text Size)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "normal", label: "సాధారణ (Normal)" },
                { id: "large", label: "పెద్దది (Large)" },
                { id: "extra-large", label: "మరింత పెద్దది (Extra Large)" },
              ].map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setTextSize(sz.id as any)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all touch-target ${
                    textSize === sz.id
                      ? "bg-[#176B5B] text-white border-[#176B5B]"
                      : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#176B5B]" />
              <span>ప్రాథమిక భాష (Language)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage("te")}
                className={`py-3 rounded-xl border text-xs font-bold transition-all touch-target ${
                  language === "te"
                    ? "bg-[#176B5B] text-white border-[#176B5B]"
                    : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                }`}
              >
                తెలుగు (Default)
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`py-3 rounded-xl border text-xs font-bold transition-all touch-target ${
                  language === "en"
                    ? "bg-[#176B5B] text-white border-[#176B5B]"
                    : "bg-[#F5F6F2] border-[#E5EAE5] text-[#17211E]"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Daily Study Minutes */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#176B5B]" />
              <span>రోజువారీ చదువు సమయం</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[60, 120, 180, 240].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDailyMinutes(mins)}
                  className={`py-2.5 rounded-xl border font-bold text-xs transition-all touch-target ${
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

          {/* Voice Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#F5F6F2] rounded-2xl border border-[#E5EAE5]">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#176B5B]" />
              <div>
                <span className="text-xs font-bold text-[#17211E] block">
                  తెలుగు వాయిస్ ట్యూటర్ (Voice Learning)
                </span>
                <span className="text-[11px] text-[#65716D]">
                  వివరణలను తెలుగులో చదివి వినిపిస్తుంది
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableVoice}
              onChange={(e) => setEnableVoice(e.target.checked)}
              className="w-5 h-5 accent-[#176B5B] cursor-pointer"
            />
          </div>

          <Button variant="primary" onClick={handleSave} className="w-full">
            సెట్టింగ్‌లను భద్రపరచండి (Save)
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
