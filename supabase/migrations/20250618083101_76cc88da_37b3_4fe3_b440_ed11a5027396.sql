
-- Clear failed login attempts for the admin user
DELETE FROM public.user_login_attempts WHERE email = 'k.shen@onestone.sg';
