import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, signupSchema } from '@/lib/validation';
import { validateAndSanitize, RateLimiter, generateCSRFToken } from '@/lib/security';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';

const loginRateLimiter = new RateLimiter(5, 900000); // 5 attempts per 15 minutes

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    firstName?: string; 
    lastName?: string;
    general?: string;
  }>({});
  
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate CSRF token on component mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, [isSignup]);

  const validateForm = (): boolean => {
    try {
      if (isSignup) {
        const sanitizedData = {
          email: validateAndSanitize.email(email),
          password: password,
          confirmPassword: confirmPassword,
          firstName: firstName ? validateAndSanitize.name(firstName) : undefined,
          lastName: lastName ? validateAndSanitize.name(lastName) : undefined,
        };
        signupSchema.parse(sanitizedData);
      } else {
        const sanitizedData = {
          email: validateAndSanitize.email(email),
          password: password,
        };
        loginSchema.parse(sanitizedData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: typeof errors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof errors;
          if (field in formErrors) {
            formErrors[field] = err.message;
          }
        });
        setErrors(formErrors);
      } else {
        setErrors({ general: 'Validation failed. Please check your input.' });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientIP = 'user'; // In production, you'd get the actual IP
    if (!loginRateLimiter.isAllowed(clientIP)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(clientIP) / 60000);
      toast.error(`Too many attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors below.');
      return;
    }

    // Validate CSRF token exists
    if (!csrfToken) {
      toast.error('Security error. Please refresh the page.');
      return;
    }

    try {
      const sanitizedEmail = validateAndSanitize.email(email);
      
      let success = false;
      if (isSignup) {
        const sanitizedFirstName = firstName ? validateAndSanitize.name(firstName) : '';
        const sanitizedLastName = lastName ? validateAndSanitize.name(lastName) : '';
        success = await signup(sanitizedEmail, password, sanitizedFirstName, sanitizedLastName);
      } else {
        success = await login(sanitizedEmail, password);
      }
      
      if (success && !isSignup) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else if (success && isSignup) {
        // Clear form for security
        setPassword('');
        setConfirmPassword('');
      } else {
        // Clear sensitive data on failure
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setPassword('');
      setConfirmPassword('');
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update state based on field
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
    }
  };

  return (
    <div className="min-h-screen gradient-bg-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with animated logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-bg rounded-xl mb-4 shadow-xl logo-pulse relative overflow-hidden">
            <img 
              src="/lovable-uploads/4e7c829c-3064-46fd-82e5-5e44ed5b6be6.png" 
              alt="One Stone Capital Logo" 
              className="w-16 h-16 object-contain filter brightness-0 invert"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform rotate-45 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">One Stone Capital</h1>
          <p className="text-gray-600 font-medium">Client Management System</p>
        </div>

        {/* Login/Signup Card with enhanced styling */}
        <Card className="shadow-2xl border border-orange-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              {isSignup ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isSignup 
                ? 'Create your secure account to get started' 
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CSRF Token (hidden) */}
              <input type="hidden" name="csrf_token" value={csrfToken} />
              
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`pl-10 h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 ${
                          errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        maxLength={50}
                        autoComplete="given-name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`pl-10 h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 ${
                          errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        maxLength={50}
                        autoComplete="family-name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 ${
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
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-orange-400 hover:text-orange-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
                {isSignup && (
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>Password must be at least 12 characters and include:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>Uppercase letter</li>
                      <li>Lowercase letter</li>
                      <li>Number</li>
                      <li>Special character</li>
                    </ul>
                  </div>
                )}
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                      autoComplete="new-password"
                      maxLength={128}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-orange-400 hover:text-orange-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-500 border-orange-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 gradient-bg text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
                  setConfirmPassword('');
                  setFirstName('');
                  setLastName('');
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
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
          <p className="text-xs text-gray-500">
            © 2024 One Stone Capital. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
