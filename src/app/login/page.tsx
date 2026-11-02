"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@mission-mpso.internal");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: "student" | "admin") => {
    setIsLoading(true);
    // Set localStorage preference for instantaneous client rendering
    try {
      localStorage.setItem("mission_mpso_role", role);
      localStorage.setItem(
        "mission_mpso_student_name",
        role === "admin" ? "అడ్మిన్" : "భాగ్య"
      );
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#176B5B] text-white mx-auto flex items-center justify-center font-bold text-2xl shadow-sm mb-3">
          M
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211E]">
          MISSION MPSO
        </h2>
        <p className="mt-1 text-xs text-[#65716D]">
          TGPSC నోటిఫికేషన్ 07/G/ES/2026 • AI అభ్యాస వేదిక
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#E5EAE5] rounded-3xl shadow-xs space-y-6">
          {/* Quick Demo Role Logins */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-[#65716D] uppercase tracking-wider text-center">
              త్వరిత లాగిన్ ఎంపికలు (1-Click Access)
            </span>

            <button
              onClick={() => handleLogin("student")}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl border-2 border-[#176B5B] bg-[#E8F4F0] text-[#104E43] hover:bg-[#D5ECE5] transition-all flex items-center justify-between touch-target text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#176B5B] text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">భాగ్య (విద్యార్థిని / Student)</div>
                  <div className="text-xs text-[#176B5B]">MPSO పరీక్షకు సన్నద్ధమవుతున్న అభ్యర్థి</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#176B5B]" />
            </button>

            <button
              onClick={() => handleLogin("admin")}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl border border-[#E5EAE5] bg-[#F5F6F2] text-[#17211E] hover:bg-[#E5EAE5] transition-all flex items-center justify-between touch-target text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#17211E] text-white flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">అడ్మినిస్ట్రేటర్ (Admin CMS)</div>
                  <div className="text-xs text-[#65716D]">నోటిఫికేషన్ & కంటెంట్ సమీక్షకులు</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#65716D]" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5EAE5]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#65716D]">లేదా ఈమెయిల్ ద్వారా</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin("student");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase mb-1">
                ఈమెయిల్
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase mb-1">
                పాస్‌వర్డ్
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E]"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              ప్రవేశించండి (Sign In)
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
