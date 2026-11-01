import { describe, it, expect } from "vitest";
import { MasteryEngine } from "../lib/adaptive/mastery-engine";

describe("MasteryEngine & Evidence-based Evaluation", () => {
  it("marks topics with 0 attempts as not_assessed", () => {
    const res = MasteryEngine.evaluateMastery(0, 0);
    expect(res.level).toBe("not_assessed");
    expect(res.thresholdMet).toBe(false);
  });

  it("does NOT award Strong mastery with insufficient evidence (less than 5 questions)", () => {
    // 1 question answered correctly is NOT enough for Strong mastery
    const res = MasteryEngine.evaluateMastery(1, 1);
    expect(res.level).toBe("beginning");
    expect(res.thresholdMet).toBe(false);
  });

  it("awards Strong mastery only when >= 5 questions with >= 85% accuracy", () => {
    const res = MasteryEngine.evaluateMastery(10, 9); // 90% accuracy, 10 attempts
    expect(res.level).toBe("strong");
    expect(res.thresholdMet).toBe(true);
  });

  it("awards Proficient mastery for >= 70% accuracy with threshold met", () => {
    const res = MasteryEngine.evaluateMastery(10, 7); // 70% accuracy
    expect(res.level).toBe("proficient");
    expect(res.thresholdMet).toBe(true);
  });

  it("awards Practising mastery for 50-69% accuracy", () => {
    const res = MasteryEngine.evaluateMastery(10, 6); // 60% accuracy
    expect(res.level).toBe("practising");
  });

  it("awards Developing mastery for < 50% accuracy", () => {
    const res = MasteryEngine.evaluateMastery(10, 3); // 30% accuracy
    expect(res.level).toBe("developing");
  });
});
