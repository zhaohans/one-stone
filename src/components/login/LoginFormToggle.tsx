
import React from 'react';

interface LoginFormToggleProps {
  isSignup: boolean;
  onToggle: () => void;
}

const LoginFormToggle = ({ isSignup, onToggle }: LoginFormToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {isSignup 
          ? 'Already have an account? Sign in' 
          : "Don't have an account? Create one"
        }
      </button>
    </div>
  );
};

export default LoginFormToggle;
