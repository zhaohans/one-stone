
-- Fix the critical RLS policy infinite recursion issue
-- First, create a security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create new safe admin policies using the security definer function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.get_current_user_role() = 'admin');

-- Add missing DELETE policy for admins
CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (public.get_current_user_role() = 'admin');
