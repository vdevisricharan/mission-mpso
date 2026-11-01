import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { RotateCcw, CheckCircle2, Clock, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MathBlock } from "@/components/math/MathBlock";

export default async function RevisionPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";
  const dueItems = db.getDueRevisionItems(userId);

  // Fallback to core formulas for quick revision if queue is empty
  const lessons = db.getLessons();
  const formulas = lessons.flatMap((l) => l.formulas || []);

  return (
    <AppShell initialRole={user?.role || "student"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <Badge variant="primary" className="mb-2">
            స్పేస్డ్ రిపీటీషన్ సిస్టమ్ (Spaced Repetition)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-2">
            నేటి పునశ్చరణ (Today's Revision Queue)
          </h1>
          <p className="text-xs sm:text-sm text-[#65716D] max-w-2xl leading-relaxed">
            సైంటిఫిక్ స్పేస్డ్ రిపీటీషన్ అల్గారిథమ్ (1, 3, 7, 14, 30 రోజుల వ్యవధులు) ద్వారా మతిమరుపును అరికట్టి పరీక్ష వరకు దీర్ఘకాలిక జ్ఞాపకశక్తిని పెంపొందిస్తుంది.
          </p>
        </div>

        {/* Quick Formula Flashcards */}
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
            <h2 className="text-base sm:text-lg font-bold text-[#17211E]">
              కీలక సూత్రాల ఫ్లాష్‌కార్డులు (Quick Formulas)
            </h2>
            <Badge variant="info">త్వరిత రీకాల్</Badge>
          </div>

          <div className="grid gap-4">
            {formulas.slice(0, 4).map((form) => (
              <div
                key={form.id}
                className="p-5 rounded-2xl bg-[#F5F6F2] border border-[#E5EAE5] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#17211E]">{form.nameTe}</h3>
                  <span className="text-xs text-[#65716D]">{form.nameEn}</span>
                </div>
                <MathBlock math={form.latex} />
                <p className="text-xs text-[#65716D]">
                  <strong>వినియోగం:</strong> {form.usageTe}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Link to Practice */}
        <div className="text-center pt-4">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#176B5B] text-white font-bold text-sm hover:bg-[#13584B] shadow-xs touch-target"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ఈ సూత్రాలపై ప్రాక్టీస్ క్విజ్ ప్రారంభించండి</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
