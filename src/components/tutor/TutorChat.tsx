"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ChatMessage, TutorLearningMode, TUTOR_MODES } from "@/types/tutor";
import { SyllabusTopic } from "@/types/curriculum";
import { TeluguAITutorEngine } from "@/lib/ai/tutor-engine";
import { MathBlock, MathInline } from "../math/MathBlock";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TutorChatProps {
  initialTopicId?: string;
  topics: SyllabusTopic[];
}

export function TutorChat({ initialTopicId, topics }: TutorChatProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || topics[0]?.id || "p2_central_tendency_dispersion"
  );
  const [selectedMode, setSelectedMode] = useState<TutorLearningMode>("teach_me");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "tutor",
      contentTe: `నమస్కారం రమ్య గారూ! నేను మీ **మిషన్ MPSO (07/G/ES/2026)** కృత్రిమ మేధా అభ్యాస సహాయకుడిని.\n\nడిగ్రీ స్టాటిస్టిక్స్ లేదా జనరల్ స్టడీస్‌లో మీకు ఏ కాన్సెప్ట్ అర్థం కాకపోయినా, పైన ఉన్న 7 పద్ధతులలో ఏదైనా ఎంచుకుని అడగండి. మనం వివరంగా మరియు సులభంగా నేర్చుకుందాం!`,
      timestamp: new Date().toISOString(),
      suggestedFollowUpsTe: [
        "కేంద్రీయ ప్రవృత్తి కొలతలను బోధించండి",
        "సంభావ్యత బేయెస్ సిద్ధాంతం వివరించండి",
        "సహసంబంధ గుణకం సూత్రం చెప్పండి",
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTopic = topics.find((t) => t.id === selectedTopicId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("మీ బ్రౌజర్‌లో మైక్రోఫోన్ సౌకర్యం అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.");
      setSpeechSupported(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "te-IN";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-To-Speech (Telugu Audio)
  const speakTelugu = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("వాయిస్ సపోర్ట్ అందుబాటులో లేదు.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Clean markdown before speaking
    const cleanText = text
      .replace(/[#*`_~$$]/g, "")
      .replace(/\\[a-zA-Z]+/g, "")
      .replace(/\n+/g, " ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "te-IN";
    utterance.rate = 0.95; // comfortable learning pace

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      contentTe: textToSend,
      modeUsed: selectedMode,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const result = await TeluguAITutorEngine.processMessage(
        "student_default",
        textToSend,
        selectedMode,
        selectedTopicId
      );

      const tutorMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        sender: "tutor",
        contentTe: result.messageTe,
        modeUsed: selectedMode,
        mathLatex: result.mathLatex,
        groundingSources: result.sourcesUsed,
        suggestedFollowUpsTe: result.suggestedFollowUpsTe,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: "msg_" + Date.now(),
        sender: "tutor",
        contentTe:
          "క్షమించండి, సమాధానం రూపొందించడంలో తాత్కాలిక సమస్య ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Header: Topic Selector & Mode Badges */}
      <div className="bg-white border border-[#E5EAE5] rounded-3xl p-4 mb-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F4F0] text-[#176B5B] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#17211E]">
                తెలుగు AI ట్యూటర్ (Telugu Learning Companion)
              </h2>
              <span className="text-[11px] text-[#65716D]">
                సిలబస్ ఆధారిత ధృవీకృత సమాధానాలు • TGPSC 07/G/ES/2026
              </span>
            </div>
          </div>

          {/* Topic Selector */}
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold bg-[#F5F6F2] border border-[#E5EAE5] rounded-xl px-3 py-2 text-[#17211E] focus:outline-none focus:ring-2 focus:ring-[#176B5B]"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.paperId === "paper_1" ? "P1" : "P2"}: {t.titleTe.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>

        {/* 7 Pedagogical Modes Scrollable Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {TUTOR_MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-target select-none ${
                  isSelected
                    ? "bg-[#176B5B] text-white shadow-xs"
                    : "bg-[#F5F6F2] text-[#65716D] hover:bg-[#E5EAE5] hover:text-[#17211E]"
                }`}
                title={mode.descriptionTe}
              >
                {mode.titleTe}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 bg-white border border-[#E5EAE5] rounded-3xl p-4 sm:p-6 overflow-y-auto mb-4 space-y-4 shadow-xs">
        {messages.map((msg) => {
          const isTutor = msg.sender === "tutor";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 ${
                  isTutor
                    ? "bg-[#F5F6F2] text-[#17211E] border border-[#E5EAE5]"
                    : "bg-[#176B5B] text-white shadow-xs"
                }`}
              >
                {/* Tutor Sender Tag & Audio */}
                {isTutor && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#E5EAE5]/60">
                    <span className="text-[11px] font-bold text-[#176B5B] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI ఉపాధ్యాయుడు</span>
                    </span>
                    <button
                      onClick={() => speakTelugu(msg.contentTe)}
                      className="p-1 rounded-md text-[#65716D] hover:text-[#176B5B] hover:bg-[#E8F4F0]"
                      title="తెలుగులో వినండి (Audio)"
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-4 h-4 text-[#B33D44]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#176B5B]" />
                      )}
                    </button>
                  </div>
                )}

                {/* Content */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {msg.contentTe}
                </div>

                {/* Math Latex Blocks */}
                {msg.mathLatex && msg.mathLatex.length > 0 && (
                  <div className="mt-3">
                    {msg.mathLatex.map((math, idx) => (
                      <MathBlock key={idx} math={math} />
                    ))}
                  </div>
                )}

                {/* Grounding Source Pill */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#E5EAE5]/60 flex items-center gap-2">
                    <span className="text-[10px] text-[#176B5B] font-bold bg-[#E8F4F0] px-2 py-0.5 rounded-md">
                      అధికారిక సిలబస్ ఆధారితం: {msg.groundingSources[0].reference}
                    </span>
                  </div>
                )}
              </div>

              {/* Suggested Follow-Ups */}
              {isTutor && msg.suggestedFollowUpsTe && msg.suggestedFollowUpsTe.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-1">
                  {msg.suggestedFollowUpsTe.map((followUp, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSendMessage(followUp)}
                      className="text-xs bg-[#E8F4F0] text-[#176B5B] px-3 py-1.5 rounded-xl border border-[#BFE2D7] hover:bg-[#D5ECE5] transition-colors touch-target"
                    >
                      {followUp}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 bg-[#F5F6F2] rounded-2xl w-fit">
            <div className="w-2 h-2 rounded-full bg-[#176B5B] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#176B5B] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#176B5B] animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-[#65716D] font-medium ml-2">
              సమాధానం రచిస్తున్నాను...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border border-[#E5EAE5] rounded-2xl p-2 sm:p-3 shadow-md flex items-center gap-2">
        <button
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition-colors touch-target ${
            isListening
              ? "bg-[#B33D44] text-white animate-pulse"
              : "bg-[#F5F6F2] text-[#65716D] hover:text-[#176B5B] hover:bg-[#E8F4F0]"
          }`}
          title="తెలుగులో మాట్లాడండి"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="ఈ అంశంలో మీ సందేహాన్ని తెలుగులో అడగండి..."
          className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base text-[#17211E] placeholder:text-[#9AA5A1] focus:outline-none"
        />

        <Button
          variant="primary"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
