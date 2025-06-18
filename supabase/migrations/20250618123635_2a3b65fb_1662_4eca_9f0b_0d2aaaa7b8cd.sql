
-- Phase 1: Fix email verification and sync issues

-- Create function to sync email verification status between auth.users and profiles
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update profiles table to match auth.users email_confirmed_at status
  UPDATE public.profiles 
  SET email_confirmed_at = auth_users.email_confirmed_at,
      updated_at = NOW()
  FROM auth.users AS auth_users
  WHERE profiles.id = auth_users.id
    AND profiles.email_confirmed_at IS DISTINCT FROM auth_users.email_confirmed_at;
END;
$$;

-- Create function to manually verify a user's email (for admin use)
CREATE OR REPLACE FUNCTION public.admin_verify_user_email(user_id_to_verify uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  current_user_role public.app_role;
BEGIN
  -- Check if current user is admin
  SELECT role INTO current_user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can manually verify user emails';
  END IF;
  
  -- Update profile email_confirmed_at
  UPDATE public.profiles 
  SET email_confirmed_at = NOW(),
      updated_at = NOW()
  WHERE id = user_id_to_verify;
  
  RETURN FOUND;
END;
$$;

-- Add missing RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Improve the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_first_user BOOLEAN;
  default_status public.user_status;
  user_role public.app_role;
BEGIN
  -- Check if this is the first user (should be admin)
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) INTO is_first_user;
  
  -- Set default values based on whether this is first user
  IF is_first_user THEN
    default_status := 'active'::public.user_status;
    user_role := 'admin'::public.app_role;
  ELSE
    default_status := 'pending_approval'::public.user_status;
    user_role := 'user'::public.app_role;
  END IF;
  
  -- Insert into profiles table with better error handling
  INSERT INTO public.profiles (
    id, email, first_name, last_name, email_confirmed_at, role, status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email_confirmed_at,
    user_role,
    default_status
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = NOW();
  
  -- Insert into user_roles table with conflict handling
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Insert default preferences with conflict handling
  INSERT INTO public.user_preferences (user_id) 
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create function to get comprehensive user status
CREATE OR REPLACE FUNCTION public.get_user_auth_status(user_id_param uuid)
RETURNS TABLE (
  is_email_verified boolean,
  is_approved boolean,
  is_onboarded boolean,
  user_role public.app_role,
  user_status public.user_status
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (p.email_confirmed_at IS NOT NULL) as is_email_verified,
    (p.status = 'active') as is_approved,
    (EXISTS(SELECT 1 FROM public.user_onboarding uo WHERE uo.user_id = user_id_param AND uo.completed_at IS NOT NULL)) as is_onboarded,
    COALESCE(ur.role, 'user'::public.app_role) as user_role,
    COALESCE(p.status, 'inactive'::public.user_status) as user_status
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE p.id = user_id_param;
END;
$$;

-- Run the sync function to fix existing data
SELECT public.sync_email_verification();

-- Clean up any orphaned login attempts older than 24 hours
DELETE FROM public.user_login_attempts 
WHERE created_at < NOW() - INTERVAL '24 hours' 
  AND (locked_until IS NULL OR locked_until < NOW());
