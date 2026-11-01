import { describe, it, expect } from "vitest";
import { OFFICIAL_MPSO_EXAM_CONFIG } from "../types/exam";
import { OFFICIAL_SYLLABUS_TOPICS } from "../lib/curriculum/syllabus-data";

describe("TGPSC Notification 07/G/ES/2026 Official Rules Verification", () => {
  it("matches the official notification number and date exactly", () => {
    expect(OFFICIAL_MPSO_EXAM_CONFIG.notificationNumber).toBe("07/G/ES/2026");
    expect(OFFICIAL_MPSO_EXAM_CONFIG.notificationDate).toBe("2026-10-28");
  });

  it("verifies the scheme of examination (2 Papers, 300 Questions, 300 Marks)", () => {
    expect(OFFICIAL_MPSO_EXAM_CONFIG.totalQuestions).toBe(300);
    expect(OFFICIAL_MPSO_EXAM_CONFIG.totalMarks).toBe(300);
    expect(OFFICIAL_MPSO_EXAM_CONFIG.papers).toHaveLength(2);

    const p1 = OFFICIAL_MPSO_EXAM_CONFIG.papers.find((p) => p.id === "paper_1");
    expect(p1?.totalQuestions).toBe(150);
    expect(p1?.durationMinutes).toBe(150);
    expect(p1?.totalMarks).toBe(150);

    const p2 = OFFICIAL_MPSO_EXAM_CONFIG.papers.find((p) => p.id === "paper_2");
    expect(p2?.totalQuestions).toBe(150);
    expect(p2?.durationMinutes).toBe(150);
    expect(p2?.totalMarks).toBe(150);
  });

  it("ensures negative marking policy is NOT fabricated and marked unconfirmed", () => {
    expect(OFFICIAL_MPSO_EXAM_CONFIG.negativeMarkingPolicy).toBe("unconfirmed");
    expect(OFFICIAL_MPSO_EXAM_CONFIG.negativeMarkingPenalty).toBe(0);
    expect(OFFICIAL_MPSO_EXAM_CONFIG.negativeMarkingNoteTe).toContain("నెగెటివ్ మార్కింగ్ నియమం స్పష్టంగా పేర్కొనబడలేదు");
  });

  it("verifies qualifying marks thresholds according to Section 12.2 of notification", () => {
    expect(OFFICIAL_MPSO_EXAM_CONFIG.qualifyingMarks.ocAndEws).toBe(40);
    expect(OFFICIAL_MPSO_EXAM_CONFIG.qualifyingMarks.bc).toBe(35);
    expect(OFFICIAL_MPSO_EXAM_CONFIG.qualifyingMarks.scStPh).toBe(30);
  });

  it("verifies full syllabus coverage (13 Paper I topics and 8 Paper II units)", () => {
    const p1Topics = OFFICIAL_SYLLABUS_TOPICS.filter((t) => t.paperId === "paper_1");
    const p2Topics = OFFICIAL_SYLLABUS_TOPICS.filter((t) => t.paperId === "paper_2");

    expect(p1Topics).toHaveLength(13);
    expect(p2Topics).toHaveLength(8);
  });
});
