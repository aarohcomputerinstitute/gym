-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------------------------------------
-- 1. ENUMS (Custom Types)
--------------------------------------------------------------------------------
CREATE TYPE gym_status AS ENUM ('active', 'suspended', 'trial', 'cancelled');
CREATE TYPE user_role AS ENUM ('super_admin', 'owner', 'manager', 'trainer', 'receptionist');
CREATE TYPE member_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE member_status AS ENUM ('active', 'inactive', 'expired', 'frozen');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'frozen', 'cancelled');
CREATE TYPE payment_mode AS ENUM ('cash', 'upi', 'card', 'bank_transfer', 'online');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'refunded', 'partial');
CREATE TYPE checkin_method AS ENUM ('manual', 'qr', 'biometric', 'face');
CREATE TYPE saas_billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE saas_sub_status AS ENUM ('active', 'past_due', 'cancelled', 'trial');
CREATE TYPE saas_invoice_status AS ENUM ('paid', 'pending', 'failed');
CREATE TYPE notification_channel AS ENUM ('in_app', 'sms', 'email', 'whatsapp');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'read');

--------------------------------------------------------------------------------
-- 2. TABLES
--------------------------------------------------------------------------------

-- SaaS Plans (Super Admin)
CREATE TABLE saas_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    max_members INTEGER NOT NULL,
    max_staff INTEGER NOT NULL,
    max_trainers INTEGER NOT NULL,
    features JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    sort_order SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Gyms (Tenants)
CREATE TABLE gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    logo_url TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(3) DEFAULT 'INR',
    gst_number VARCHAR(20),
    status gym_status DEFAULT 'trial',
    trial_ends_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Gyms
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for signup" ON gyms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view their own gym" ON gyms
    FOR SELECT USING (id IN (SELECT gym_id FROM users WHERE id = auth.uid()));

CREATE INDEX idx_gyms_status ON gyms(status);
CREATE INDEX idx_gyms_email ON gyms(email);

-- SaaS Subscriptions
CREATE TABLE saas_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES saas_plans(id),
    billing_cycle saas_billing_cycle NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    razorpay_subscription_id VARCHAR(100),
    status saas_sub_status DEFAULT 'trial',
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_gym_subscription UNIQUE(gym_id)
);

-- SaaS Invoices
CREATE TABLE saas_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES saas_subscriptions(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status saas_invoice_status DEFAULT 'pending',
    razorpay_payment_id VARCHAR(100),
    paid_at TIMESTAMPTZ,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (Staff)
-- Links to auth.users (Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY, -- References auth.users
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'receptionist',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '{}'::jsonb,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_gym_user_email UNIQUE(gym_id, email)
);

CREATE INDEX idx_users_gym_id ON users(gym_id);

-- Trainers (Can be linked to users if they need login)
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    photo_url TEXT,
    specializations TEXT[],
    experience_years INTEGER,
    certification TEXT,
    salary DECIMAL(10,2),
    commission_pct DECIMAL(5,2),
    max_clients INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT true,
    joined_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trainers_gym_id ON trainers(gym_id);

-- Members (Customers)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_code VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    gender member_gender,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    emergency_contact VARCHAR(20),
    address TEXT,
    photo_url TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    source VARCHAR(50),
    referred_by UUID REFERENCES members(id),
    trainer_id UUID REFERENCES trainers(id),
    status member_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_gym_member_code UNIQUE(gym_id, member_code)
);

CREATE INDEX idx_members_gym_id ON members(gym_id);
CREATE INDEX idx_members_phone ON members(gym_id, phone);
CREATE INDEX idx_members_status ON members(gym_id, status);

-- Membership Plans
CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    max_freeze_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plans_gym_id ON membership_plans(gym_id);

-- Member Subscriptions
CREATE TABLE member_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_reason VARCHAR(255),
    status subscription_status DEFAULT 'active',
    frozen_at DATE,
    frozen_days_used INTEGER DEFAULT 0,
    renewed_from UUID REFERENCES member_subscriptions(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subs_gym_member ON member_subscriptions(gym_id, member_id);
CREATE INDEX idx_subs_end_date ON member_subscriptions(gym_id, end_date);
CREATE INDEX idx_subs_status ON member_subscriptions(gym_id, status);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES member_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_mode payment_mode NOT NULL,
    transaction_id VARCHAR(100),
    invoice_number VARCHAR(50),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status payment_status DEFAULT 'paid',
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    received_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    next_installment_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_gym_invoice UNIQUE(gym_id, invoice_number)
);

CREATE INDEX idx_payments_gym_member ON payments(gym_id, member_id);
CREATE INDEX idx_payments_date ON payments(gym_id, payment_date);

-- Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    checkin_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    checkout_time TIMESTAMPTZ,
    checkin_method checkin_method DEFAULT 'manual',
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_attendance_checkin UNIQUE(gym_id, member_id, date, checkin_time)
);

CREATE INDEX idx_attendance_gym_date ON attendance(gym_id, date);
CREATE INDEX idx_attendance_member_date ON attendance(gym_id, member_id, date);

-- Workout Plans
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    goal VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout Exercises
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_of_week SMALLINT CHECK (day_of_week BETWEEN 1 AND 7),
    exercise_name VARCHAR(255) NOT NULL,
    muscle_group VARCHAR(100),
    sets SMALLINT,
    reps VARCHAR(20),
    rest_seconds SMALLINT,
    notes TEXT,
    sort_order SMALLINT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Progress Tracking (Body Measurements)
CREATE TABLE progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,1),
    bmi DECIMAL(4,1),
    body_fat_pct DECIMAL(4,1),
    chest_cm DECIMAL(5,1),
    waist_cm DECIMAL(5,1),
    hips_cm DECIMAL(5,1),
    biceps_cm DECIMAL(5,1),
    thighs_cm DECIMAL(5,1),
    notes TEXT,
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_member_date ON progress_tracking(gym_id, member_id, date);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel NOT NULL,
    status notification_status DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Must specify either user or member, not both
    CHECK ((user_id IS NOT NULL AND member_id IS NULL) OR (user_id IS NULL AND member_id IS NOT NULL))
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

--------------------------------------------------------------------------------
-- 3. UPDATED_AT TRIGGERS
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gyms_updated_at
    BEFORE UPDATE ON gyms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
--------------------------------------------------------------------------------

-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to extract gym_id from JWT with robust fallback to users table
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

-- helper function to check if user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS boolean AS $$
    SELECT (auth.jwt() ->> 'role') = 'super_admin';
$$ LANGUAGE SQL STABLE;

-- Apply robust Isolation Policies to all tenant tables
DROP POLICY IF EXISTS "Gym Isolation - Trainers" ON trainers;
DROP POLICY IF EXISTS "Gym Isolation - Plans" ON membership_plans;
DROP POLICY IF EXISTS "Gym Isolation - Subs" ON member_subscriptions;
DROP POLICY IF EXISTS "Gym Isolation - Payments" ON payments;
DROP POLICY IF EXISTS "Gym Isolation - Attendance" ON attendance;
DROP POLICY IF EXISTS "Gym Isolation - Workout Plans" ON workout_plans;
DROP POLICY IF EXISTS "Gym Isolation - Progress" ON progress_tracking;
DROP POLICY IF EXISTS "Gym Isolation - Notifications" ON notifications;
DROP POLICY IF EXISTS "Gym Isolation - Audit" ON audit_logs;

CREATE POLICY "Gym Isolation - Trainers" ON trainers FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Plans" ON membership_plans FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Subs" ON member_subscriptions FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Payments" ON payments FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Attendance" ON attendance FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Workout Plans" ON workout_plans FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Progress" ON progress_tracking FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Notifications" ON notifications FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());
CREATE POLICY "Gym Isolation - Audit" ON audit_logs FOR ALL USING (gym_id = current_gym_id() OR is_super_admin());

-- Note: In a production setup, we would run similar INSERT/UPDATE/DELETE policies for each table based on the RBAC matrix.
