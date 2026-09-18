-- Phase 18: Saved Resumes Table & RLS Policies
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    raw_text TEXT,
    parsed_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Drop policy if already exists to prevent duplicate policy errors
DROP POLICY IF EXISTS "Users can manage own resume" ON public.resumes;

-- Allow authenticated candidates to view, insert, and update their own resume
CREATE POLICY "Users can manage own resume"
ON public.resumes
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
