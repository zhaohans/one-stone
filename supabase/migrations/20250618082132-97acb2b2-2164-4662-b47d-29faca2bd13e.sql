
-- Fix the reject_user function to include search_path
CREATE OR REPLACE FUNCTION public.reject_user(user_id_to_reject uuid)
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
    RAISE EXCEPTION 'Only admins can reject users';
  END IF;
  
  -- Update user status to inactive
  UPDATE public.profiles 
  SET status = 'inactive', updated_at = NOW()
  WHERE id = user_id_to_reject AND status = 'pending_approval';
  
  RETURN FOUND;
END;
$$;

-- Fix the handle_new_user function to include search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_first_user BOOLEAN;
  default_status public.user_status;
BEGIN
  -- Check if this is the first user (should be admin)
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) INTO is_first_user;
  
  -- Set default status: first user is active (admin), others need approval
  default_status := CASE WHEN is_first_user THEN 'active'::public.user_status ELSE 'pending_approval'::public.user_status END;
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, email, first_name, last_name, email_confirmed_at, role, status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email_confirmed_at,
    CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'user'::public.app_role END,
    default_status
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role) VALUES (
    NEW.id,
    CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'user'::public.app_role END
  );
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Fix the is_account_locked function to include search_path
CREATE OR REPLACE FUNCTION public.is_account_locked(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  attempt_record RECORD;
BEGIN
  SELECT * INTO attempt_record 
  FROM public.user_login_attempts 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if account is currently locked
  IF attempt_record.locked_until IS NOT NULL AND attempt_record.locked_until > NOW() THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Fix the handle_failed_login function to include search_path
CREATE OR REPLACE FUNCTION public.handle_failed_login(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  current_attempts INTEGER := 0;
  lock_until TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current failed attempts
  SELECT failed_attempts INTO current_attempts
  FROM public.user_login_attempts
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    current_attempts := 0;
  END IF;
  
  current_attempts := current_attempts + 1;
  
  -- Lock account if 5 failed attempts
  IF current_attempts >= 5 THEN
    lock_until := NOW() + INTERVAL '10 minutes';
  END IF;
  
  -- Insert or update login attempts
  INSERT INTO public.user_login_attempts (email, failed_attempts, locked_until, last_attempt, updated_at)
  VALUES (user_email, current_attempts, lock_until, NOW(), NOW())
  ON CONFLICT (email) 
  DO UPDATE SET 
    failed_attempts = current_attempts,
    locked_until = lock_until,
    last_attempt = NOW(),
    updated_at = NOW();
END;
$$;

-- Fix the reset_failed_login_attempts function to include search_path
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.user_login_attempts WHERE email = user_email;
END;
$$;

-- Fix the get_current_user_role function to include search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Fix the is_admin function to include search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Fix the approve_user function to include search_path
CREATE OR REPLACE FUNCTION public.approve_user(user_id_to_approve uuid)
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
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;
  
  -- Update user status to active
  UPDATE public.profiles 
  SET status = 'active', updated_at = NOW()
  WHERE id = user_id_to_approve AND status = 'pending_approval';
  
  RETURN FOUND;
END;
$$;
