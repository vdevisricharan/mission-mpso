# MISSION MPSO — తెలుగు-మొదటి కృత్రిమ మేధా అభ్యాస వేదిక

> **"One Student. One Mission. One Intelligent Learning Companion."**

**MISSION MPSO** is a production-ready, Telugu-first AI exam preparation progressive web application designed specifically for candidates appearing for the **Telangana Public Service Commission (TGPSC)** recruitment under **Notification 07/G/ES/2026** (Mandal Planning & Statistical Officer / Assistant Statistical Officer).

---

## 📌 Examination Highlights (Official 07/G/ES/2026)

- **Notification No.:** 07/G/ES/2026 (Dated: 28/10/2026)
- **Recruitment:** Mandal Planning & Statistical Officers / Assistant Statistical Officers in Directorate of Economics & Statistics
- **Online Applications:** 30/10/2026 to 27/11/2026 5:00 PM
- **Tentative Exam Schedule:** January 2027
- **Total Vacancies:** 102 Zonal posts (Scale of Pay: Rs. 36,750 - 1,06,990)
- **Paper I:** General Studies & General Abilities — 150 Qs | 150 Marks | 150 Mins
- **Paper II:** Statistics (Degree Level) — 150 Qs | 150 Marks | 150 Mins
- **Combined Total:** 300 Questions | 300 Marks (Bilingual: Telugu & English)
- **Negative Marking:** Unconfirmed in official notification (explicitly labeled as unconfirmed across the platform).

---

## ✨ Core Platform Capabilities

1. **Telugu-First Design System**:
   - Warm ivory palette (`#FAFAF7`), restrained emerald (`#176B5B`), deep charcoal (`#17211E`).
   - Clear typography in `Noto Sans Telugu` and `Inter`, with 3-tier font size toggle (Normal, Large, Extra Large) and min 44x44px touch targets.
2. **Deterministic Mathematical Ground Truth**:
   - Independent statistics calculation engine (`StatisticsValidator`) verifying Mean, Median, Mode, Variance, SD, Coefficient of Variation, Bayes' theorem, Binomial, Poisson, Correlation, Regression, and Index Numbers.
3. **Grounded Telugu AI Tutor with 7 Pedagogical Modes**:
   - బోధించు (Teach Me)
   - సరళంగా వివరించు (Explain Simply)
   - కలిసి సాధిద్దాం (Solve Together - step-by-step guidance)
   - మరో ఉదాహరణ (Give Another Example)
   - అవగాహన పరీక్షించు (Test My Understanding)
   - నా తప్పును వివరించు (Explain My Mistake)
   - సత్వర పునశ్చరణ (Quick Revision)
   - KaTeX mathematical rendering with symbol-by-symbol Telugu explanations.
4. **Adaptive Intelligence & Mastery Tracking**:
   - 6 Mastery tiers (Not Assessed, Beginning, Developing, Practising, Proficient, Strong) requiring multi-question evidence before advancing.
5. **Persistent "తప్పుల పుస్తకం" (Mistake Book) & Spaced Repetition**:
   - Automatically saves every wrong attempt with student answer, correct answer, and misconception classification.
   - Schedules spaced repetition at 1, 3, 7, 14, and 30-day intervals.
6. **Full-Length 150-Question Timed Mock Examination**:
   - Matches official TGPSC specifications with server-authoritative countdown timer, OMR-style palette, mark-for-review, and detailed paper breakdown.
7. **Telugu Voice Learning**:
   - Web Speech Synthesis & Recognition (`te-IN`) with graceful text fallback.
8. **Administrative CMS**:
   - Exam configuration manager, official syllabus manager, question bank management, and AI question review workflow (Draft -> Validated -> Approved/Rejected).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v25 / v20)
- npm 9+

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/your-username/mission-mpso.git
cd mission-mpso

# Install dependencies
npm install

# Run automated tests
npm test

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

The platform includes automated unit tests covering mathematical accuracy, official exam configurations, and evidence-based mastery scoring:

```bash
npm test
```

Build production bundle:
```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js 16 App Router pages and dynamic routes
├── components/           # Accessible UI, layout, math, tutor, practice, mock, and admin
│   ├── admin/            # Administrative CMS and AI Review portal
│   ├── curriculum/       # Topic cards and lesson readers
│   ├── dashboard/        # Student personalized home dashboard
│   ├── layout/           # AppShell, Header, BottomNav, TextSizeProvider
│   ├── math/             # KaTeX MathBlock and MathInline
│   ├── mock/             # Full mock simulator and question palette
│   ├── practice/         # Quiz interface and diagnostic assessment
│   └── tutor/            # AI tutor chat and 7 learning modes
├── lib/
│   ├── adaptive/         # Mastery engine, spaced repetition, daily study planner
│   ├── ai/               # Grounded pedagogical AI tutor engine
│   ├── auth/             # Session management and role-based access
│   ├── curriculum/       # Official 07/G/ES/2026 syllabus and lesson content
│   ├── db/               # Multi-backend persistence layer (JSON / PostgreSQL)
│   ├── numerical/        # Deterministic statistics validator
│   └── questions/        # Verified question bank and diagnostic assessment
└── types/                # Comprehensive TypeScript domain models
```

---

## 📜 Official Disclaimer

*MISSION MPSO is an independent educational platform developed for candidates preparing for the TGPSC MPSO / ASO recruitment. It is not affiliated with, endorsed by, or an official product of the Telangana Public Service Commission (TGPSC). For authoritative updates, official corrigenda, and web notes, candidates must consult the official TGPSC portal: https://websitenew.tgpsc.gov.in/.*
