"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Award,
  AlertTriangle,
  Settings,
  Shield,
  User,
  Menu,
  X,
  Type,
  FileText,
  Globe,
  LogOut,
} from "lucide-react";
import { usePreferences } from "./TextSizeProvider";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "../ui/Badge";
import { logoutAction } from "@/lib/auth/actions";

interface HeaderProps {
  currentRole?: "student" | "admin";
  userName?: string;
  onRoleToggle?: () => void;
}

export function Header({
  currentRole = "student",
  userName = "రమ్య",
  onRoleToggle,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { textSize, setTextSize, language, setLanguage } = usePreferences();
  const { t, isEnglish } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cycleTextSize = () => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("extra-large");
    else setTextSize("normal");
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
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur border-b border-[#E5EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Official Badge */}
          <div className="flex items-center gap-3">
            <Link href={currentRole === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#176B5B] flex items-center justify-center text-white shadow-sm font-bold text-lg">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#17211E] text-lg leading-tight tracking-tight">
                  MISSION MPSO
                </span>
                <span className="text-[11px] text-[#65716D] font-medium flex items-center gap-1.5">
                  <span>{t("notification_label")}</span>
                  <span className="w-1 h-1 rounded-full bg-[#176B5B]"></span>
                  <span className="text-[#176B5B]">{t("exam_tentative_month")}</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href="/tutor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/tutor"
                  ? "bg-[#E8F4F0] text-[#176B5B]"
                  : "text-[#17211E] hover:bg-[#F5F6F2]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#176B5B]" />
              <span>{t("nav_tutor")}</span>
            </Link>

            <Link
              href="/mocks"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname.startsWith("/mocks")
                  ? "bg-[#E8F4F0] text-[#176B5B]"
                  : "text-[#17211E] hover:bg-[#F5F6F2]"
              }`}
            >
              <Award className="w-4 h-4 text-[#356EA0]" />
              <span>{t("nav_mocks")}</span>
            </Link>

            <Link
              href="/mistakes"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/mistakes"
                  ? "bg-[#E8F4F0] text-[#176B5B]"
                  : "text-[#17211E] hover:bg-[#F5F6F2]"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-[#A66A19]" />
              <span>{t("nav_mistakes")}</span>
            </Link>

            <div className="h-5 w-px bg-[#E5EAE5]" />

            {/* Font Size Adjuster */}
            <button
              onClick={cycleTextSize}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E5EAE5] bg-[#F5F6F2] hover:bg-[#E5EAE5] text-xs font-semibold text-[#17211E] touch-target"
              title={t("font_size_tooltip")}
            >
              <Type className="w-3.5 h-3.5 text-[#176B5B]" />
              <span>
                {textSize === "normal" ? "A" : textSize === "large" ? "A+" : "A++"}
              </span>
            </button>

            {/* Segmented Language Selector (Interactive & Clear) */}
            <div
              className="flex items-center rounded-xl bg-[#F5F6F2] p-0.5 border border-[#E5EAE5]"
              title={t("language_toggle_tooltip")}
            >
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all touch-target ${
                  language === "te"
                    ? "bg-[#176B5B] text-white shadow-xs"
                    : "text-[#65716D] hover:text-[#17211E]"
                }`}
                aria-pressed={language === "te"}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all touch-target ${
                  language === "en"
                    ? "bg-[#176B5B] text-white shadow-xs"
                    : "text-[#65716D] hover:text-[#17211E]"
                }`}
                aria-pressed={language === "en"}
              >
                English
              </button>
            </div>

            {/* Role Switcher Pill */}
            {onRoleToggle && (
              <button
                onClick={onRoleToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F4F0] border border-[#BFE2D7] text-xs font-semibold text-[#176B5B] hover:bg-[#D5ECE5] touch-target"
                title="Switch role"
              >
                {currentRole === "admin" ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>{t("role_admin")}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>{userName} ({t("role_student")})</span>
                  </>
                )}
              </button>
            )}

            {/* Desktop Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5EAE5] bg-white text-[#B33D44] hover:bg-[#FDF2F2] hover:border-[#F9D6D8] text-xs font-bold transition-colors touch-target shadow-xs"
              title={t("logout")}
              aria-label={t("logout")}
            >
              <LogOut className="w-3.5 h-3.5 text-[#B33D44]" />
              <span>{t("logout")}</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Toggle */}
            <div className="flex items-center rounded-lg bg-[#F5F6F2] p-0.5 border border-[#E5EAE5]">
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  language === "te"
                    ? "bg-[#176B5B] text-white"
                    : "text-[#65716D]"
                }`}
              >
                తె
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  language === "en"
                    ? "bg-[#176B5B] text-white"
                    : "text-[#65716D]"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={cycleTextSize}
              className="p-2 rounded-lg border border-[#E5EAE5] bg-[#F5F6F2] text-xs font-bold text-[#17211E] touch-target"
              aria-label="Text Size"
            >
              <Type className="w-4 h-4 text-[#176B5B]" />
            </button>

            {/* Mobile Quick Logout Icon */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg border border-[#E5EAE5] bg-white text-[#B33D44] hover:bg-[#FDF2F2] touch-target"
              title={t("logout")}
              aria-label={t("logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#E5EAE5] bg-white text-[#17211E] touch-target"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EAE5] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE5]">
            <span className="text-sm font-medium text-[#65716D]">
              {userName} ({currentRole === "admin" ? t("role_admin") : t("role_student")})
            </span>
            {onRoleToggle && (
              <button
                onClick={onRoleToggle}
                className="text-xs px-2.5 py-1 rounded-md bg-[#E8F4F0] text-[#176B5B] font-semibold"
              >
                {currentRole === "admin" ? t("switch_to_student") : t("switch_to_admin")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/tutor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <Sparkles className="w-4 h-4 text-[#176B5B]" />
              <span>{t("nav_tutor")}</span>
            </Link>

            <Link
              href="/mocks"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <Award className="w-4 h-4 text-[#356EA0]" />
              <span>{t("nav_mocks")}</span>
            </Link>

            <Link
              href="/mistakes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <AlertTriangle className="w-4 h-4 text-[#A66A19]" />
              <span>{t("nav_mistakes")}</span>
            </Link>

            <Link
              href="/study-plan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <FileText className="w-4 h-4 text-[#176B5B]" />
              <span>{t("nav_study_plan")}</span>
            </Link>

            <Link
              href="/current-affairs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <BookOpen className="w-4 h-4 text-[#356EA0]" />
              <span>{t("nav_current_affairs")}</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <Settings className="w-4 h-4 text-[#65716D]" />
              <span>{t("nav_settings")}</span>
            </Link>
          </div>

          {/* Prominent Mobile Logout Action */}
          <div className="pt-2 border-t border-[#E5EAE5]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-[#F9D6D8] bg-[#FDF2F2] text-sm font-bold text-[#B33D44] hover:bg-[#FBE8E9] transition-colors touch-target"
            >
              <LogOut className="w-4 h-4 text-[#B33D44]" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
