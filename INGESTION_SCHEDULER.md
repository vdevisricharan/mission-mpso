# MISSION MPSO — Daily Ingestion & Synchronization Scheduler
**Target Examination:** TGPSC MPSO / ASO (Notification 07/G/ES/2026)  
**Schedule:** 06:00 AM IST (`Asia/Kolkata`) daily  
**Execution Environment:** Deployed backend service / Node worker / Supabase pg_cron / Edge Function / API  

---

## 1. Overview & Operational Principles

The Daily Synchronization Scheduler executes **independently of student frontend sessions**. It ensures that every morning at 06:00 AM IST, the question bank is updated with any newly verified examination notices, official answer keys, regional current affairs, and coverage gap reinforcements.

### Critical Rules
- **No In-Memory Timers:** Scheduling is executed via backend cron/workers, never via transient browser `setInterval` or in-memory React loops.
- **Distributed Mutex Lock:** Prevents overlapping scheduled runs or concurrent manual syncs.
- **Zero Fabrication Mandate:** If no qualified new material exists on a given day, the system reports **0 new questions** rather than generating filler or fake news.
- **Idempotency:** Re-running the sync multiple times on the same day will detect existing hashes, skip unchanged sources, and block duplicates without corrupting the question bank.

---

## 2. Daily Workflow Execution

```text
[06:00 AM IST Trigger]
         │
         ▼
1. Acquire Mutex Lock (prevents overlapping jobs)
         │
         ▼
2. Load Approved Source Registry (Tiers 1–5)
         │
         ▼
3. Incremental Fetch (ETag, Last-Modified, SHA-256 Hashes)
   ├── Unchanged sources -> Logged as unchanged & skipped
   └── Modified / New documents -> Extracted to staging
         │
         ▼
4. Process Daily Current Affairs (Telangana & National)
         │
         ▼
5. Coverage Gap Analysis & Targeted Practice Generation
         │
         ▼
6. Deduplication Engine (Level 1: Exact Hash, Level 2: Near-Dup >= 0.85)
         │
         ▼
7. Telugu Academic Translation & Terminology Enforcement
         │
         ▼
8. Multi-Layer Answer Validation (Structural, Math, Factual, Semantic)
         │
         ▼
9. Transactional Publication (Approved candidates -> questions table)
         │
         ▼
10. Recalculate Syllabus Coverage Health (21 units)
         │
         ▼
11. Generate & Persist DailySyncReport
         │
         ▼
12. Release Mutex Lock & Notify Administrator Dashboard
```

---

## 3. How to Trigger and Automate

### Option A: Managed Deployment Cron (Vercel Cron / Supabase pg_cron)
Configure `vercel.json` for 06:00 AM IST (00:30 UTC):

```json
{
  "crons": [
    {
      "path": "/api/pipeline/sync",
      "schedule": "30 0 * * *"
    }
  ]
}
```

### Option B: Administrative Manual Trigger
From the Web App:
1. Navigate to `/admin`.
2. Click **ప్రశ్నల ఇంటెలిజెన్స్ (Question Engine)** tab.
3. Click the **"తక్షణమే సింక్ రన్ చేయండి (Run Daily Sync Now)"** button.

Via HTTP REST API:
```bash
curl -X POST https://your-mpso-domain.com/api/pipeline/sync \
  -H "Content-Type: application/json" \
  -d '{"triggerType": "manual_admin"}'
```

### Option C: CLI Background Worker Script
Run from terminal or container cron:
```bash
npx tsx scripts/run-daily-sync.ts
```

Output:
```text
=================================================================
MISSION MPSO — Question Intelligence & Daily Sync Engine
Exam: TGPSC MPSO / ASO (Notification 07/G/ES/2026)
Execution Time: 2/11/2026, 6:00:00 am IST
=================================================================

✓ Daily Synchronization Completed Successfully!
- Job ID: job_sync_2026-11-02_1793610253258
- Sources Checked: 8
- Candidates Extracted: 5
- Published to Question Bank: 2
- Duplicates Prevented: 3
```

---

## 4. Error Recovery & Health Monitoring

If a specific source fails or returns an HTTP error:
- The scheduler logs an `IngestionErrorRecord` in `ingestion_errors`.
- It executes exponential backoff and continues processing all other sources.
- The failure is explicitly surfaced in the `DailySyncReport` under `failedSourcesCount` and `actionsRequired`.
- The job lock is always released safely in a `finally` block, ensuring subsequent runs are never blocked.
