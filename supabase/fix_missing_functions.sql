-- 1. Define missing is_super_admin function
CREATE OR REPLACE FUNCTION public.is_super_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Consolidate current_gym_id for consistent access
CREATE OR REPLACE FUNCTION public.current_gym_id() 
RETURNS uuid AS $$
DECLARE
  _gym_id uuid;
BEGIN
  -- Try to get from JWT claims (fastest)
  _gym_id := (auth.jwt() ->> 'gym_id')::uuid;
  
  -- Fallback: Lookup in users table if JWT doesn't have it
  IF _gym_id IS NULL THEN
    SELECT gym_id INTO _gym_id 
    FROM public.users 
    WHERE id = auth.uid();
  END IF;
  
  RETURN _gym_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Re-apply RLS policies for Membership Plans
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Plans_Admin_Policy" ON membership_plans;
DROP POLICY IF EXISTS "Plans_Select_Policy" ON membership_plans;
DROP POLICY IF EXISTS "Strict Gym Isolation - Plans" ON membership_plans;
DROP POLICY IF EXISTS "Gym Isolation - Plans" ON membership_plans;

CREATE POLICY "Plans_Isolation_Policy" ON membership_plans
FOR ALL 
TO authenticated
USING (gym_id = current_gym_id() OR is_super_admin())
WITH CHECK (gym_id = current_gym_id() OR is_super_admin());

-- 4. Re-apply RLS policies for Members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members_Isolation_Policy" ON members;
DROP POLICY IF EXISTS "Strict Gym Isolation - Members" ON members;
DROP POLICY IF EXISTS "Gym Isolation - Members" ON members;

CREATE POLICY "Members_Isolation_Policy" ON members
FOR ALL 
TO authenticated
USING (gym_id = current_gym_id() OR is_super_admin())
WITH CHECK (gym_id = current_gym_id() OR is_super_admin());
