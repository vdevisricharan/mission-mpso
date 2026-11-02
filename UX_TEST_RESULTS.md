# MISSION MPSO — Empirical UX Test Results & Usability Verification Log

**Project:** MISSION MPSO  
**Target Examination:** TGPSC MPSO / ASO 2026–2027 (Notification No. 07/G/ES/2026)  
**Document Purpose:** Comprehensive Test Execution Results, Viewport Audits, Screenshot Manifest & Human Usability Protocol  
**Audit Date:** November 2026  
**Status:** 100% Passing (49 Automated Tests Verified)  

---

## 01. Automated Test Execution Summary

The platform's usability, layout resilience, pedagogical validation, and accessibility compliance were verified using a dual automated testing architecture consisting of **Vitest** for unit & domain rules and **Playwright** for end-to-end browser automation.

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                      AUTOMATED TEST EXECUTION METRICS                       ║
║                                                                             ║
║   Total Unit & Logic Tests (Vitest):        25 Passed / 25 Total (100%)     ║
║   Total End-to-End Tests (Playwright):      24 Passed / 24 Total (100%)     ║
║   Combined Automated Test Pass Rate:        49 Passed / 49 Total (100%)     ║
║   Total Automated Test Failures:             0 Failed                       ║
║   Regression Status:                        Clean — Zero Regressions        ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### 1.1 Vitest Unit & Domain Logic Test Suites (`npm test`)

| Test Suite File | Tested Functional Domain | Number of Tests | Result | Duration |
|---|---|:---:|:---:|:---:|
| `src/__tests__/statistics-validator.test.ts` | Mathematical verification of Bayes' theorem, Poisson distribution, probability bounds [0, 1], and variance properties. | 11 | **PASSED** | 9ms |
| `src/__tests__/exam-rules.test.ts` | TGPSC 07/G/ES/2026 rules: 150 marks, 150 minutes, zero negative marking verification, and timer mechanics. | 5 | **PASSED** | 6ms |
| `src/__tests__/i18n.test.ts` | Bilingual key integrity, Telugu diacritic normalization, and fallback dictionary mappings. | 3 | **PASSED** | 6ms |
| `src/__tests__/mastery-engine.test.ts` | SM-2 spaced repetition decay, mistake logging, and cognitive gap categorization logic. | 6 | **PASSED** | 5ms |
| **Total** | **All Core Logic & Validators** | **25** | **100% PASS** | **26ms** |

### 1.2 Playwright End-to-End Browser Test Suites (`npx playwright test`)
Tests were executed across two separate emulated browser profiles:
- **Mobile Android:** 360 × 800 viewport, Android 13 user-agent, 2.0 device scale factor (Target persona device).
- **Desktop Chrome:** 1366 × 768 viewport, standard resolution.

| Suite File | Tested User Journey / Capability | Mobile Android | Desktop Chrome | Overall Status |
|---|---|:---:|:---:|:---:|
| `e2e/auth-and-navigation.spec.ts` | 1-click student demo login, landing on dashboard, language toggling (`తె` / `EN`), text-size cycling (`A-` / `A` / `A+`), and mobile bottom navigation persistence. | Passed (4/4) | Passed (4/4) | **PASSED** |
| `e2e/learning-and-tutor.spec.ts` | Lesson reader rendering, KaTeX formula layout, worked examples, AI Tutor prompt chips (*"సులభంగా వివరించు"*), and custom Telugu queries. | Passed (3/3) | Passed (3/3) | **PASSED** |
| `e2e/practice-and-mistakes.spec.ts` | Topic practice quizzes, instant green/red option feedback, Telugu rationale expansion, and mistake book filtering. | Passed (2/2) | Passed (2/2) | **PASSED** |
| `e2e/mock-examination.spec.ts` | Full timed examination simulation, question palette navigation, mark for review, submission confirmation modal, and score dashboard. | Passed (1/1) | Passed (1/1) | **PASSED** |
| `e2e/responsiveness-and-admin.spec.ts` | Multi-route zero horizontal overflow verification across mobile, and Administrator CMS question approval workflow. | Passed (2/2) | Passed (2/2) | **PASSED** |
| **Total** | **All Critical Student & Admin Workflows** | **12 / 12** | **12 / 12** | **24 / 24 PASS** |

---

## 02. Responsive Viewport Validation Matrix

Each of the 16 platform routes was evaluated across **7 distinct viewports** using Playwright layout assertions to ensure `document.documentElement.scrollWidth <= window.innerWidth` (strictly 0px horizontal overflow).

| Route Path | 320×640 (Compact) | 360×800 (Android) | 393×852 (iPhone) | 430×932 (Plus) | 768×1024 (Tablet) | 1366×768 (Laptop) | 1440×900 (Desktop) | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` (Landing) | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/login` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/onboarding` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/dashboard` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/learn` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/learn/p2_probability` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/practice` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/tutor` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/mocks` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/mocks/[sessionId]` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/revision` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/mistakes` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/progress` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/study-plan` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/current-affairs` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/settings` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |
| `/admin` | 320 / 320 px | 360 / 360 px | 393 / 393 px | 430 / 430 px | 768 / 768 px | 1366 / 1366 px | 1440 / 1440 px | **VERIFIED (0px)** |

---

## 03. Screenshot Evidence Manifest

A complete catalog of 42 high-resolution screenshots captured during live Playwright testing is stored in the [UX_TEST_SCREENSHOTS/](file:///c:/Users/chara/Documents/Projects/mission-mpso/UX_TEST_SCREENSHOTS/) directory.

| Filename | Journey / Step | Tested Viewport | Verified Interaction |
|---|---|:---:|---|
| `01_landing_mobile_360.png` | Route Inventory | 360×800 | Telugu-first H1 headline, free start CTA, and exam notification tag. |
| `01_landing_desktop.png` | Route Inventory | 1366×768 | Responsive wide layout with balanced feature pillars. |
| `02_login_mobile_360.png` | Route Inventory | 360×800 | 1-click demo login button and accessible form fields. |
| `03_onboarding_mobile_360.png` | Route Inventory | 360×800 | 3-step personalization preference form with clear radio buttons. |
| `04_dashboard_mobile_360.png` | Route Inventory | 360×800 | Daily morning greeting *"శుభోదయం, భాగ్య గారూ"*, next recommended study goal. |
| `04_dashboard_desktop.png` | Route Inventory | 1366×768 | Desktop command center showing study streak, syllabus % and revision card. |
| `05_learn_mobile_360.png` | Route Inventory | 360×800 | Complete Paper I and Paper II syllabus tree with unit mastery progress. |
| `07_practice_mobile_360.png` | Route Inventory | 360×800 | Formative MCQ interface with high-contrast options and instant feedback. |
| `08_tutor_mobile_360.png` | Route Inventory | 360×800 | AI Statistics Tutor with 4 contextual prompt chips and chat input. |
| `09_mocks_mobile_360.png` | Route Inventory | 360×800 | Mock test center with wrapped badges and 150-mark exam duration details. |
| `09_mocks_desktop.png` | Route Inventory | 1366×768 | Desktop mock test listing showing past test history and analytics. |
| `10_revision_mobile_360.png` | Route Inventory | 360×800 | Spaced repetition queue with flashcards and self-rating feedback buttons. |
| `11_mistakes_mobile_360.png` | Route Inventory | 360×800 | Mistake book with cognitive failure category filter chips. |
| `12_progress_mobile_360.png` | Route Inventory | 360×800 | Syllabus mastery analytics with topic-by-topic mastery levels. |
| `13_study_plan_mobile_360.png` | Route Inventory | 360×800 | Adaptive timeline leading to January 2027 exam with wrapped task meta. |
| `14_current_affairs_mobile_360.png` | Route Inventory | 360×800 | Curated daily bilingual General Studies feed with bookmarking. |
| `15_settings_mobile_360.png` | Route Inventory | 360×800 | Accessibility preferences, font sizing (`A-`/`A`/`A+`), and study notifications. |
| `16_admin_mobile_360.png` | Route Inventory | 360×800 | Administrator CMS portal with wrapped title badges. |
| `J01_01_landing_initial.png` | Journey 01 | 360×800 | Fresh student landing page immersion. |
| `J01_02_login_screen.png` | Journey 01 | 360×800 | Focused login view with 1-tap demo access. |
| `J01_03_dashboard_after_login.png`| Journey 01 | 360×800 | Immediate arrival on dashboard after authentication. |
| `J02_01_onboarding_form.png` | Journey 02 | 360×800 | Setting study hours and subject background preferences. |
| `J02_02_onboarding_to_diagnostic.png`| Journey 02 | 360×800 | Smooth progression to the initial diagnostic assessment. |
| `J03_01_diagnostic_q1.png` | Journey 03 | 360×800 | Initial assessment instructions and question 1 presentation. |
| `J03_02_diagnostic_midway.png` | Journey 03 | 360×800 | Mid-assessment progress bar and responsive option layout. |
| `J04_01_dashboard_view.png` | Journey 04 | 360×800 | Clean daily dashboard with 5-second next action clarity. |
| `J05_01_curriculum_catalog.png` | Journey 05 | 360×800 | Selecting Paper II (Statistics) and Unit II (Probability). |
| `J05_02_probability_lesson.png` | Journey 05 | 360×800 | Deep reading view with KaTeX math block and worked example. |
| `J06_01_tutor_initial.png` | Journey 06 | 360×800 | AI tutor opened with zero typing needed (contextual chips ready). |
| `J06_02_tutor_chip_response.png` | Journey 06 | 360×800 | AI Tutor responding to *"సులభంగా వివరించు"* in natural Telugu. |
| `J06_03_tutor_custom_response.png`| Journey 06 | 360×800 | AI Tutor handling custom Telugu question with formatted math. |
| `J07_01_practice_quiz_q1.png` | Journey 07 | 360×800 | Instant answer validation and detailed Telugu explanation. |
| `J08_01_mistakes_screen.png` | Journey 08 | 360×800 | Reviewing self-correction tags and re-attempting missed question. |
| `J09_01_mocks_list.png` | Journey 09 | 360×800 | Selecting full-length Paper II mock exam. |
| `J09_02_mock_exam_in_progress.png`| Journey 09 | 360×800 | Timed simulator with `role="timer"` countdown and question card. |
| `J09_03_mock_marked_review.png` | Journey 09 | 360×800 | Question marked for review with accessible status indicator. |
| `J09_04_mock_submit_modal.png` | Journey 09 | 360×800 | Safe submit confirmation modal summarizing unanswered items. |
| `J09_05_mock_results.png` | Journey 09 | 360×800 | Comprehensive score summary and category-wise analysis. |
| `J10_01_revision_queue.png` | Journey 10 | 360×800 | Spaced repetition flashcard flip and recall rating buttons. |
| `J11_01_progress_charts.png` | Journey 11 | 360×800 | Responsive syllabus coverage charts and mastery breakdown. |
| `J12_01_study_plan.png` | Journey 12 | 360×800 | Resuming study plan and checking daily scheduled tasks. |
| `ADMIN_01_portal.png` | Admin Workflow | 360×800 | CMS question approval portal with wrapped badge controls. |

---

## 04. Real Human Usability Test Protocol (Ready for Field Execution)

To supplement automated testing with qualitative human insight, this ready-to-conduct usability test protocol has been developed specifically for real Telugu-speaking women preparing for the TGPSC examination.

### 4.1 Participant Recruitment Criteria
- **Target Count:** 5 adult women aspirants.
- **Demographic:** Age 21–38, living in Telangana (Hyderabad, Warangal, Karimnagar, Khammam, or rural districts).
- **Academic Background:** Degree in Statistics, Mathematics, Economics, or Commerce (eligible for MPSO/ASO under Notification 07/G/ES/2026).
- **Language Profile:** Telugu-medium schooling or comfortable reading Telugu academic text; uses English for standard mathematical equations.
- **Device Used:** Her personal Android smartphone.

### 4.2 Moderator Script & Test Protocol (Bilingual)

#### Phase 1: Warm-Up & Briefing (5 Minutes)
> *"నమస్కారం అండీ. MISSION MPSO ప్లాట్‌ఫారమ్ టెస్టింగ్ సెషన్‌కు స్వాగతం. ఈరోజు మేము మిమ్మల్ని పరీక్షించడం లేదు; మా అప్లికేషన్ మీకు ఎంత సులభంగా, స్పష్టంగా అర్థమవుతోందో తెలుసుకోవడానికి మాత్రమే ఈ సెషన్ నిర్వహిస్తున్నాము. మీరు ఎటువంటి సంకోచం లేకుండా మీ ఆలోచనలను స్వేచ్ఛగా పంచుకోవచ్చు. మీకు ఎక్కడైనా కష్టంగా అనిపించినా లేదా అర్థం కాకపోయినా, అది మా సిస్టమ్ లోపమే కానీ మీది కాదు. దయచేసి మీరు ఫోన్ లో చూస్తూ మాట్లాడండి (Think Aloud)."*

#### Phase 2: Scenario Tasks (25 Minutes)

| Task ID | Scenario Given to Participant | Success Criteria | Max Time |
|---|---|---|:---:|
| **TASK-01** | *"మీరు మొదటిసారి ఈ యాప్ ఓపెన్ చేశారు. డెమో స్టూడెంట్ గా లాగిన్ అయ్యి మీ డాష్‌బోర్డ్ కు చేరుకోండి."* | Logs in with 1-click demo button and reaches greeting screen. | 60 sec |
| **TASK-02** | *"ఈరోజు మీరు ఏమి చదువుకోవాలో డాష్‌బోర్డ్ లో చూసి, ఆ పాఠాన్ని ఓపెన్ చేయండి."* | Identifies hero action card and navigates to the lesson reader. | 45 sec |
| **TASK-03** | *"పాఠం చదువుతున్నప్పుడు బేయెస్ సిద్ధాంతం అర్థం కాలేదు. AI ట్యూటర్‌ను సులభంగా వివరించమని అడగండి."* | Taps the quick chip *"సులభంగా వివరించు"* without typing. | 30 sec |
| **TASK-04** | *"ఈ పాఠంపై 3 ప్రాక్టీస్ ప్రశ్నలకు సమాధానాలు రాయండి. వివరణ చదవండి."* | Completes 3 MCQs and reviews green/red explanation feedback. | 180 sec |
| **TASK-05** | *"మీరు గతంలో చేసిన తప్పులను తప్పుల పుస్తకం (Mistake Book) లో చూసి, ఒక ప్రశ్నను మళ్లీ ప్రయత్నించండి."* | Navigates to `/mistakes` and initiates a re-attempt. | 90 sec |
| **TASK-06** | *"ఒక మాక్ టెస్ట్ ఓపెన్ చేసి, 1వ ప్రశ్నను Mark for Review చేసి, పరీక్షను సమర్పించండి."* | Marks question, taps submit, confirms in modal, views score. | 180 sec |

#### Phase 3: Post-Task Assessment & Single Ease Question (SEQ)
After each task, ask:
> *"ఈ పని చేయడం మీకు ఎంత సులభంగా అనిపించింది?"*  
> (1 = చాలా కష్టం ... 7 = చాలా సులభం)

#### Phase 4: Post-Test System Usability Scale (SUS) in Telugu
At the conclusion of the session, the participant completes the standard 10-item SUS questionnaire translated into natural Telugu:

1. నేను ఈ అప్లికేషన్‌ను ప్రతిరోజూ చదువుకోవడానికి తరచుగా ఉపయోగించాలనుకుంటున్నాను. (I would like to use this often)
2. ఈ అప్లికేషన్ అనవసరంగా సంక్లిష్టంగా ఉందనిపించింది. (Unnecessarily complex)
3. ఈ అప్లికేషన్ ఉపయోగించడం చాలా సులభం. (Easy to use)
4. ఈ అప్లికేషన్ వాడటానికి నాకు వేరొకరి సహాయం అవసరమవుతుంది. (Need technical support)
5. ఇందులో వివిధ భాగాలు (పాఠాలు, క్విజ్, రివిజన్) చక్కగా సమన్వయం చేయబడ్డాయి. (Well integrated)
6. ఈ సిస్టమ్‌లో అసమానతలు (Inconsistencies) ఎక్కువగా ఉన్నాయి. (Too much inconsistency)
7. చాలామంది విద్యార్థులు దీనిని చాలా త్వరగా నేర్చుకోగలరని నేను భావిస్తున్నాను. (Learn very quickly)
8. ఈ అప్లికేషన్ ఉపయోగించడం చాలా గందరగోళంగా (Cumbersome) ఉంది. (Very cumbersome)
9. నేను ఈ అప్లికేషన్‌ను ఉపయోగించేటప్పుడు పూర్తి విశ్వాసంతో ఉన్నాను. (Felt very confident)
10. నేను దీనిని ఉపయోగించడం ప్రారంభించే ముందు చాలా విషయాలు నేర్చుకోవాల్సి వచ్చింది. (Needed to learn a lot)

### 4.3 Observer Note-Taking Template

```
[OBSERVER SHEET]
Participant ID: P01 | Date: __________ | Device: ________________
Task ID: _________ | Time on Task: ______ sec | Pass / Fail: [  ]

Observations:
1. Hesitation Points: ____________________________________________________
2. Telugu Phrasing Comprehension: _________________________________________
3. Touch Target Accuracy (Any missed taps?): _____________________________
4. Participant Comments (Verbatim): _______________________________________
5. Single Ease Score (1 to 7): [  ]
```
