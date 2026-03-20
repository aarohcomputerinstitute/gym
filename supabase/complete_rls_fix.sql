-- ============================================================================
-- GymOS Production-Grade RLS Fix v3.0
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Helper Functions
-- ============================================================================

-- Function to get the gym_id of the currently logged-in user
-- Uses SECURITY DEFINER to bypass RLS when looking up the users table
CREATE OR REPLACE FUNCTION public.get_my_gym_id() 
RETURNS uuid AS $$
  SELECT gym_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if the current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Replace the old broken current_gym_id with the working version
CREATE OR REPLACE FUNCTION public.current_gym_id() 
RETURNS uuid AS $$
  SELECT public.get_my_gym_id();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- STEP 2: Drop ALL existing policies to start clean
-- ============================================================================

-- Users table
DROP POLICY IF EXISTS "Users can view staff in their gym" ON users;
DROP POLICY IF EXISTS "Owners and Managers can insert staff" ON users;
DROP POLICY IF EXISTS "Owners and Managers can update staff" ON users;
DROP POLICY IF EXISTS "Only Owners can delete staff" ON users;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Gym Isolation - Users" ON users;
DROP POLICY IF EXISTS "Users_Isolation_Policy" ON users;

-- Members table
DROP POLICY IF EXISTS "Staff can view members in their gym" ON members;
DROP POLICY IF EXISTS "Staff can insert members" ON members;
DROP POLICY IF EXISTS "Staff can update members" ON members;
DROP POLICY IF EXISTS "Owners and Managers can delete members" ON members;
DROP POLICY IF EXISTS "Gym Isolation - Members" ON members;
DROP POLICY IF EXISTS "Members_Isolation_Policy" ON members;
DROP POLICY IF EXISTS "Strict Gym Isolation - Members" ON members;

-- Membership Plans table
DROP POLICY IF EXISTS "Gym Isolation - Plans" ON membership_plans;
DROP POLICY IF EXISTS "Plans_Isolation_Policy" ON membership_plans;
DROP POLICY IF EXISTS "Plans_Admin_Policy" ON membership_plans;
DROP POLICY IF EXISTS "Plans_Select_Policy" ON membership_plans;
DROP POLICY IF EXISTS "Strict Gym Isolation - Plans" ON membership_plans;

-- Other tenant tables
DROP POLICY IF EXISTS "Gym Isolation - Trainers" ON trainers;
DROP POLICY IF EXISTS "Trainers_Isolation_Policy" ON trainers;
DROP POLICY IF EXISTS "Gym Isolation - Subs" ON member_subscriptions;
DROP POLICY IF EXISTS "Subs_Isolation_Policy" ON member_subscriptions;
DROP POLICY IF EXISTS "Gym Isolation - Payments" ON payments;
DROP POLICY IF EXISTS "Payments_Isolation_Policy" ON payments;
DROP POLICY IF EXISTS "Gym Isolation - Attendance" ON attendance;
DROP POLICY IF EXISTS "Attendance_Isolation_Policy" ON attendance;
DROP POLICY IF EXISTS "Gym Isolation - Workout Plans" ON workout_plans;
DROP POLICY IF EXISTS "WorkoutPlans_Isolation_Policy" ON workout_plans;
DROP POLICY IF EXISTS "Gym Isolation - Progress" ON progress_tracking;
DROP POLICY IF EXISTS "Progress_Isolation_Policy" ON progress_tracking;
DROP POLICY IF EXISTS "Gym Isolation - Notifications" ON notifications;
DROP POLICY IF EXISTS "Notifications_Isolation_Policy" ON notifications;
DROP POLICY IF EXISTS "Gym Isolation - Audit" ON audit_logs;
DROP POLICY IF EXISTS "Audit_Isolation_Policy" ON audit_logs;

-- ============================================================================
-- STEP 3: Enable RLS on all tables
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create proper FOR ALL policies (SELECT + INSERT + UPDATE + DELETE)
-- ============================================================================

-- USERS TABLE: Special handling for signup flow
CREATE POLICY "users_own_profile" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_insert_own" ON users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_gym_select" ON users
  FOR SELECT TO authenticated
  USING (gym_id = get_my_gym_id());

CREATE POLICY "users_gym_modify" ON users
  FOR UPDATE TO authenticated
  USING (gym_id = get_my_gym_id())
  WITH CHECK (gym_id = get_my_gym_id());

CREATE POLICY "users_gym_delete" ON users
  FOR DELETE TO authenticated
  USING (gym_id = get_my_gym_id());

-- MEMBERS TABLE
CREATE POLICY "members_gym_policy" ON members
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- MEMBERSHIP PLANS TABLE
CREATE POLICY "plans_gym_policy" ON membership_plans
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- TRAINERS TABLE
CREATE POLICY "trainers_gym_policy" ON trainers
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- MEMBER SUBSCRIPTIONS TABLE
CREATE POLICY "subs_gym_policy" ON member_subscriptions
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- PAYMENTS TABLE
CREATE POLICY "payments_gym_policy" ON payments
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- ATTENDANCE TABLE
CREATE POLICY "attendance_gym_policy" ON attendance
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- WORKOUT PLANS TABLE
CREATE POLICY "workouts_gym_policy" ON workout_plans
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- PROGRESS TRACKING TABLE
CREATE POLICY "progress_gym_policy" ON progress_tracking
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- NOTIFICATIONS TABLE
CREATE POLICY "notifications_gym_policy" ON notifications
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- AUDIT LOGS TABLE
CREATE POLICY "audit_gym_policy" ON audit_logs
  FOR ALL TO authenticated
  USING (gym_id = get_my_gym_id() OR is_super_admin())
  WITH CHECK (gym_id = get_my_gym_id() OR is_super_admin());

-- ============================================================================
-- STEP 5: Grant permissions to authenticated role
-- ============================================================================
GRANT ALL ON users TO authenticated;
GRANT ALL ON trainers TO authenticated;
GRANT ALL ON members TO authenticated;
GRANT ALL ON membership_plans TO authenticated;
GRANT ALL ON member_subscriptions TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON attendance TO authenticated;
GRANT ALL ON workout_plans TO authenticated;
GRANT ALL ON workout_exercises TO authenticated;
GRANT ALL ON progress_tracking TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON audit_logs TO authenticated;
GRANT ALL ON gyms TO authenticated;

-- ============================================================================
-- STEP 6: Ensure column defaults are set
-- ============================================================================
ALTER TABLE membership_plans ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE membership_plans ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE membership_plans ALTER COLUMN registration_fee SET DEFAULT 0;
ALTER TABLE membership_plans ALTER COLUMN features SET DEFAULT '[]'::jsonb;

-- ============================================================================
-- DONE! Your database is now production-ready.
-- ============================================================================
