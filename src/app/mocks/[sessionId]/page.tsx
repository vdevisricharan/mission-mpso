import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { MockExamSession, MockQuestionState } from "@/types/mock";
import { MockSimulator } from "@/components/mock/MockSimulator";

export const dynamic = "force-dynamic";

export default async function MockExamPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const user = await getCurrentUser();
  const userId = user?.id || "student_default";

  // Check if session exists in DB or create a fresh simulator session
  let session = db.getMockSession(sessionId);

  if (!session) {
    const isPaper1 = sessionId.includes("paper_1");
    const paperId = isPaper1 ? "paper_1" : "paper_2";
    const questions = db.getQuestions({ paperId, validationStatus: "approved" });

    const totalQ = sessionId.includes("mini") ? Math.min(questions.length, 15) : questions.length;
    const selectedQuestions = questions.slice(0, totalQ);

    const questionStates: Record<string, MockQuestionState> = {};
    selectedQuestions.forEach((q, idx) => {
      questionStates[q.id] = {
        questionId: q.id,
        questionNumber: idx + 1,
        paperId: q.paperId,
        selectedOptionId: null,
        status: idx === 0 ? "unanswered" : "not_visited",
        timeSpentSeconds: 0,
      };
    });

    const durationMinutes = sessionId.includes("mini") ? 20 : 150;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

    session = {
      id: sessionId,
      userId,
      mockType: isPaper1 ? "paper_1_full" : "paper_2_full",
      titleTe: isPaper1
        ? "పేపర్ I: జనరల్ స్టడీస్ పూర్తి స్థాయి మాక్ టెస్ట్"
        : "పేపర్ II: స్టాటిస్టిక్స్ పూర్తి స్థాయి మాక్ టెస్ట్",
      titleEn: isPaper1
        ? "Paper-I: General Studies Full Mock Test"
        : "Paper-II: Statistics Degree Level Full Mock Test",
      totalQuestions: totalQ,
      totalDurationMinutes: durationMinutes,
      totalMarks: totalQ,
      negativeMarkingEnabled: false,
      penaltyPerWrongAnswer: 0,
      startedAt: new Date().toISOString(),
      expiresAt,
      status: "in_progress",
      questions: selectedQuestions,
      questionStates,
      currentQuestionIndex: 0,
    };

    db.saveMockSession(session);
  }

  async function handleMockSubmit(completed: MockExamSession) {
    "use server";
    db.saveMockSession(completed);
  }

  return (
    <MockSimulator
      session={session}
      onSubmitMock={handleMockSubmit}
    />
  );
}
