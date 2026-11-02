"use client";

import React, { useState, useEffect } from "react";
import { usePreferences } from "@/components/layout/TextSizeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Type, Globe, Clock, Volume2, Shield, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { logoutAction } from "@/lib/auth/actions";

export default function SettingsPage() {
  const { textSize, setTextSize, language, setLanguage } = usePreferences();
  const { t, isEnglish } = useTranslation();
  const [displayName, setDisplayName] = useState("రమ్య");
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [enableVoice, setEnableVoice] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("mission_mpso_role");
      localStorage.removeItem("mission_mpso_student_name");
    } catch {}
    await logoutAction();
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{isEnglish ? "Preferences" : "అనుకూలీకరణ (Preferences)"}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            {t("settings_title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D]">
            {t("settings_desc")}
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-[#EEF9F2] border border-[#BEE7CE] rounded-2xl text-xs sm:text-sm font-bold text-[#1B8354]">
            {t("saved_success")}
          </div>
        )}

        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              {t("student_name_label")}
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
              <span>{t("text_size_label")}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "normal", label: isEnglish ? "Normal" : "సాధారణ (Normal)" },
                { id: "large", label: isEnglish ? "Large" : "పెద్దది (Large)" },
                { id: "extra-large", label: isEnglish ? "Extra Large" : "మరింత పెద్దది (Extra Large)" },
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
              <span>{t("language_label")}</span>
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
              <span>{t("daily_study_time_label")}</span>
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
                  {mins / 60} {isEnglish ? "Hours" : "గంటలు"}
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
                  {t("voice_learning_label")}
                </span>
                <span className="text-[11px] text-[#65716D]">
                  {t("voice_learning_sub")}
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
            {t("save_settings_btn")}
          </Button>
        </div>

        {/* Account & Session (Logout) Section */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#17211E] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#176B5B]" />
            <span>{isEnglish ? "Account & Session" : "ఖాతా & సెషన్"}</span>
          </h2>
          <p className="text-xs text-[#65716D]">
            {isEnglish
              ? "Sign out of your active examination preparation session."
              : "మీ ప్రస్తుత అభ్యాస సెషన్ నుండి సురక్షితంగా లాగ్ అవుట్ అవ్వండి."}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#F9D6D8] bg-[#FDF2F2] text-[#B33D44] text-xs font-bold hover:bg-[#FBE8E9] transition-colors touch-target"
          >
            <LogOut className="w-4 h-4 text-[#B33D44]" />
            <span>{isLoggingOut ? (isEnglish ? "Logging out..." : "నిష్క్రమిస్తున్నది...") : t("logout")}</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
