-- ========================================================================
-- MISSION MPSO: Autonomous Question Intelligence & Content Ingestion Schema
-- Migration: 20261102_question_intelligence.sql
-- Notification: TGPSC 07/G/ES/2026 (Mandal Planning & Statistical Officer / ASO)
-- ========================================================================

-- 1. Content Sources Registry (Tiered, Compliant Source Catalog)
CREATE TABLE IF NOT EXISTS content_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_category TEXT NOT NULL CHECK (source_category IN (
    'official_commission',
    'state_government',
    'academic_oer',
    'related_government_exam',
    'third_party_reference'
  )),
  trust_tier INTEGER NOT NULL CHECK (trust_tier BETWEEN 1 AND 5),
  license_type TEXT NOT NULL,
  reuse_permissions TEXT NOT NULL CHECK (reuse_permissions IN (
    'full_question_reproduction',
    'metadata_and_citation_only',
    'original_derivation_permitted'
  )),
  crawling_allowed BOOLEAN DEFAULT TRUE,
  scan_frequency TEXT DEFAULT 'daily' CHECK (scan_frequency IN ('daily', 'weekly', 'manual')),
  last_checked_at TIMESTAMPTZ,
  last_modified_at TIMESTAMPTZ,
  etag TEXT,
  content_hash TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for scheduler discovery queries
CREATE INDEX IF NOT EXISTS idx_content_sources_tier_active ON content_sources(trust_tier, is_active);
CREATE INDEX IF NOT EXISTS idx_content_sources_scan ON content_sources(scan_frequency, is_active);

-- 2. Ingestion Jobs (Execution Ledger & Locking)
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('scheduled_cron', 'manual_admin', 'coverage_gap_fill', 'on_demand_url')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  sources_checked INTEGER DEFAULT 0,
  documents_discovered INTEGER DEFAULT 0,
  candidates_extracted INTEGER DEFAULT 0,
  verified_count INTEGER DEFAULT 0,
  published_count INTEGER DEFAULT 0,
  review_required_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  duplicates_detected INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  report_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status_started ON ingestion_jobs(status, started_at DESC);

-- 3. Source Documents (Downloaded or Processed Artifacts)
CREATE TABLE IF NOT EXISTS source_documents (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES content_sources(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  title TEXT NOT NULL,
  publication_date DATE,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content_hash TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'html', 'json', 'csv', 'markdown', 'text')),
  storage_path TEXT,
  license_status TEXT NOT NULL,
  extraction_status TEXT DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'extracted', 'failed', 'quarantined')),
  document_version INTEGER DEFAULT 1,
  raw_snippet TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_source_docs_hash ON source_documents(content_hash);
CREATE INDEX IF NOT EXISTS idx_source_docs_source ON source_documents(source_id);

-- 4. Question Candidates (Staging & Validation Workflow)
CREATE TABLE IF NOT EXISTS question_candidates (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES ingestion_jobs(id) ON DELETE SET NULL,
  document_id TEXT REFERENCES source_documents(id) ON DELETE SET NULL,
  paper_id TEXT NOT NULL CHECK (paper_id IN ('paper_1', 'paper_2')),
  topic_id TEXT REFERENCES syllabus_topics(id),
  subtopic_id TEXT,
  question_text_te TEXT NOT NULL,
  question_text_en TEXT NOT NULL,
  question_math_latex TEXT,
  options JSONB NOT NULL,
  correct_option_id TEXT NOT NULL CHECK (correct_option_id IN ('A', 'B', 'C', 'D')),
  explanation_te TEXT NOT NULL,
  explanation_en TEXT,
  relevant_formula_latex TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  source_category TEXT NOT NULL,
  authenticity JSONB DEFAULT '{}'::jsonb,
  numerical_metadata JSONB,
  validation_status TEXT DEFAULT 'discovered' CHECK (validation_status IN (
    'discovered',
    'extracted',
    'classified',
    'validation_pending',
    'validation_failed',
    'review_required',
    'verified',
    'published',
    'rejected',
    'superseded'
  )),
  validation_flags JSONB DEFAULT '[]'::jsonb,
  duplicate_of_question_id TEXT,
  similarity_score NUMERIC,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_question_candidates_status ON question_candidates(validation_status);
CREATE INDEX IF NOT EXISTS idx_question_candidates_topic ON question_candidates(topic_id, paper_id);
CREATE INDEX IF NOT EXISTS idx_question_candidates_job ON question_candidates(job_id);

-- 5. Question Provenance (Full Lineage & Audit Trail)
CREATE TABLE IF NOT EXISTS question_provenance (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  source_document_id TEXT REFERENCES source_documents(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_tier INTEGER NOT NULL,
  page_number INTEGER,
  raw_excerpt TEXT,
  license_type TEXT NOT NULL,
  attribution_text TEXT NOT NULL,
  imported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provenance_question ON question_provenance(question_id);

-- 6. Question Validations (Layered Verification Audit)
CREATE TABLE IF NOT EXISTS question_validations (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  layer TEXT NOT NULL CHECK (layer IN ('structural', 'mathematical', 'factual', 'semantic')),
  passed BOOLEAN NOT NULL,
  validator_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_validations_question ON question_validations(question_id, layer);

-- 7. Question Translations (Academic Telugu Verification)
CREATE TABLE IF NOT EXISTS question_translations (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('te', 'en')),
  translated_text TEXT NOT NULL,
  translated_explanation TEXT NOT NULL,
  translated_options JSONB NOT NULL,
  terms_preserved JSONB DEFAULT '[]'::jsonb,
  mathematical_notation_intact BOOLEAN DEFAULT TRUE,
  numeric_values_preserved BOOLEAN DEFAULT TRUE,
  validation_status TEXT DEFAULT 'verified' CHECK (validation_status IN ('verified', 'review_needed', 'rejected')),
  validation_notes TEXT,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translations_question ON question_translations(question_id);

-- 8. Ingestion Errors (Fault Analysis & Retry Ledger)
CREATE TABLE IF NOT EXISTS ingestion_errors (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES ingestion_jobs(id) ON DELETE SET NULL,
  source_id TEXT REFERENCES content_sources(id) ON DELETE SET NULL,
  stage TEXT NOT NULL CHECK (stage IN (
    'discovery',
    'fetch',
    'extraction',
    'classification',
    'validation',
    'translation',
    'deduplication',
    'synchronization'
  )),
  error_code TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_errors_stage ON ingestion_errors(stage, timestamp DESC);

-- 9. Syllabus Coverage Intelligence (Topic Health Monitoring)
CREATE TABLE IF NOT EXISTS syllabus_coverage (
  topic_id TEXT PRIMARY KEY REFERENCES syllabus_topics(id) ON DELETE CASCADE,
  paper_id TEXT NOT NULL CHECK (paper_id IN ('paper_1', 'paper_2')),
  unit_number INTEGER NOT NULL,
  unit_title_te TEXT NOT NULL,
  unit_title_en TEXT NOT NULL,
  total_published INTEGER DEFAULT 0,
  authentic_pyq_count INTEGER DEFAULT 0,
  related_exam_count INTEGER DEFAULT 0,
  original_practice_count INTEGER DEFAULT 0,
  easy_count INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  hard_count INTEGER DEFAULT 0,
  numerical_count INTEGER DEFAULT 0,
  telugu_verified_count INTEGER DEFAULT 0,
  pending_review_count INTEGER DEFAULT 0,
  coverage_score NUMERIC DEFAULT 0,
  coverage_health TEXT DEFAULT 'critical_gap' CHECK (coverage_health IN ('good', 'adequate', 'needs_questions', 'critical_gap')),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_syllabus_coverage_paper ON syllabus_coverage(paper_id, coverage_health);

-- 10. Daily Synchronization Reports (Audit & History)
CREATE TABLE IF NOT EXISTS daily_sync_reports (
  id TEXT PRIMARY KEY,
  report_date DATE NOT NULL,
  job_id TEXT REFERENCES ingestion_jobs(id) ON DELETE SET NULL,
  sources_checked_count INTEGER DEFAULT 0,
  changed_documents_count INTEGER DEFAULT 0,
  new_candidates_count INTEGER DEFAULT 0,
  verified_count INTEGER DEFAULT 0,
  published_count INTEGER DEFAULT 0,
  review_required_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  duplicates_detected_count INTEGER DEFAULT 0,
  failed_sources_count INTEGER DEFAULT 0,
  paper1_new_count_by_topic JSONB DEFAULT '{}'::jsonb,
  paper2_new_count_by_topic JSONB DEFAULT '{}'::jsonb,
  source_changes JSONB DEFAULT '[]'::jsonb,
  validation_warnings JSONB DEFAULT '[]'::jsonb,
  actions_required JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_sync_date ON daily_sync_reports(report_date DESC);
