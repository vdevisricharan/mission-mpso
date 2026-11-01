"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, TrendingUp, BookOpen, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { Question, QuestionOptionId } from "@/types/question";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/questions/diagnostic-data";
import { OFFICIAL_SYLLABUS_TOPICS } from "@/lib/curriculum/syllabus-data";
import { MathBlock } from "../math/MathBlock";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface DiagnosticAssessmentProps {
  onCompleteDiagnostic: (results: any) => void;
}

export function DiagnosticAssessment({ onCompleteDiagnostic }: DiagnosticAssessmentProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionOptionId>>({});
  const [isFinished, setIsFinished] = useState(false);

  const questions = DIAGNOSTIC_QUESTIONS;
  const currentQ = questions[currentIndex];
  const selectedOption = answers[currentQ?.id];

  const handleSelect = (optId: QuestionOptionId) => {
    setAnswers({ ...answers, [currentQ.id]: optId });
  };

  const handleFinish = () => {
    setIsFinished(true);

    // Calculate baseline proficiencies per topic
    const topicResults: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      if (!topicResults[q.topicId]) {
        topicResults[q.topicId] = { total: 0, correct: 0 };
      }
      topicResults[q.topicId].total += 1;
      if (answers[q.id] === q.correctOptionId) {
        topicResults[q.topicId].correct += 1;
      }
    });

    onCompleteDiagnostic({
      completedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      attemptedCount: Object.keys(answers).length,
      topicResults,
    });
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F4F0] text-[#176B5B] mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>

          <Badge variant="primary" className="mb-3">
            వ్యక్తిగతీకరించిన అభ్యాసం కొరకు
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211E] mb-3">
            MPSO ప్రారంభ నిర్ధారణ పరీక్ష (Diagnostic Test)
          </h1>

          <p className="text-sm text-[#65716D] mb-6 leading-relaxed max-w-lg mx-auto">
            ఈ పరీక్ష మీ ప్రస్తుత పరిజ్ఞానాన్ని అంచనా వేసి, మీకు సరిపోయే రోజువారీ చదువు ప్రణాళికను రూపొందించడానికి ఉద్దేశించబడింది. ఆందోళన చెందకుండా సహజంగా సమాధానాలు ఇవ్వండి.
          </p>

          <div className="bg-[#F5F6F2] rounded-2xl p-5 mb-8 text-left space-y-2 text-xs sm:text-sm text-[#17211E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
              <span>మొత్తం ప్రశ్నలు: <strong>{questions.length}</strong> (పేపర్ I మరియు పేపర్ II నుండి)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
              <span>సమయ పరిమితి లేదు — నిదానంగా ఆలోచించి సాధించండి.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
              <span>పూర్తయిన వెంటనే మీ బలాలు మరియు మెరుగుపడాల్సిన అంశాల విశ్లేషణ వస్తుంది.</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto px-8"
          >
            పరీక్ష ప్రారంభించండి
          </Button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const total = questions.length;
    const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    const accuracy = Math.round((correctCount / total) * 100);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#EEF9F2] text-[#1B8354] mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#17211E] mb-1">
              నిర్ధారణ పరీక్ష విజయవంతంగా పూర్తయింది!
            </h2>
            <p className="text-xs sm:text-sm text-[#65716D]">
              మీ ప్రారంభ సామర్థ్యం నమోదు చేయబడింది. మీ మొదటి వారపు ప్రణాళిక సిద్ధమైంది.
            </p>
          </div>

          {/* Score Tile */}
          <div className="bg-[#E8F4F0] border border-[#BFE2D7] rounded-2xl p-5 text-center mb-6">
            <span className="text-xs font-semibold text-[#176B5B] uppercase tracking-wider block mb-1">
              మొదటి విశ్లేషణ ఖచ్చితత్వం
            </span>
            <div className="text-3xl font-extrabold text-[#104E43]">
              {correctCount} / {total} ({accuracy}%)
            </div>
          </div>

          {/* Recommendations Box */}
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-bold text-[#17211E]">
              మీ కోసం మొదటి వారపు సూచనలు:
            </h3>
            <div className="p-4 bg-[#F5F6F2] rounded-xl text-xs sm:text-sm text-[#17211E] space-y-1.5">
              <p>• <strong>స్టాటిస్టిక్స్ (పేపర్ II):</strong> కేంద్రీయ ప్రవృత్తి మరియు విస్తరణ కొలతలతో ప్రారంభించండి.</p>
              <p>• <strong>జనరల్ స్టడీస్ (పేపర్ I):</strong> తెలంగాణ చరిత్ర మరియు ప్రత్యేక రాష్ట్ర ఉద్యమం అంశాలను రోజూ 30 నిమిషాలు కేటాయించండి.</p>
              <p>• రోజూ తప్పు చేసిన ప్రశ్నలను 'తప్పుల పుస్తకం'లో సమీక్షించుకోండి.</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#176B5B] text-white font-bold hover:bg-[#13584B] transition-colors touch-target"
          >
            <span>మీ వ్యక్తిగత డ్యాష్‌బోర్డ్‌కి వెళ్లండి</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4 text-xs font-bold text-[#65716D]">
        <span>నిర్ధారణ పరీక్ష • ప్రశ్న {currentIndex + 1} / {questions.length}</span>
        <span className="text-[#176B5B]">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
      </div>

      <div className="w-full bg-[#E5EAE5] h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-[#176B5B] h-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="primary" size="sm">
            {currentQ.paperId === "paper_1" ? "పేపర్ I: జనరల్ స్టడీస్" : "పేపర్ II: స్టాటిస్టిక్స్"}
          </Badge>
          <span className="text-xs text-[#65716D]">
            {currentQ.difficulty === "easy" ? "సులభం" : "మధ్యస్థం"}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#17211E] mb-2 leading-relaxed">
          {currentQ.questionTextTe}
        </h2>
        {currentQ.questionTextEn && (
          <p className="text-xs sm:text-sm text-[#65716D] mb-4">
            {currentQ.questionTextEn}
          </p>
        )}
        {currentQ.questionMathLatex && (
          <MathBlock math={currentQ.questionMathLatex} />
        )}

        {/* Options */}
        <div className="space-y-3 mt-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 touch-target select-none ${
                  isSelected
                    ? "bg-[#E8F4F0] border-[#176B5B] text-[#104E43] font-semibold"
                    : "bg-white border-[#E5EAE5] text-[#17211E] hover:bg-[#F5F6F2]"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected ? "bg-[#176B5B] text-white" : "bg-[#F5F6F2] text-[#17211E]"
                  }`}
                >
                  {opt.id}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{opt.textTe}</div>
                  {opt.textEn && (
                    <div className="text-xs text-[#65716D] mt-0.5">{opt.textEn}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          మునుపటి
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            తర్వాతి ప్రశ్న
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleFinish}
            className="bg-[#1B8354] hover:bg-[#156E46]"
          >
            నిర్ధారణ పరీక్ష ముగించండి
          </Button>
        )}
      </div>
    </div>
  );
}
