
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // If user is authenticated and email is verified, redirect to dashboard
    if (isAuthenticated && isEmailVerified) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    
    // If user is authenticated but email not verified, stay on auth pages
    // to show verification message
  }, [isAuthenticated, isEmailVerified, isLoading, navigate, location]);
};
