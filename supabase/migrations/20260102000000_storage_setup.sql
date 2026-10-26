-- ====================================================================
-- SkillProof: Storage Setup for Submission Evidence
-- Private Bucket with Row Level Security (RLS)
-- ====================================================================

-- 1. Create the private storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submission-evidence',
  'submission-evidence',
  false, -- Strictly private (requires signed URLs)
  10485760, -- 10MB file size limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

-- 2. Storage RLS Policies
-- Candidates can upload evidence to their user folder: {candidate_id}/*
DROP POLICY IF EXISTS "Candidates can upload evidence to own folder" ON storage.objects;
CREATE POLICY "Candidates can upload evidence to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'submission-evidence'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Candidates can view/download their own uploaded evidence files
DROP POLICY IF EXISTS "Candidates can read own evidence" ON storage.objects;
CREATE POLICY "Candidates can read own evidence"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'submission-evidence'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authorized Evaluators and Admins can view any submission evidence
DROP POLICY IF EXISTS "Evaluators can read all evidence" ON storage.objects;
CREATE POLICY "Evaluators can read all evidence"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'submission-evidence'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('evaluator', 'admin')
  )
);
