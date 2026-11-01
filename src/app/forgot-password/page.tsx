import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F4F0] text-[#176B5B] mx-auto flex items-center justify-center mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#17211E] mb-2">
          పాస్‌వర్డ్ పునరుద్ధరణ (Reset Password)
        </h1>
        <p className="text-xs text-[#65716D] mb-6">
          మీ నమోదిత ఈమెయిల్ చిరునామాను నమోదు చేయండి. మేము రీసెట్ లింక్‌ను పంపుతాము.
        </p>

        <input
          type="email"
          placeholder="your.email@example.com"
          className="w-full bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-4 py-2.5 text-sm text-[#17211E] mb-4"
        />

        <Button variant="primary" className="w-full mb-4">
          రీసెట్ లింక్ పంపండి
        </Button>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B5B] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>లాగిన్ పేజీకి తిరిగి వెళ్లండి</span>
        </Link>
      </div>
    </div>
  );
}
