-- ============================================================
-- Phase 20: Add resume_url and resume_name to profiles table
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS resume_name TEXT DEFAULT NULL;
