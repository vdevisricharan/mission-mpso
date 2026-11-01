"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { usePreferences } from "./TextSizeProvider";
import { Badge } from "../ui/Badge";

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
  const { textSize, setTextSize, language, setLanguage } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cycleTextSize = () => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("extra-large");
    else setTextSize("normal");
  };

  const toggleLanguage = () => {
    setLanguage(language === "te" ? "en" : "te");
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
                  <span>నోటిఫికేషన్ 07/G/ES/2026</span>
                  <span className="w-1 h-1 rounded-full bg-[#176B5B]"></span>
                  <span className="text-[#176B5B]">జనవరి 2027</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link
              href="/tutor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/tutor"
                  ? "bg-[#E8F4F0] text-[#176B5B]"
                  : "text-[#17211E] hover:bg-[#F5F6F2]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#176B5B]" />
              <span>AI ట్యూటర్</span>
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
              <span>మాక్ టెస్ట్‌లు</span>
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
              <span>తప్పుల పుస్తకం</span>
            </Link>

            <div className="h-5 w-px bg-[#E5EAE5]" />

            {/* Font Size Adjuster */}
            <button
              onClick={cycleTextSize}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E5EAE5] bg-[#F5F6F2] hover:bg-[#E5EAE5] text-xs font-semibold text-[#17211E] touch-target"
              title="ఫాంట్ పరిమాణం మార్చండి"
            >
              <Type className="w-3.5 h-3.5 text-[#176B5B]" />
              <span>
                {textSize === "normal" ? "A" : textSize === "large" ? "A+" : "A++"}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5EAE5] bg-[#F5F6F2] hover:bg-[#E5EAE5] text-xs font-medium text-[#17211E] touch-target"
              title="భాష మార్చండి"
            >
              {language === "te" ? "తెలుగు" : "English"}
            </button>

            {/* Role Switcher Pill */}
            {onRoleToggle && (
              <button
                onClick={onRoleToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F4F0] border border-[#BFE2D7] text-xs font-semibold text-[#176B5B] hover:bg-[#D5ECE5] touch-target"
                title="స్టూడెంట్ మరియు అడ్మిన్ పాత్రల మధ్య మారండి"
              >
                {currentRole === "admin" ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>అడ్మిన్ మోడ్</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>{userName} (స్టూడెంట్)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={cycleTextSize}
              className="p-2 rounded-lg border border-[#E5EAE5] bg-[#F5F6F2] text-xs font-bold text-[#17211E] touch-target"
              aria-label="Text Size"
            >
              <Type className="w-4 h-4 text-[#176B5B]" />
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
              లాగిన్: <strong className="text-[#17211E]">{userName}</strong> ({currentRole})
            </span>
            {onRoleToggle && (
              <button
                onClick={onRoleToggle}
                className="text-xs px-2.5 py-1 rounded-md bg-[#E8F4F0] text-[#176B5B] font-semibold"
              >
                {currentRole === "admin" ? "స్టూడెంట్‌గా మారండి" : "అడ్మిన్‌గా మారండి"}
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
              <span>AI ట్యూటర్</span>
            </Link>

            <Link
              href="/mocks"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <Award className="w-4 h-4 text-[#356EA0]" />
              <span>మాక్ టెస్ట్‌లు</span>
            </Link>

            <Link
              href="/mistakes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <AlertTriangle className="w-4 h-4 text-[#A66A19]" />
              <span>తప్పుల పుస్తకం</span>
            </Link>

            <Link
              href="/study-plan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <FileText className="w-4 h-4 text-[#176B5B]" />
              <span>చదువు ప్రణాళిక</span>
            </Link>

            <Link
              href="/current-affairs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <BookOpen className="w-4 h-4 text-[#356EA0]" />
              <span>కరెంట్ అఫైర్స్</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F6F2] text-sm font-medium text-[#17211E]"
            >
              <Settings className="w-4 h-4 text-[#65716D]" />
              <span>సెట్టింగ్‌లు</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
