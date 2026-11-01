-- MISSION MPSO: PostgreSQL Migration Schema
-- Target Exam: TGPSC MPSO / ASO (Notification 07/G/ES/2026)
-- Date: 2026-11-01

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  display_name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'te' CHECK (language IN ('te', 'en')),
  education_background TEXT,
  statistics_familiarity TEXT DEFAULT 'beginner' CHECK (statistics_familiarity IN ('beginner', 'intermediate', 'comfortable')),
  daily_study_minutes INTEGER DEFAULT 120,
  preferred_study_window TEXT DEFAULT 'morning' CHECK (preferred_study_window IN ('morning', 'afternoon', 'evening', 'flexible')),
  target_exam TEXT DEFAULT 'TGPSC MPSO / ASO 2026-2027',
  enable_voice BOOLEAN DEFAULT FALSE,
  text_size TEXT DEFAULT 'normal' CHECK (text_size IN ('normal', 'large', 'extra-large')),
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  has_completed_diagnostic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Official Exam Configuration
CREATE TABLE IF NOT EXISTS exam_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_number TEXT NOT NULL,
  notification_date DATE NOT NULL,
  recruitment_name_te TEXT NOT NULL,
  recruitment_name_en TEXT NOT NULL,
  authority TEXT NOT NULL,
  online_application_start TIMESTAMPTZ,
  online_application_end TIMESTAMPTZ,
  tentative_exam_month TEXT NOT NULL,
  confirmed_exam_date DATE,
  exam_mode TEXT DEFAULT 'UNKNOWN',
  total_questions INTEGER DEFAULT 300,
  total_marks INTEGER DEFAULT 300,
  negative_marking_policy TEXT DEFAULT 'unconfirmed',
  negative_marking_penalty NUMERIC DEFAULT 0,
  negative_marking_note_te TEXT,
  official_source_url TEXT,
  verification_status TEXT DEFAULT 'verified',
  config_version TEXT DEFAULT '1.0.0',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Syllabus Topics
CREATE TABLE IF NOT EXISTS syllabus_topics (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL CHECK (paper_id IN ('paper_1', 'paper_2')),
  unit_number INTEGER NOT NULL,
  unit_title_te TEXT NOT NULL,
  unit_title_en TEXT NOT NULL,
  topic_number INTEGER NOT NULL,
  title_te TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_te TEXT NOT NULL,
  description_en TEXT NOT NULL,
  official_wording_en TEXT NOT NULL,
  subtopics JSONB DEFAULT '[]'::jsonb,
  difficulty TEXT DEFAULT 'medium',
  estimated_study_hours INTEGER DEFAULT 20,
  weightage_estimated_questions INTEGER DEFAULT 15,
  is_verified_official BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES syllabus_topics(id) ON DELETE CASCADE,
  subtopic_id TEXT,
  title_te TEXT NOT NULL,
  title_en TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 30,
  overview_te TEXT NOT NULL,
  overview_en TEXT,
  key_concepts_te JSONB DEFAULT '[]'::jsonb,
  formulas JSONB DEFAULT '[]'::jsonb,
  worked_examples JSONB DEFAULT '[]'::jsonb,
  common_mistakes_te JSONB DEFAULT '[]'::jsonb,
  summary_points_te JSONB DEFAULT '[]'::jsonb,
  official_syllabus_mapping TEXT,
  source_references JSONB DEFAULT '[]'::jsonb,
  last_verified_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Questions Bank
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL CHECK (paper_id IN ('paper_1', 'paper_2')),
  topic_id TEXT REFERENCES syllabus_topics(id),
  subtopic_id TEXT,
  question_number INTEGER,
  question_text_te TEXT NOT NULL,
  question_text_en TEXT NOT NULL,
  question_math_latex TEXT,
  options JSONB NOT NULL,
  correct_option_id TEXT NOT NULL CHECK (correct_option_id IN ('A', 'B', 'C', 'D')),
  explanation_te TEXT NOT NULL,
  explanation_en TEXT,
  relevant_formula_latex TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_solve_seconds INTEGER DEFAULT 60,
  source_type TEXT NOT NULL,
  source_reference TEXT,
  numerical_metadata JSONB,
  validation_status TEXT DEFAULT 'approved' CHECK (validation_status IN ('draft', 'validation_pending', 'validation_passed', 'review_required', 'approved', 'rejected', 'archived')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Practice & Assessment Sessions
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  paper_id TEXT,
  topic_id TEXT,
  is_timed BOOLEAN DEFAULT FALSE,
  time_limit_seconds INTEGER,
  time_spent_seconds INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  questions JSONB NOT NULL,
  submissions JSONB DEFAULT '{}'::jsonb,
  is_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. Mock Exam Sessions
CREATE TABLE IF NOT EXISTS mock_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mock_type TEXT NOT NULL,
  title_te TEXT NOT NULL,
  title_en TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  negative_marking_enabled BOOLEAN DEFAULT FALSE,
  penalty_per_wrong_answer NUMERIC DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'auto_submitted_expired')),
  questions JSONB NOT NULL,
  question_states JSONB NOT NULL,
  current_question_index INTEGER DEFAULT 0
);

-- 8. Mistake Book (తప్పుల పుస్తకం)
CREATE TABLE IF NOT EXISTS mistake_book (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  student_answer TEXT,
  mistake_category TEXT DEFAULT 'unclassified',
  first_failed_at TIMESTAMPTZ DEFAULT NOW(),
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  review_count INTEGER DEFAULT 1,
  is_resolved BOOLEAN DEFAULT FALSE,
  bookmarked BOOLEAN DEFAULT FALSE,
  student_notes TEXT,
  ai_explanation_te TEXT
);

-- 9. Spaced Repetition Queue
CREATE TABLE IF NOT EXISTS revision_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT DEFAULT 'question',
  reference_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  topic_title_te TEXT NOT NULL,
  paper_id TEXT NOT NULL,
  interval_days INTEGER DEFAULT 1,
  repetition_stage INTEGER DEFAULT 1,
  due_date DATE NOT NULL,
  last_reviewed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  confidence_score INTEGER
);

-- 10. AI Tutoring Conversations & Messages
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT,
  topic_title_te TEXT,
  paper_id TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  summary_te TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Daily Study Plans
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  day_greeting_te TEXT,
  summary_message_te TEXT,
  tasks JSONB NOT NULL,
  total_target_minutes INTEGER DEFAULT 120,
  completed_minutes INTEGER DEFAULT 0,
  is_recalculated BOOLEAN DEFAULT FALSE,
  recalculation_reason_te TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);

-- 12. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  performed_by TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
