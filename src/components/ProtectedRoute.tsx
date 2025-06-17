
import React from 'react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  requireEmailVerified?: boolean;
  requireOnboarded?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  requireEmailVerified = false,
  requireOnboarded = false
}: ProtectedRouteProps) => {
  const { isRedirecting, canAccess } = useAuthRedirect({
    requireAuth: true,
    requireRole: requiredRole,
    requireEmailVerified,
    requireOnboarded,
  });

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show children if user has access
  if (canAccess) {
    return <>{children}</>;
  }

  // This should not be reached due to redirects, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
