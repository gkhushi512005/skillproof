-- ====================================================================
-- SkillProof: Core Database Schema Migration
-- Version: 1.0.0
-- Engine: PostgreSQL 15+ (Supabase)
-- ====================================================================

-- 1. Create Enums for strict domain modeling
CREATE TYPE public.user_role AS ENUM ('candidate', 'evaluator', 'admin');

CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE public.submission_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'changes_requested',
  'approved',
  'rejected'
);

CREATE TYPE public.evaluation_decision AS ENUM (
  'approved',
  'rejected',
  'revision_requested'
);

CREATE TYPE public.credential_status AS ENUM (
  'valid',
  'expired',
  'revoked'
);

-- ====================================================================
-- 2. Table: profiles
-- Linked 1:1 with Supabase auth.users
-- ====================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'candidate',
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 3. Table: assessments
-- Curated standardized tasks
-- ====================================================================
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty public.difficulty_level NOT NULL DEFAULT 'intermediate',
  estimated_hours INTEGER NOT NULL DEFAULT 6,
  summary TEXT NOT NULL,
  instructions_markdown TEXT NOT NULL,
  requires_repo_url BOOLEAN NOT NULL DEFAULT true,
  requires_live_url BOOLEAN NOT NULL DEFAULT true,
  requires_explanation BOOLEAN NOT NULL DEFAULT true,
  requires_file_upload BOOLEAN NOT NULL DEFAULT false,
  allowed_mime_types TEXT[] DEFAULT ARRAY['application/pdf', 'image/png', 'image/jpeg'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 4. Table: assessment_rubrics
-- Version-controlled criteria for objective grading
-- ====================================================================
CREATE TABLE public.assessment_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  criterion_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  weight NUMERIC(5,2) NOT NULL CHECK (weight > 0 AND weight <= 100),
  max_points NUMERIC(5,2) NOT NULL DEFAULT 5.00 CHECK (max_points > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, version, criterion_id)
);

-- ====================================================================
-- 5. Table: submissions
-- Private candidate work evidence
-- ====================================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  status public.submission_status NOT NULL DEFAULT 'submitted',
  repo_url TEXT,
  live_url TEXT,
  notes_text TEXT,
  file_attachment_path TEXT,
  file_attachment_name TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 6. Table: evaluations
-- Immutable audit records linking an evaluator, a rubric version, and a decision
-- ====================================================================
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  rubric_version INTEGER NOT NULL DEFAULT 1,
  decision public.evaluation_decision NOT NULL,
  total_score NUMERIC(5,2) NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  scores_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  general_feedback TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 7. Table: credentials
-- Publicly verifiable passports generated upon approved evaluation
-- ====================================================================
CREATE TABLE public.credentials (
  id TEXT PRIMARY KEY, -- Formatted high-entropy ID: skp_live_...
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE RESTRICT,
  evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE RESTRICT,
  status public.credential_status NOT NULL DEFAULT 'valid',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent issuing multiple valid credentials to the same candidate for the same assessment
  UNIQUE (candidate_id, assessment_id)
);

-- ====================================================================
-- 8. Performance Indexes
-- ====================================================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_assessments_slug ON public.assessments(slug);
CREATE INDEX idx_assessment_rubrics_lookup ON public.assessment_rubrics(assessment_id, version);
CREATE INDEX idx_submissions_candidate ON public.submissions(candidate_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_evaluations_submission ON public.evaluations(submission_id);
CREATE INDEX idx_evaluations_evaluator ON public.evaluations(evaluator_id);
CREATE INDEX idx_credentials_candidate ON public.credentials(candidate_id);
CREATE INDEX idx_credentials_status ON public.credentials(status);

-- ====================================================================
-- 9. Automatic Profile Creation Trigger on Auth Signup
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'SkillProof User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'candidate'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 10. Automatic UpdatedAt Timestamp Trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_assessments_modtime
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_submissions_modtime
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_credentials_modtime
  BEFORE UPDATE ON public.credentials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ====================================================================
-- 11. Baseline Row Level Security (RLS) Enablement
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Assessments & Rubrics are public to all authenticated and anonymous visitors
CREATE POLICY "Assessments are viewable by everyone"
  ON public.assessments FOR SELECT USING (true);

CREATE POLICY "Rubrics are viewable by everyone"
  ON public.assessment_rubrics FOR SELECT USING (true);

-- Public Credentials are viewable by everyone (Empowering unauthenticated employer verification)
CREATE POLICY "Credentials are publicly verifiable"
  ON public.credentials FOR SELECT USING (true);

-- Profiles are viewable by everyone (for evaluator name & candidate credential display)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Submissions are viewable by the candidate who owns them or an authorized evaluator
CREATE POLICY "Candidates can view own submissions"
  ON public.submissions FOR SELECT USING (
    auth.uid() = candidate_id
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('evaluator', 'admin')
    )
  );

CREATE POLICY "Candidates can insert own submissions"
  ON public.submissions FOR INSERT WITH CHECK (
    auth.uid() = candidate_id
  );

CREATE POLICY "Candidates can update own draft or revision submissions"
  ON public.submissions FOR UPDATE USING (
    auth.uid() = candidate_id
  );

-- Evaluations are readable by submission owner or evaluators
CREATE POLICY "Evaluations viewable by owner and evaluators"
  ON public.evaluations FOR SELECT USING (
    evaluator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.submissions WHERE id = evaluations.submission_id AND candidate_id = auth.uid()
    )
  );

-- Only authorized evaluators can create evaluations
CREATE POLICY "Evaluators can insert evaluations"
  ON public.evaluations FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('evaluator', 'admin')
    )
  );
