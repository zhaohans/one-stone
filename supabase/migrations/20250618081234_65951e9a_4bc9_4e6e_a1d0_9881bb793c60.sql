
-- Update the user_status enum to include 'pending_approval' status
ALTER TYPE public.user_status ADD VALUE 'pending_approval';

-- Update the handle_new_user function to set new users as pending approval by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to approve user
CREATE OR REPLACE FUNCTION public.approve_user(user_id_to_approve UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reject user
CREATE OR REPLACE FUNCTION public.reject_user(user_id_to_reject UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
