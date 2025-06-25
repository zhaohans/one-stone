
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SimpleAuthContext';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // Reset redirect flag when loading completes
    if (!isLoading) {
      hasRedirected.current = false;
    }

    // If user is authenticated and email is verified, redirect to dashboard
    if (isAuthenticated && isEmailVerified && !hasRedirected.current) {
      hasRedirected.current = true;
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isEmailVerified, isLoading, navigate, location]);
};
