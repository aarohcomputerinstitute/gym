-- 🏆 GymOS Expert DBMS Fix v2.0
-- This script hardens the multi-tenant isolation and fixes the "Plan Not Saving" issue.

-- 1. Create a robust, non-recursive Gym ID detector
CREATE OR REPLACE FUNCTION get_my_gym_id() 
RETURNS uuid AS $$
  -- We use a subquery that bypasses RLS by being SECURITY DEFINER
  -- This is the "Medical Grade" fix for multi-tenant persistence.
  SELECT gym_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Revamp Membership Plans Policies
-- We separate SELECT and INSERT to ensure absolute precision.
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict Gym Isolation - Plans" ON membership_plans;
DROP POLICY IF EXISTS "Gym Isolation - Plans" ON membership_plans;

-- Policy for Viewing Plans
CREATE POLICY "Plans_Select_Policy" ON membership_plans
FOR SELECT USING (gym_id = get_my_gym_id() OR is_super_admin());

-- Policy for Creating/Updating Plans (Expert Level)
CREATE POLICY "Plans_Admin_Policy" ON membership_plans
FOR ALL 
TO authenticated
USING (gym_id = get_my_gym_id() OR is_super_admin())
WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- 3. Revamp Members Policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict Gym Isolation - Members" ON members;
DROP POLICY IF EXISTS "Gym Isolation - Members" ON members;

CREATE POLICY "Members_Isolation_Policy" ON members
FOR ALL 
TO authenticated
USING (gym_id = get_my_gym_id() OR is_super_admin())
WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- 4. Grant explicit permissions to authenticated users
GRANT ALL ON membership_plans TO authenticated;
GRANT ALL ON members TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON member_subscriptions TO authenticated;

-- ✅ Fix for common "null constraint" issues:
-- Ensure sort_order and is_active have defaults if not provided.
ALTER TABLE membership_plans ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE membership_plans ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE membership_plans ALTER COLUMN registration_fee SET DEFAULT 0;

-- 🏁 Database Hardening Complete.
