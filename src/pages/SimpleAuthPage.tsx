
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SimpleLoginForm from '@/components/auth/SimpleLoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">OSC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">One Stone Capital</h1>
          <p className="text-gray-600 mt-2">Investment Management Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
};

const SimpleAuthPage = () => {
  useAuthRedirect(); // This will redirect authenticated users to dashboard

  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" element={<SimpleLoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthLayout>
  );
};

export default SimpleAuthPage;
