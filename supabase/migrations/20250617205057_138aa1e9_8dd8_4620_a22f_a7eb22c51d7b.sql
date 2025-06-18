
-- First, let's ensure we have the app_role enum (it may already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END $$;

-- Create onboarding_step enum for tracking completion
CREATE TYPE public.onboarding_step AS ENUM (
    'profile_completion',
    'preferences_setup', 
    'tutorial_completion'
);

-- Create account_lockout table for tracking failed login attempts
CREATE TABLE IF NOT EXISTS public.account_lockouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_failed_attempt TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_onboarding table for tracking onboarding progress
CREATE TABLE IF NOT EXISTS public.user_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    step onboarding_step NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, step)
);

-- Create user_sessions table for enhanced session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for storing user preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for account_lockouts (admin only)
CREATE POLICY "Admins can view all lockouts" ON public.account_lockouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can manage lockouts" ON public.account_lockouts
    FOR ALL USING (true);

-- Create RLS policies for user_onboarding
CREATE POLICY "Users can view own onboarding" ON public.user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON public.user_onboarding
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_lockouts_user_id ON public.account_lockouts(user_id);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_locked_until ON public.account_lockouts(locked_until);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_step ON public.user_onboarding(user_id, step);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);

-- Create function to automatically assign admin role to first user
CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the first user by counting existing profiles
    IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
        -- Insert admin role for the first user
        INSERT INTO public.user_roles (user_id, role, assigned_at)
        VALUES (NEW.id, 'admin', NOW());
    ELSE
        -- Insert regular user role for subsequent users
        INSERT INTO public.user_roles (user_id, role, assigned_at)
        VALUES (NEW.id, 'user', NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign roles when profile is created
DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles;
CREATE TRIGGER on_profile_created_assign_role
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_first_user_admin();

-- Create function to handle account lockouts
CREATE OR REPLACE FUNCTION public.handle_failed_login(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    lockout_record RECORD;
    is_locked BOOLEAN DEFAULT FALSE;
    lockout_until TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user ID from email
    SELECT id INTO user_record FROM public.profiles WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;

    -- Get or create lockout record
    SELECT * INTO lockout_record 
    FROM public.account_lockouts 
    WHERE user_id = user_record.id;

    IF NOT FOUND THEN
        -- Create new lockout record
        INSERT INTO public.account_lockouts (user_id, failed_attempts, last_failed_attempt)
        VALUES (user_record.id, 1, NOW())
        RETURNING * INTO lockout_record;
    ELSE
        -- Update existing record
        UPDATE public.account_lockouts 
        SET 
            failed_attempts = failed_attempts + 1,
            last_failed_attempt = NOW(),
            locked_until = CASE 
                WHEN failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '10 minutes'
                ELSE locked_until
            END,
            updated_at = NOW()
        WHERE user_id = user_record.id
        RETURNING * INTO lockout_record;
    END IF;

    -- Check if account is locked
    IF lockout_record.locked_until IS NOT NULL AND lockout_record.locked_until > NOW() THEN
        is_locked = TRUE;
        lockout_until = lockout_record.locked_until;
    END IF;

    RETURN jsonb_build_object(
        'is_locked', is_locked,
        'failed_attempts', lockout_record.failed_attempts,
        'locked_until', lockout_until,
        'max_attempts', 5
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts(user_email TEXT)
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT id INTO user_record FROM public.profiles WHERE email = user_email;
    
    IF FOUND THEN
        UPDATE public.account_lockouts 
        SET 
            failed_attempts = 0,
            locked_until = NULL,
            updated_at = NOW()
        WHERE user_id = user_record.id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user account is locked
CREATE OR REPLACE FUNCTION public.is_account_locked(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    lockout_record RECORD;
BEGIN
    SELECT id INTO user_record FROM public.profiles WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    SELECT * INTO lockout_record 
    FROM public.account_lockouts 
    WHERE user_id = user_record.id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Check if locked and lock period hasn't expired
    IF lockout_record.locked_until IS NOT NULL AND lockout_record.locked_until > NOW() THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at triggers for all new tables
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at_account_lockouts ON public.account_lockouts;
CREATE TRIGGER set_updated_at_account_lockouts
    BEFORE UPDATE ON public.account_lockouts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_user_onboarding ON public.user_onboarding;
CREATE TRIGGER set_updated_at_user_onboarding
    BEFORE UPDATE ON public.user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_user_sessions ON public.user_sessions;
CREATE TRIGGER set_updated_at_user_sessions
    BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON public.user_preferences;
CREATE TRIGGER set_updated_at_user_preferences
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
