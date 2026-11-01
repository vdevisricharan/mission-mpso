# MISSION MPSO — Deployment & Infrastructure Guide

## 1. Hosting Architecture
MISSION MPSO is engineered for zero-config local development and scalable cloud deployment on **Vercel** with **Supabase PostgreSQL**.

```
[Candidate / Student Browser]
           │
           ▼
[Vercel Edge & Serverless Functions] (Next.js 16 App Router)
           │
           ├─► [Supabase PostgreSQL + RLS] (Data Persistence)
           │
           └─► [Google Gemini / OpenAI] (Optional Cloud AI API)
```

---

## 2. Environment Variables Checklist

Set these variables in Vercel Project Settings or your `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | No | `"MISSION MPSO"` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | `"te"` |
| `DATABASE_URL` | Optional in dev, Yes in prod | Postgres connection string for Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase client anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only administrative key |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for live AI tutoring |
| `OPENAI_API_KEY` | Optional | Alternative OpenAI API key |

---

## 3. Database Migration Steps (Supabase / PostgreSQL)

1. Create a new Supabase Project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and execute the migration file:
   `supabase/migrations/20261101_init_mission_mpso.sql`
4. Copy your Database Connection String (`DATABASE_URL`) and API keys into your Vercel Environment Variables.

---

## 4. Verification Checklist Before Going Live

- [x] Run unit tests: `npm test` (All 22 tests pass)
- [x] Run production build: `npm run build` (Clean compile of all 18 routes)
- [x] Telugu font rendering verified with Noto Sans Telugu Unicode
- [x] KaTeX mathematical typesetting verified on desktop and mobile
- [x] Authoritative timer checked on 150-minute mock tests
- [x] Negative marking warning prominently displayed
- [x] Admin role access protected server-side
