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
      <header className="border-b border-[#E5EAE5] bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#176B5B] text-white flex items-center justify-center font-bold text-base shadow-xs">
              M
            </div>
            <div>
              <span className="font-extrabold text-[#17211E] tracking-tight">MISSION MPSO</span>
              <span className="text-[11px] text-[#176B5B] block font-semibold">TGPSC 07/G/ES/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-[#17211E] hover:text-[#176B5B] px-3 py-2 rounded-xl transition-colors"
            >
              లాగిన్
            </Link>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-bold bg-[#176B5B] text-white px-4 py-2 rounded-xl hover:bg-[#13584B] transition-colors shadow-xs"
            >
              అభ్యాసం ప్రారంభించండి
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F4F0] border border-[#BFE2D7] text-[#176B5B] text-xs font-bold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>తెలంగాణ MPSO / ASO పరీక్షార్థుల కోసం ప్రత్యేకంగా రూపొందించబడింది</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#17211E] mb-6 tracking-tight leading-tight max-w-3xl">
          One Student. One Mission.<br />
          <span className="text-[#176B5B]">One Intelligent Learning Companion.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#65716D] mb-8 max-w-2xl leading-relaxed">
          TGPSC నోటిఫికేషన్ 07/G/ES/2026 సిలబస్‌కు అనుగుణంగా, తెలుగు మాధ్యమంలో సులభంగా డిగ్రీ స్థాయి స్టాటిస్టిక్స్ మరియు జనరల్ స్టడీస్ నేర్పించే తెలుగు-మొదటి AI అభ్యాస వేదిక.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#176B5B] text-white font-bold text-base hover:bg-[#13584B] transition-all shadow-md touch-target"
          >
            <span>ప్రారంభ నిర్ధారణ పరీక్ష రాయండి</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#E5EAE5] text-[#17211E] font-semibold text-base hover:bg-[#F5F6F2] transition-all touch-target"
          >
            డ్యాష్‌బోర్డ్‌లోకి వెళ్లండి
          </Link>
        </div>

        {/* Official Notification Pill Card */}
        <div className="w-full max-w-2xl bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs text-left mb-16">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5] mb-4">
            <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider">
              అధికారిక నిబంధనల ఆధారం (Source of Truth)
            </span>
            <Badge variant="primary" size="sm">
              ధృవీకరించబడింది ✓
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#65716D] block mb-0.5">నోటిఫికేషన్ నం.</span>
              <strong className="text-[#17211E]">{exam.notificationNumber}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5">నోటిఫికేషన్ తేదీ</span>
              <strong className="text-[#17211E]">{exam.notificationDate}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5">పరీక్ష షెడ్యూల్</span>
              <strong className="text-[#176B5B]">{exam.tentativeExamMonth}</strong>
            </div>
            <div>
              <span className="text-[#65716D] block mb-0.5">మొత్తం మార్కులు</span>
              <strong className="text-[#17211E]">300 (రెండు పేపర్లు)</strong>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4F0] text-[#176B5B] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#17211E] mb-1">తెలుగు-మొదటి AI ట్యూటర్</h3>
            <p className="text-xs sm:text-sm text-[#65716D] leading-relaxed">
              7 ప్రత్యేక బోధనా పద్ధతులలో, డిగ్రీ స్థాయి స్టాటిస్టిక్స్ సూత్రాలు మరియు లెక్కలను సహజమైన తెలుగులో వివరిస్తుంది.
            </p>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF9F2] text-[#1B8354] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#17211E] mb-1">ఖచ్చితమైన గణిత ధృవీకరణ</h3>
            <p className="text-xs sm:text-sm text-[#65716D] leading-relaxed">
              స్టాటిస్టిక్స్ ప్రశ్నల సమాధానాలు డిటర్మినిస్టిక్ గణిత సూత్రాల ద్వారా ధృవీకరించబడతాయి.
            </p>
          </div>

          <div className="bg-white border border-[#E5EAE5] rounded-2xl p-6 shadow-xs">
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
      <footer className="border-t border-[#E5EAE5] bg-white py-6 text-center text-xs text-[#65716D]">
        <p>© 2026-2027 MISSION MPSO. రూపొందించినది: TGPSC 07/G/ES/2026 పరీక్షార్థుల సాధన కొరకు.</p>
        <p className="mt-1 text-[11px]">
          ఈ వేదిక TGPSC యొక్క అధికారిక ఉత్పత్తి కాదు. అధికారిక ప్రకటనల కొరకు కమిషన్ వెబ్‌సైట్‌ను చూడండి.
        </p>
      </footer>
    </div>
  );
}
