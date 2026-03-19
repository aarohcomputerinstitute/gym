-- 🛠️ Fix for Gym ID extraction in RLS
-- This replaces the fragile JWT-only check with a robust fallback to the users table.

CREATE OR REPLACE FUNCTION current_gym_id() RETURNS uuid AS $$
DECLARE
  _gym_id uuid;
BEGIN
  -- 1. Try to get from JWT claims (fastest)
  _gym_id := (auth.jwt() ->> 'gym_id')::uuid;
  
  -- 2. Fallback: Lookup in users table if JWT doesn't have it
  IF _gym_id IS NULL THEN
    SELECT gym_id INTO _gym_id 
    FROM public.users 
    WHERE id = auth.uid();
  END IF;
  
  RETURN _gym_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Confirm RLS is enabled on membership_plans
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

-- Re-apply the Strict Isolation Policy for Plans
DROP POLICY IF EXISTS "Strict Gym Isolation - Plans" ON membership_plans;
DROP POLICY IF EXISTS "Gym Isolation - Plans" ON membership_plans;

CREATE POLICY "Strict Gym Isolation - Plans" ON membership_plans
FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());

-- Re-apply for Members as well to be safe
DROP POLICY IF EXISTS "Strict Gym Isolation - Members" ON members;
CREATE POLICY "Strict Gym Isolation - Members" ON members
FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
