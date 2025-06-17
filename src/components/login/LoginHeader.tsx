
import React from 'react';

interface LoginHeaderProps {
  isSignup: boolean;
}

const LoginHeader = ({ isSignup }: LoginHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
          <img
            src="/lovable-uploads/cf8ad19e-3b28-4dba-948b-4f3b7e0d0c85.png"
            alt="One Stone Capital Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">One Stone Capital</h1>
        <p className="text-gray-600">Client Management System</p>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 space-y-2">
        <p className="text-xs text-gray-400">
          © 2024 One Stone Capital. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Protected by enterprise-grade security
        </p>
      </div>
    </>
  );
};

export default LoginHeader;
