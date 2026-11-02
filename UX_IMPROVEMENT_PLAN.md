# MISSION MPSO — UX Improvement Plan & Product Roadmap

**Project:** MISSION MPSO  
**Target Examination:** TGPSC MPSO / ASO 2026–2027 (Notification No. 07/G/ES/2026)  
**Document Purpose:** Prioritized 4-Tier Strategic & Tactical User Experience Optimization Plan  
**Target User Persona:** Adult Telugu-speaking woman preparing for competitive state services on Android smartphone  
**Evaluation Standard:** WCAG 2.2 AA, Cognitive Ergonomics, Offline Resilience  
**Date:** November 2026  

---

## 00. Product Roadmap Overview

The MISSION MPSO UX improvement roadmap is structured into four distinct execution tiers:
1. **Tier 1: Immediate Fixes (Completed & Verified)** — Critical fixes addressing mobile layout breaking, horizontal scrolling, localization headlines, touch target sizing, and timed exam screen-reader semantics.
2. **Tier 2: High-Priority Enhancements (Next Sprint / 2–4 Weeks)** — Foundational capabilities enhancing mobile learning continuity, offline availability, voice inputs, and tactile interaction feedback.
3. **Tier 3: Medium-Priority Improvements (Quarterly Horizon / 1–2 Months)** — Cognitive aids, audio speed flexibility, study habit notifications, and downloadable revision aids.
4. **Tier 4: Future & Extended Roadmap (Exam Phase / 3–6 Months)** — High-fidelity physical exam simulations (OMR bubble sheets), peer study groups, and deep historical TGPSC trend analytics.

---

## 01. Tier 1: Immediate Fixes (Completed & Verified)

All items in Tier 1 have been implemented, tested via Playwright and Vitest, and verified across all 7 target viewports down to 320px width.

| Item ID | Component / Area | Description of Implemented Improvement | Primary User Impact | Verification Evidence |
|---|---|---|---|---|
| **T1-01** | `src/components/ui/Badge.tsx` | Replaced hardcoded `whitespace-nowrap` with `max-w-full text-left leading-snug break-words`. | Eliminates badge overflow across all mobile screens. Long bilingual labels wrap cleanly. | Verified (0px overflow on 320px/360px) |
| **T1-02** | Header Badge Rows (Global) | Added `flex-wrap items-center gap-2` on header badge rows across `/mocks`, `/study-plan`, `/revision`, `/learn`, `/mistakes`, and `/admin`. | Completely removed horizontal scrollbars across the application. | Verified in Playwright crawler across 16 routes |
| **T1-03** | `src/app/page.tsx` | Elevated hero H1 headline to Telugu-first: `ఒకే అభ్యర్థి. ఒకే లక్ష్యం. మీ విజయం కోసం ఒకే తెలివైన AI తోడు.` | Immediate cognitive connection for Telugu-medium aspirants; eliminates fear of English-only portal. | Visual verification + E2E test |
| **T1-04** | `src/components/layout/Header.tsx` | Expanded mobile language toggle buttons (`తె`, `EN`) from 28x26px to >=38x38px with full `aria-label`s. | Meets WCAG 2.2 AA SC 2.5.8 touch target standards; eliminates accidental mis-taps. | Verified in `A11Y_AND_RESPONSIVE_AUDIT.json` |
| **T1-05** | `src/components/layout/BottomNav.tsx` | Added `aria-current="page"` and descriptive Telugu/English `aria-label`s to mobile navigation icons. | Screen reader users can immediately identify current active section and navigate reliably. | Verified in `e2e/auth-and-navigation.spec.ts` |
| **T1-06** | `src/components/mock/MockSimulator.tsx` | Added `role="timer"` and dynamic `aria-label` to exam countdown; added status labels (`aria-label`) to all 150 question palette buttons. | Timed mock examinations are fully accessible to screen reader users; question states are no longer conveyed by color alone. | Verified in `e2e/mock-examination.spec.ts` |
| **T1-07** | `src/components/math/MathBlock.tsx` | Added `max-w-full` and contained scroll container for wide LaTeX formulas. | Complex equations (Bayes' formula, Chi-square test) no longer stretch the parent card wider than the mobile screen. | Verified in `e2e/learning-and-tutor.spec.ts` |
| **T1-08** | `vitest.config.ts` | Scoped unit tests to `src/**/*.test.ts` and excluded E2E suites. | Clean test separation: 25 Vitest tests and 24 Playwright tests execute with zero conflicts. | Verified (49/49 tests passing) |

---

## 02. Tier 2: High-Priority Enhancements (Next Sprint: 2–4 Weeks)

These enhancements address physical usage realities: intermittent rural 4G connectivity, household interruptions, and mobile typing friction.

### 2.1 Progressive Web App (PWA) Offline Lesson Caching
- **Problem Statement:** In semi-urban or rural Telangana, cell coverage can drop during bus commutes or power outages. If the student is reading a Statistics lesson and loses connection, the application displays a generic offline error.
- **Proposed Solution:** Implement Next.js Serwist / Workbox service worker caching for all opened lessons, formula sheets, and completed flashcards.
- **User Experience Flow:**
  - When connection is lost, an unobtrusive banner appears: *"ఆఫ్‌లైన్ మోడ్: మీరు డౌన్‌లోడ్ చేసుకున్న పాఠాలను చదువుకోవచ్చు (Offline Mode: You can read cached lessons)"*.
  - Lesson Reader and Revision flashcards continue functioning with cached local IndexedDB data.
- **Effort / Impact:** Medium Effort / Very High Impact.

### 2.2 Voice Input for AI Statistics Tutor (Telugu Speech-to-Text)
- **Problem Statement:** Typing complex Telugu questions on a smartphone keyboard (e.g., *"సాధారణ విభాజనం యొక్క లక్షణాలు ఏమిటి?"*) can be tedious, especially with complex conjunct consonants.
- **Proposed Solution:** Add a Web Speech API / Whisper-powered microphone icon next to the AI Tutor chat input.
- **User Experience Flow:**
  - Student taps the microphone button.
  - A pulsating Telugu prompt appears: *"మాట్లాడండి... మీ సందేహాన్ని అడగండి (Listening... Ask your doubt)"*.
  - Transcribed Telugu query appears in the input field with a 1-tap send action.
- **Effort / Impact:** Medium Effort / High Impact.

### 2.3 Tactile Haptic Feedback on MCQ Selection
- **Problem Statement:** During mock exams or rapid practice quizzes on mobile, students often double-tap option buttons because there is no physical sensation of a button press.
- **Proposed Solution:** Implement gentle vibration feedback (`navigator.vibrate(12)`) on selecting an MCQ option.
- **User Experience Flow:**
  - Tapping an option produces a subtle 12ms tactile confirmation, reinforcing physical certainty without screen distraction.
- **Effort / Impact:** Low Effort / High Usability Satisfaction.

---

## 03. Tier 3: Medium-Priority Improvements (Quarterly: 1–2 Months)

### 3.1 Audio Narration & Variable Speed Playback for Statistics Lessons
- **Problem Statement:** An adult woman student managing household chores often prefers listening to conceptual explanations while multitasking.
- **Proposed Solution:** Add a high-quality Telugu Text-to-Speech (TTS) audio player to the Lesson Reader.
- **Features:**
  - Natural Telugu female voice narration.
  - Speed selector: `0.8x` (slow for mathematical derivations), `1.0x` (normal), `1.2x` (quick revision).
  - Synchronized sentence highlighting as the audio plays.
- **Effort / Impact:** High Effort / High Impact for non-desk study hours.

### 3.2 Contextual Study Habit & Revision Reminders
- **Problem Statement:** Spaced repetition works only if the student reviews flashcards at calculated intervals. Students who miss 2 consecutive days risk falling behind.
- **Proposed Solution:** Opt-in Web Push Notifications with gentle, encouraging Telugu prompts:
  - *"భాగ్య గారూ, ఈరోజు మీ రివిజన్ కోసం 4 ఫార్ములాలు సిద్ధంగా ఉన్నాయి. కేవలం 5 నిమిషాలు కేటాయించండి!"*
  - Student can configure preferred quiet hours and notification slots (e.g., Morning 6:30 AM or Evening 8:00 PM).
- **Effort / Impact:** Medium Effort / Medium Impact.

### 3.3 Printable PDF Summary Sheets for Fast Revision
- **Problem Statement:** Many competitive exam aspirants like having a physical paper printout of key formulas on their study wall or desk.
- **Proposed Solution:** 1-click *"PDF గా డౌన్‌లోడ్ చేసుకోండి (Download PDF)"* in the Revision module, rendering a clean 2-page cheat sheet of all Paper II statistics formulas.
- **Effort / Impact:** Low Effort / High Emotional Value for aspirants.

---

## 04. Tier 4: Future & Extended Roadmap (Exam Phase: 3–6 Months)

### 4.1 OMR Bubble Sheet Simulation Mode
- **Exam Context:** The TGPSC MPSO / ASO examination is an offline pen-and-paper OMR (Optical Mark Recognition) test. Filling circles with a blue/black ballpoint pen introduces real-world risks: bubbling the wrong row, incomplete bubbles, or running out of time during shading.
- **Proposed Feature:**
  - Add an optional *"OMR మోడ్"* in the Mock Simulator.
  - On tablet or phone, renders a realistic digital OMR bubble grid (A, B, C, D circles) requiring a circular fingertip gesture to fill.
  - Alerts student to common OMR mistakes (e.g., double bubbling or bubbling out of sequence).
- **Impact:** Exceptional real-world exam fidelity and stress reduction.

### 4.2 Historical TGPSC Past Paper Trend Analytics
- **Proposed Feature:** A dedicated analytics view showing frequency distribution of questions across topics in past APPSC/TGPSC ASO/MPSO exams (e.g., Number of questions from Sampling Theory vs. Probability vs. Index Numbers over the last 15 years).
- **Impact:** Strategic focus for late-stage revision.

---

## 05. Actionable Implementation Matrix

| Phase | Milestone / Feature | Key Affected Files | Complexity | Primary Owner | Expected Delivery |
|---|---|---|:---:|---|:---:|
| **Tier 1** | **Mobile Responsiveness & A11y Fixes** | `Badge.tsx`, `Header.tsx`, `MockSimulator.tsx`, `MathBlock.tsx` | Low | Frontend / UX | **COMPLETED** |
| **Tier 2** | **Offline PWA Caching** | `next.config.ts`, `service-worker.ts`, `IndexedDB` | Medium | PWA / Offline Lead | Sprint +1 |
| **Tier 2** | **Voice Input (Telugu STT)** | `src/components/tutor/TutorChat.tsx`, Web Speech API | Medium | AI / Audio Engineer | Sprint +1 |
| **Tier 2** | **MCQ Haptic Feedback** | `src/components/practice/QuizEngine.tsx`, `MockSimulator.tsx` | Low | Frontend QA | Sprint +1 |
| **Tier 3** | **Telugu Audio Narration (0.8x/1.0x/1.2x)** | `src/components/curriculum/LessonReader.tsx`, Web Audio API | High | EdTech Pedagogy | Sprint +2 |
| **Tier 3** | **Push Habit Reminders** | `src/components/settings/SettingsView.tsx`, Web Push API | Medium | Backend Engineer | Sprint +2 |
| **Tier 3** | **Printable Revision PDF** | `src/components/revision/RevisionView.tsx`, `@react-pdf` | Low | UI Designer | Sprint +2 |
| **Tier 4** | **OMR Bubble Sheet Simulator** | `src/components/mock/OMRSheet.tsx`, Canvas 2D | High | Simulation Specialist | Sprint +3 |
