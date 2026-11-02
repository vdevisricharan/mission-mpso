"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();
  const { isEnglish } = useTranslation();

  const navItems = [
    {
      labelTe: "హోమ్",
      labelEn: "Home",
      href: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      labelTe: "నేర్చుకోండి",
      labelEn: "Learn",
      href: "/learn",
      icon: BookOpen,
      isActive: pathname.startsWith("/learn"),
    },
    {
      labelTe: "ప్రాక్టీస్",
      labelEn: "Practice",
      href: "/practice",
      icon: CheckCircle2,
      isActive: pathname.startsWith("/practice"),
    },
    {
      labelTe: "నా ప్రగతి",
      labelEn: "Progress",
      href: "/progress",
      icon: TrendingUp,
      isActive: pathname.startsWith("/progress"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#E5EAE5] md:hidden shadow-lg safe-bottom">
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = isEnglish ? item.labelEn : item.labelTe;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors touch-target select-none ${
                item.isActive
                  ? "text-[#176B5B] font-semibold"
                  : "text-[#65716D] hover:text-[#17211E]"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive ? "bg-[#E8F4F0]" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              </div>
              <span className="text-[11px] mt-0.5">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
