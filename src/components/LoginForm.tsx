
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, Building2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/lib/validation';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; firstName?: string; lastName?: string }>({});
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') formErrors.email = err.message;
          if (err.path[0] === 'password') formErrors.password = err.message;
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors below.');
      return;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    console.log(`Attempting ${isSignup ? 'signup' : 'login'}...`);
    
    let success = false;
    if (isSignup) {
      success = await signup(sanitizedEmail, password, firstName, lastName);
    } else {
      success = await login(sanitizedEmail, password);
    }
    
    if (success && !isSignup) {
      console.log('Login successful, navigating...');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else if (success && isSignup) {
      // For signup, user might need to verify email first
      console.log('Signup successful');
    } else {
      console.log(`${isSignup ? 'Signup' : 'Login'} failed`);
      setPassword('');
    }
  };

  const handleInputChange = (field: 'email' | 'password' | 'firstName' | 'lastName', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
    } else if (field === 'firstName') {
      setFirstName(value);
      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }));
    } else if (field === 'lastName') {
      setLastName(value);
      if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">One Stone Capital</h1>
          <p className="text-gray-600">Client Management System</p>
        </div>

        {/* Login/Signup Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              {isSignup ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isSignup 
                ? 'Create your account to get started' 
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                    autoComplete="email"
                    maxLength={254}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
                {isSignup && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSignup ? 'Creating account...' : 'Signing in...'}</span>
                  </div>
                ) : (
                  isSignup ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setPassword('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isSignup 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Create one"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-400">
            © 2024 One Stone Capital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
