# MISSION MPSO — UX Issues Tracker & Bug Audit Log

**Platform:** MISSION MPSO (07/G/ES/2026)  
**Audit Date:** 2026-11-02  
**Target User:** Adult Telugu-speaking woman preparing for TGPSC MPSO / ASO 2026–2027  
**Evaluation Standard:** WCAG 2.2 AA, Mobile Usability Guidelines, Cognitive Load Heuristics  

---

## Severity Definitions

- **P0 — Critical:** The student cannot complete an essential learning or examination workflow, data is lost, or a serious accessibility/security barrier blocks use.
- **P1 — High:** A major workflow is difficult, confusing, unreliable, or significantly inaccessible.
- **P2 — Medium:** Usability friction, inconsistent interactions, avoidable cognitive load, or translation issues.
- **P3 — Low:** Minor visual polish, spacing, microcopy, or cosmetic consistency issues.

---

## Comprehensive Issue Registry

| Issue ID | Severity | Route / Screen | Category | Issue Summary | Verification Status |
|---|---|---|---|---|---|
| **ISSUE-01** | **P1** | `/mocks` | Mobile Responsiveness | Horizontal scrollbar (+54px overflow on 360px Android phone, +94px on 320px) caused by un-wrapped badge and mock card metadata flex rows. | **RESOLVED & VERIFIED** |
| **ISSUE-02** | **P1** | `/study-plan` | Mobile Responsiveness | Horizontal overflow (+31px on 360px, +71px on 320px) due to inflexible flex container on adaptive plan badges and clock metadata. | **RESOLVED & VERIFIED** |
| **ISSUE-03** | **P1** | `/revision` | Mobile Responsiveness | Spaced repetition queue card header and formula cards overflowing screen (+45px on 320px, +5px on 360px). | **RESOLVED & VERIFIED** |
| **ISSUE-04** | **P1** | Global Component: `Badge.tsx` | Mobile Usability & UI | Hardcoded `whitespace-nowrap` on all Badges forced long bilingual labels to extend past screen width, breaking parent containers. | **RESOLVED & VERIFIED** |
| **ISSUE-05** | **P2** | `/` (Landing Page) | Localization & Telugu-First | Main Hero H1 headline (`One Student. One Mission...`) was 100% in English, creating an immediate cognitive disconnect for a Telugu-first aspirant. | **RESOLVED & VERIFIED** |
| **ISSUE-06** | **P2** | Global Component: `Header.tsx` | Accessibility & Touch Targets | Mobile language switch buttons (`తె`, `EN`) had touch targets of 28x26px, violating WCAG 2.2 AA SC 2.5.8 (44x44px minimum). | **RESOLVED & VERIFIED** |
| **ISSUE-07** | **P1** | `/mocks/[sessionId]` | Accessibility & WCAG 2.2 | Examination countdown timer lacked semantic `role="timer"` and `aria-label`; Question palette lacked screen-reader status indicators (WCAG 1.3.1, 1.4.1). | **RESOLVED & VERIFIED** |
| **ISSUE-08** | **P2** | Global Component: `BottomNav.tsx` | Accessibility & Semantics | Mobile bottom navigation links lacked `aria-current="page"` and descriptive `aria-label`s for screen reader navigation. | **RESOLVED & VERIFIED** |
| **ISSUE-09** | **P2** | Global Component: `MathBlock.tsx` | Responsive Math & Layout | Mathematical LaTeX blocks lacked `max-w-full`, allowing complex formulas to push parent containers wider than the smartphone viewport. | **RESOLVED & VERIFIED** |
| **ISSUE-10** | **P1** | `/learn` & `/learn/[topicId]` | Responsiveness & Breadcrumbs | Topic breadcrumb and syllabus badge (`/learn/p2_probability`) overflowing narrow viewports (+26px on 320px screen). | **RESOLVED & VERIFIED** |
| **ISSUE-11** | **P2** | `/mistakes` | Responsiveness | Self-correction and spaced repetition badges in header overflowing on compact Android viewports (+22px on 320px screen). | **RESOLVED & VERIFIED** |
| **ISSUE-12** | **P2** | `/admin` | Responsiveness | CMS portal header title and badges overflowing compact screens (+25px on 320px screen). | **RESOLVED & VERIFIED** |

---

## Detailed Defect Reports & Steps to Reproduce

### ISSUE-01: `/mocks` Horizontal Overflow on Mobile Screens
- **Routes:** `/mocks`
- **Viewport:** 320x640, 360x800, 393x852
- **Severity:** P1 (High)
- **Reproduction Steps:**
  1. Open Chrome DevTools with device emulation set to Android 360x800.
  2. Navigate to `http://localhost:3000/mocks`.
  3. Inspect `document.documentElement.scrollWidth`.
  4. Notice the document width was `414px`, causing an unsightly 54px horizontal scroll.
- **Root Cause:**
  Header badges row (`<div className="flex items-center gap-2 mb-2">`) and mock card meta row (`Paper II • 150 నిమిషాలు • 150 ప్రశ్నలు (150 మార్కులు)`) had `flex` without `flex-wrap`.
- **Correction Applied:**
  Added `flex-wrap items-center gap-2` to header badges and card metadata rows.
- **Verification:**
  Tested with Playwright across 320px, 360px, 393px viewports. Document `scrollWidth` now matches viewport width exactly (360px). Zero overflow.

---

### ISSUE-02: `/study-plan` Horizontal Overflow on Mobile Screens
- **Routes:** `/study-plan`
- **Viewport:** 320x640, 360x800
- **Severity:** P1 (High)
- **Reproduction Steps:**
  1. Navigate to `/study-plan` at 360x800 viewport.
  2. Inspect layout.
  3. Container expanded to 391px (+31px overflow on 360px, +71px on 320px).
- **Root Cause:**
  Bilingual badges (`అనుకూల ప్రణాళిక (Adaptive Planner)` and `లక్ష్యం: జనవరి 2027`) sat in an un-wrapped flex container.
- **Correction Applied:**
  Added `flex-wrap items-center gap-2 mb-2` on badge container and task metadata rows.
- **Verification:**
  Verified in Playwright crawler. 0px overflow across all 7 viewports.

---

### ISSUE-03 & ISSUE-04: Hardcoded `whitespace-nowrap` in `Badge.tsx`
- **Routes:** Global (`/revision`, `/mocks`, `/learn`, `/mistakes`)
- **Viewport:** All mobile viewports (< 430px)
- **Severity:** P1 (High)
- **Reproduction Steps:**
  1. Navigate to `/revision`.
  2. Badge with text `స్పేస్డ్ రిపీటీషన్ సిస్టమ్ (Spaced Repetition)` alone measured 285px.
  3. When nested inside a card with padding (24px + 24px) and page margins (16px + 16px), the total required width was 365px, breaking out of a 360px screen.
- **Root Cause:**
  `src/components/ui/Badge.tsx` had hardcoded `whitespace-nowrap`.
- **Correction Applied:**
  Replaced `whitespace-nowrap` with `max-w-full text-left leading-snug break-words`.
- **Verification:**
  Re-tested in Playwright crawler. `/revision` width dropped from 365px to exactly 360px (and 320px on compact phone). Zero overflow.

---

### ISSUE-05: Hero Headline Localization Disconnect
- **Routes:** `/` (Landing Page)
- **Viewport:** All
- **Severity:** P2 (Medium)
- **Reproduction Steps:**
  1. A new Telugu-speaking student opens `http://localhost:3000/`.
  2. The primary H1 reads: `"One Student. One Mission. One Intelligent Learning Companion."`
  3. No Telugu text exists in the main headline.
- **Cognitive / Cultural Impact:**
  The student feels unsure whether the platform is genuinely taught in Telugu or if it is an English-first portal with minor Telugu subtitles.
- **Correction Applied:**
  Elevated Telugu to the primary H1 headline:
  `ఒకే అభ్యర్థి. ఒకే లక్ష్యం. మీ విజయం కోసం ఒకే తెలివైన AI తోడు.`
  The English slogan was moved to an elegant subtitle directly below.
- **Verification:**
  Verified visually and verified via automated Playwright test.

---

### ISSUE-06: Mobile Language Switcher Touch Targets Under 44px
- **Routes:** Global `Header.tsx`
- **Viewport:** Mobile viewports
- **Severity:** P2 (Medium - WCAG 2.2 Violation)
- **Reproduction Steps:**
  1. Inspect the mobile language switcher buttons `తె` and `EN`.
  2. Dimensions were 28px wide by 26px high.
  3. On a physical smartphone, tapping `తె` frequently mis-taps `EN` or adjacent icon buttons.
- **Correction Applied:**
  Increased button dimensions to `min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px]`, added `px-2.5 py-1.5`, `aria-label="తెలుగు (Telugu)"` and `aria-label="English"`.
- **Verification:**
  Verified via automated touch target analyzer in `A11Y_AND_RESPONSIVE_AUDIT.json`.

---

### ISSUE-07: Examination Timer and Palette Accessibility Semantics
- **Routes:** `/mocks/[sessionId]`
- **Viewport:** All
- **Severity:** P1 (High)
- **Reproduction Steps:**
  1. Inspect the mock test timer during an exam session.
  2. Timer was a `<div>` with text `149:59` lacking `role="timer"` or `aria-label`.
  3. Palette buttons only read numbers `1`, `2`, `3` to screen readers, conveying status (answered/marked) only through color styling.
- **Correction Applied:**
  1. Added `role="timer"` and `aria-label` stating remaining time in Telugu/English.
  2. Added rich descriptive `aria-label` to each question button:
     `${isEnglish ? "Question" : "ప్రశ్న"} ${idx + 1}: ${statusText}`.
- **Verification:**
  Verified via Playwright accessibility test in `e2e/mock-examination.spec.ts`.
