
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export interface RedirectOptions {
  requireAuth?: boolean;
  requireRole?: 'admin' | 'user';
  requireEmailVerified?: boolean;
  requireOnboarded?: boolean;
  redirectTo?: string;
}

export function useAuthRedirect(options: RedirectOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated, 
    isLoading, 
    role, 
    isEmailVerified, 
    isOnboarded,
    user 
  } = useAuth();

  const {
    requireAuth = false,
    requireRole,
    requireEmailVerified = false,
    requireOnboarded = false,
    redirectTo
  } = options;

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const from = location.pathname + location.search;
      navigate('/auth/login', { state: { from }, replace: true });
      return;
    }

    // If user is authenticated but doesn't meet role requirements
    if (requireAuth && isAuthenticated && requireRole) {
      if (role !== requireRole) {
        navigate('/dashboard', { replace: true });
        return;
      }
    }

    // If email verification is required but user hasn't verified
    if (requireAuth && isAuthenticated && requireEmailVerified && !isEmailVerified) {
      navigate('/auth/verify-email', { replace: true });
      return;
    }

    // If onboarding is required but user hasn't completed it
    if (requireAuth && isAuthenticated && requireOnboarded && !isOnboarded) {
      navigate('/onboarding', { replace: true });
      return;
    }

    // If user is authenticated and trying to access auth pages, redirect
    if (isAuthenticated && location.pathname.startsWith('/auth')) {
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
      return;
    }

    // Custom redirect
    if (redirectTo && isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    role,
    isEmailVerified,
    isOnboarded,
    requireAuth,
    requireRole,
    requireEmailVerified,
    requireOnboarded,
    redirectTo,
    navigate,
    location
  ]);

  return {
    isRedirecting: isLoading,
    canAccess: isAuthenticated && 
               (!requireRole || role === requireRole) &&
               (!requireEmailVerified || isEmailVerified) &&
               (!requireOnboarded || isOnboarded)
  };
}
