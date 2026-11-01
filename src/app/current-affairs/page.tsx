import { VERIFIED_CURRENT_AFFAIRS } from "@/lib/current-affairs/data";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Globe, ExternalLink, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const user = await getCurrentUser();
  const items = VERIFIED_CURRENT_AFFAIRS;

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <Badge variant="primary" className="mb-2">
            పేపర్ I: జనరల్ స్టడీస్
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            తెలంగాణ & జాతీయ వర్తమాన వ్యవహారాలు (Current Affairs)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            MPSO పరీక్షలో పేపర్ I లో సుమారు 15-20 మార్కులు కరెంట్ అఫైర్స్ నుండి వచ్చే అవకాశం ఉంది. అధికారిక ప్రభుత్వ నివేదికల ఆధారంగా ధృవీకరించిన వార్తా విశేషాలు.
          </p>
        </div>

        {/* Current Affairs Articles */}
        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {item.category === "telangana_policies"
                      ? "తెలంగాణ పథకాలు"
                      : item.category === "telangana_economy"
                      ? "తెలంగాణ ఆర్థిక వ్యవస్థ"
                      : "సైన్స్ & టెక్నాలజీ"}
                  </Badge>
                  <span className="text-[#65716D] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.publishedDate}</span>
                  </span>
                </div>

                <span className="text-[11px] text-[#1B8354] bg-[#EEF9F2] px-2 py-0.5 rounded-md font-semibold">
                  అధికారికంగా ధృవీకరించబడింది ✓
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#17211E] leading-snug">
                {item.titleTe}
              </h2>
              {item.titleEn && (
                <p className="text-xs font-medium text-[#65716D]">{item.titleEn}</p>
              )}

              <p className="text-sm text-[#4A5552] leading-relaxed bg-[#F5F6F2] p-4 rounded-2xl border border-[#E5EAE5]">
                {item.summaryTe}
              </p>

              {/* Bullet Points */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#17211E] block">
                  ముఖ్య పరీక్షా ముఖ్యాంశాలు (Key Exam Takeaways):
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A5552]">
                  {item.bulletPointsTe.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] mt-2 shrink-0" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source & Tags */}
              <div className="pt-4 border-t border-[#E5EAE5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#65716D]">
                <span className="flex items-center gap-1">
                  <span>మూలం: <strong>{item.sourceOrganization}</strong></span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-[#F5F6F2] text-[#65716D] px-2 py-0.5 rounded-md text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
