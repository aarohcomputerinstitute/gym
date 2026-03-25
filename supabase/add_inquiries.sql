-- 1. Create Inquiry Status Enum
DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('pending', 'visiting', 'follow_up', 'hot', 'joined', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    source TEXT DEFAULT 'Walk-in',
    status inquiry_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Apply Gym Isolation Policy
DROP POLICY IF EXISTS "Gym Isolation - Inquiries" ON inquiries;
CREATE POLICY "Gym Isolation - Inquiries" ON inquiries 
FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());

-- 5. Add triggers for updated_at
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
