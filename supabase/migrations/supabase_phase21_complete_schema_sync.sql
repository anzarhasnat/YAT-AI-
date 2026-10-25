-- ============================================================
-- Phase 21: Complete Schema Synchronization & Missing Columns
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. PROFILES Table: Add resume cloud storage URL and original file name
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS resume_name TEXT DEFAULT NULL;

-- 2. INTERVIEWS Table: Add role, avg_score, job_id, and transcript
ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Software Engineer',
  ADD COLUMN IF NOT EXISTS avg_score NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS job_id UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS transcript JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Completed',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS drive_id UUID DEFAULT NULL;

-- 3. PLACEMENT_DRIVES Table: Add missing display & drive tracking fields
ALTER TABLE public.placement_drives
  ADD COLUMN IF NOT EXISTS company TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS drive_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS drive_code TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS enrolled_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS results_published BOOLEAN DEFAULT FALSE;

-- Automatically synchronize company from company_name if present
UPDATE public.placement_drives
SET company = company_name
WHERE (company IS NULL OR company = '') AND company_name IS NOT NULL;

-- 4. JOBS Table: Add missing filter & publish fields
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Engineering',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Remote',
  ADD COLUMN IF NOT EXISTS required_skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS min_score NUMERIC DEFAULT 60,
  ADD COLUMN IF NOT EXISTS results_published BOOLEAN DEFAULT FALSE;

-- 5. RLS Policies: Ensure authenticated users can access and manage their interviews and view drives
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own interviews" ON public.interviews;
CREATE POLICY "Users can manage own interviews"
  ON public.interviews
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can view drives" ON public.placement_drives;
CREATE POLICY "Anyone authenticated can view drives"
  ON public.placement_drives
  FOR SELECT TO authenticated
  USING (true);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can view jobs" ON public.jobs;
CREATE POLICY "Anyone authenticated can view jobs"
  ON public.jobs
  FOR SELECT TO authenticated
  USING (true);
