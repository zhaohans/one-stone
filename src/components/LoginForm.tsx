
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, signupSchema } from '@/lib/validation';
import { validateAndSanitize, RateLimiter, generateCSRFToken } from '@/lib/security';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHeader from './login/LoginHeader';
import LoginFormFields from './login/LoginFormFields';
import LoginFormToggle from './login/LoginFormToggle';

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

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader isSignup={isSignup} />

        {/* Login/Signup Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {isSignup ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isSignup 
                ? 'Create your secure account to get started' 
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <LoginFormFields
                isSignup={isSignup}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                firstName={firstName}
                lastName={lastName}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                errors={errors}
                csrfToken={csrfToken}
                onInputChange={handleInputChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />

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

            <LoginFormToggle isSignup={isSignup} onToggle={handleToggleMode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
