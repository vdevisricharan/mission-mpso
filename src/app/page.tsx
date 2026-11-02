import Link from "next/link";
import { Sparkles, BookOpen, Award, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { OFFICIAL_MPSO_EXAM_CONFIG } from "@/types/exam";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  const exam = db.getExamConfig();

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-[#E5EAE5] bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#176B5B] text-white flex items-center justify-center font-bold text-xs sm:text-base shadow-xs shrink-0">
              M
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-[#17211E] tracking-tight text-xs sm:text-base leading-tight whitespace-nowrap">
                MISSION MPSO
              </span>
              <span className="text-[9px] sm:text-[11px] text-[#176B5B] font-semibold leading-tight whitespace-nowrap">
                07/G/ES/2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-[#17211E] hover:text-[#176B5B] px-2 sm:px-3 py-2 rounded-xl transition-colors whitespace-nowrap min-h-[44px] flex items-center touch-target"
            >
              లాగిన్
            </Link>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-bold bg-[#176B5B] text-white px-2.5 sm:px-4 py-2 rounded-xl hover:bg-[#13584B] transition-colors shadow-xs whitespace-nowrap shrink-0 min-h-[44px] flex items-center touch-target"
            >
              <span className="hidden sm:inline">అభ్యాసం </span>ప్రారంభించండి
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#E8F4F0] border border-[#BFE2D7] text-[#176B5B] text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 max-w-full text-center leading-snug">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>తెలంగాణ MPSO / ASO పరీక్షార్థుల కోసం ప్రత్యేకంగా రూపొందించబడింది</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#17211E] mb-3 sm:mb-4 tracking-tight leading-tight max-w-3xl">
          ఒకే అభ్యర్థి. ఒకే లక్ష్యం.<br className="hidden sm:inline" />{" "}
          <span className="text-[#176B5B]">మీ విజయం కోసం ఒకే తెలివైన AI తోడు.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#65716D] mb-4 uppercase tracking-wider">
          One Student. One Mission. One Intelligent Learning Companion.
        </p>

        <p className="text-sm sm:text-base md:text-lg text-[#65716D] mb-6 sm:mb-8 max-w-2xl leading-relaxed">
          TGPSC నోటిఫికేషన్ 07/G/ES/2026 సిలబస్‌కు అనుగుణంగా, తెలుగు మాధ్యమంలో సులభంగా డిగ్రీ స్థాయి స్టాటిస్టిక్స్ మరియు జనరల్ స్టడీస్ నేర్పించే తెలుగు-మొదటి AI అభ్యాస వేదిక.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10 sm:mb-12 w-full max-w-sm sm:max-w-none sm:w-auto">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-[#176B5B] text-white font-bold text-sm sm:text-base hover:bg-[#13584B] transition-all shadow-md touch-target"
          >
            <span>ప్రారంభ నిర్ధారణ పరీక్ష రాయండి</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#E5EAE5] text-[#17211E] font-semibold text-sm sm:text-base hover:bg-[#F5F6F2] transition-all touch-target shadow-xs"
          >
            డ్యాష్‌బోర్డ్‌లోకి వెళ్లండి
          </Link>
        </div>

        {/* Official Notification Pill Card */}
        <div className="w-full max-w-2xl bg-white border border-[#E5EAE5] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs text-left mb-12 sm:mb-16">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5EAE5] mb-4">
            <span className="text-[11px] sm:text-xs font-bold text-[#176B5B] uppercase tracking-wide">
              అధికారిక నిబంధనల ఆధారం (Source of Truth)
            </span>
            <Badge variant="primary" size="sm" className="shrink-0 text-[10px] sm:text-xs">
              ధృవీకరించబడింది ✓
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div>
              <span className="text-[#65716D] block mb-0.5 text-[11px] sm:text-xs">నోటిఫికేషన్ నం.</span>
              <strong className="text-[#17211E] text-xs sm:text-sm font-bold">{exam.notificationNumber}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5 text-[11px] sm:text-xs">నోటిఫికేషన్ తేదీ</span>
              <strong className="text-[#17211E] text-xs sm:text-sm font-bold">{exam.notificationDate}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5 text-[11px] sm:text-xs">పరీక్ష షెడ్యూల్</span>
              <strong className="text-[#176B5B] text-xs sm:text-sm font-bold">{exam.tentativeExamMonth}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5 text-[11px] sm:text-xs">మొత్తం మార్కులు</span>
              <strong className="text-[#17211E] text-xs sm:text-sm font-bold">300 (రెండు పేపర్లు)</strong>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-left">
          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4F0] text-[#176B5B] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#17211E] mb-1">తెలుగు-మొదటి AI ట్యూటర్</h3>
            <p className="text-xs sm:text-sm text-[#65716D] leading-relaxed">
              7 ప్రత్యేక బోధనా పద్ధతులలో, డిగ్రీ స్థాయి స్టాటిస్టిక్స్ సూత్రాలు మరియు లెక్కలను సహజమైన తెలుగులో వివరిస్తుంది.
            </p>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF9F2] text-[#1B8354] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#17211E] mb-1">ఖచ్చితమైన గణిత ధృవీకరణ</h3>
            <p className="text-xs sm:text-sm text-[#65716D] leading-relaxed">
              స్టాటిస్టిక్స్ ప్రశ్నల సమాధానాలు డిటర్మినిస్టిక్ గణిత సూత్రాల ద్వారా ధృవీకరించబడతాయి.
            </p>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FA] text-[#356EA0] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#17211E] mb-1">స్పేస్డ్ రివిజన్ & తప్పుల పుస్తకం</h3>
            <p className="text-xs sm:text-sm text-[#65716D] leading-relaxed">
              మీరు చేసిన తప్పులు భద్రపరచబడి, మర్చిపోకుండా 1, 3, 7, 14, 30 రోజుల వ్యవధుల్లో పునశ్చరణ చేయిస్తుంది.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5EAE5] bg-white py-6 px-4 text-center text-xs text-[#65716D]">
        <p>© 2026-2027 MISSION MPSO. రూపొందించినది: TGPSC 07/G/ES/2026 పరీక్షార్థుల సాధన కొరకు.</p>
        <p className="mt-1 text-[11px]">
          ఈ వేదిక TGPSC యొక్క అధికారిక ఉత్పత్తి కాదు. అధికారిక ప్రకటనల కొరకు కమిషన్ వెబ్‌సైట్‌ను చూడండి.
        </p>
      </footer>
    </div>
  );
}
