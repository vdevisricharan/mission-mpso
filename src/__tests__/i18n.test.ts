import { describe, it, expect } from "vitest";
import { TRANSLATIONS } from "@/lib/i18n";

describe("Internationalization & Bilingual Dictionary (i18n)", () => {
  it("should have complete symmetry of translation keys between Telugu and English", () => {
    const teKeys = Object.keys(TRANSLATIONS.te).sort();
    const enKeys = Object.keys(TRANSLATIONS.en).sort();

    expect(teKeys).toEqual(enKeys);
    expect(teKeys.length).toBeGreaterThan(40);
  });

  it("should provide valid Telugu and English values for navigation items", () => {
    expect(TRANSLATIONS.te.nav_home).toBe("హోమ్");
    expect(TRANSLATIONS.en.nav_home).toBe("Home");

    expect(TRANSLATIONS.te.nav_learn).toBe("నేర్చుకోండి");
    expect(TRANSLATIONS.en.nav_learn).toBe("Learn");

    expect(TRANSLATIONS.te.nav_practice).toBe("ప్రాక్టీస్");
    expect(TRANSLATIONS.en.nav_practice).toBe("Practice");

    expect(TRANSLATIONS.te.nav_progress).toBe("నా ప్రగతి");
    expect(TRANSLATIONS.en.nav_progress).toBe("Progress");

    expect(TRANSLATIONS.te.nav_tutor).toBe("AI ట్యూటర్");
    expect(TRANSLATIONS.en.nav_tutor).toBe("AI Tutor");

    expect(TRANSLATIONS.te.logout).toContain("లాగ్ అవుట్");
    expect(TRANSLATIONS.en.logout).toBe("Log out");
  });

  it("should provide valid Telugu and English values for quiz and mock components", () => {
    expect(TRANSLATIONS.te.quiz_completed_title).toBe("క్విజ్ పూర్తయింది!");
    expect(TRANSLATIONS.en.quiz_completed_title).toBe("Quiz Completed!");

    expect(TRANSLATIONS.te.submit_quiz).toContain("సమర్పించండి");
    expect(TRANSLATIONS.en.submit_quiz).toBe("Submit Quiz");

    expect(TRANSLATIONS.te.status_answered).toBe("సమాధానం ఇచ్చినవి");
    expect(TRANSLATIONS.en.status_answered).toBe("Answered");
  });
});
