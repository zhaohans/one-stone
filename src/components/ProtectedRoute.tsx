
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const { isAuthenticated, isEmailVerified, isApproved, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to login if email not verified
  if (!isEmailVerified) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Show pending approval message if not approved
  if (!isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your account is pending approval. Please wait for an administrator to approve your account before you can access the system.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
