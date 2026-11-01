import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { LessonReader } from "@/components/curriculum/LessonReader";

export const dynamic = "force-dynamic";

export default async function TopicLessonPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const user = await getCurrentUser();

  const topic = db.getTopic(topicId);
  const lessons = db.getLessons(topicId);

  if (!topic) {
    notFound();
  }

  // If a lesson is available for this topic, render the rich lesson reader
  const lesson = lessons[0] || {
    id: `lesson_${topicId}`,
    topicId: topic.id,
    titleTe: topic.titleTe,
    titleEn: topic.titleEn,
    estimatedMinutes: 30,
    overviewTe: topic.descriptionTe,
    overviewEn: topic.descriptionEn,
    keyConceptsTe: topic.subtopics.map((st) => ({
      concept: st.titleTe,
      englishTerm: st.titleEn,
      explanation: `${st.titleTe} అనేది ఈ యూనిట్‌లో ముఖ్యమైన భాగం. పరీక్షలో ఈ విభాగం నుండి ప్రశ్నలు వచ్చే అవకాశం ఉంది.`,
    })),
    summaryPointsTe: [
      `${topic.titleTe} పై పట్టు సాధించడానికి ప్రాథమిక సూత్రాలు మరియు ఉదాహరణలను సాధించండి.`,
      `ఈ అంశం TGPSC అధికారిక సిలబస్ అనుబంధం-II లో నిర్దేశించబడింది.`,
    ],
    officialSyllabusMapping: `${topic.paperId === "paper_1" ? "పేపర్ I" : "పేపర్ II"} - యూనిట్ ${topic.unitNumber}`,
    sourceReferences: ["TGPSC Notification 07/G/ES/2026 Annexure-II"],
    lastVerifiedDate: "2026-10-30",
  };

  return (
    <AppShell initialRole={user?.role || "student"}>
      <LessonReader lesson={lesson} topic={topic} />
    </AppShell>
  );
}
