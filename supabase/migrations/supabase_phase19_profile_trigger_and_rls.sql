-- ============================================================
-- Phase 19 Migration: Fix Profiles RLS & Auto-Profile Trigger
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Create an automatic profile creation trigger on auth.users table
-- This runs with SECURITY DEFINER privileges to bypass RLS during user signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE 
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = '' 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Update RLS INSERT policy on public.profiles table
-- Drop existing insert policies that block insertion
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users or auth" ON public.profiles;
DROP POLICY IF EXISTS "Allow signup insertion" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.profiles;

-- Create policy allowing authenticated users or new signups to insert/upsert their profile record
CREATE POLICY "Allow profile creation on signup"
ON public.profiles FOR INSERT
WITH CHECK (
  auth.uid() = id 
  OR auth.uid() IS NULL
);

-- Ensure UPDATE policy remains intact for profile owners
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Ensure SELECT policy remains public for dashboard access
DROP POLICY IF EXISTS "Public read access on profiles" ON public.profiles;
CREATE POLICY "Public read access on profiles"
ON public.profiles FOR SELECT
USING (true);
