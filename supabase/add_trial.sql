-- ============================================================================
-- GymOS SaaS Fix: Add 14-Day Free Trial capability
-- Run this script in your Supabase SQL Editor
-- ============================================================================

-- 1. Add trial_ends_at and selected_plan columns to gyms table
ALTER TABLE public.gyms 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

ALTER TABLE public.gyms 
ADD COLUMN IF NOT EXISTS selected_plan VARCHAR(50);

-- 2. Update existing gyms that are on trial to have a 14-day expiry from today
UPDATE public.gyms 
SET trial_ends_at = NOW() + INTERVAL '14 days'
WHERE status = 'trial' AND trial_ends_at IS NULL;

-- 3. (Optional) Set a default for future inserts just in case it's missed by the app
ALTER TABLE public.gyms 
ALTER COLUMN trial_ends_at SET DEFAULT (NOW() + INTERVAL '14 days');
