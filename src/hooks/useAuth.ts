
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AuthService from '@/services/AuthService';
import UserService, { UserProfile } from '@/services/UserService';
import SessionService from '@/services/SessionService';
import { toast } from 'sonner';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  isOnboarded: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    role: 'user',
    isAuthenticated: false,
    isLoading: true,
    isEmailVerified: false,
    isOnboarded: false,
  });

  const updateAuthState = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState(prev => ({
        ...prev,
        user: null,
        profile: null,
        session: null,
        role: 'user',
        isAuthenticated: false,
        isEmailVerified: false,
        isOnboarded: false,
        isLoading: false,
      }));
      return;
    }

    try {
      // Fetch user profile and role
      const [profile, role] = await Promise.all([
        UserService.getUserProfile(session.user.id),
        UserService.getUserRole(session.user.id)
      ]);

      if (profile) {
        // Check onboarding status
        const isOnboarded = await UserService.isOnboardingComplete(session.user.id);
        
        setState(prev => ({
          ...prev,
          user: session.user,
          profile,
          session,
          role,
          isAuthenticated: true,
          isEmailVerified: UserService.isEmailVerified(session.user),
          isOnboarded,
          isLoading: false,
        }));

        // Update session activity
        await SessionService.updateSessionActivity(session.access_token);
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        
        if (session) {
          await SessionService.createSession(session);
        }
        
        await updateAuthState(session);
      }
    );

    // Get initial session
    AuthService.getCurrentSession().then(({ session }) => {
      if (mounted) {
        updateAuthState(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, session, error } = await AuthService.login({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        
        if (error.name === 'AccountLocked') {
          toast.error(error.message);
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
        
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      if (user && session) {
        toast.success('Login successful! Welcome back.');
        return true;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error: any) {
      console.error('Login error occurred:', error);
      toast.error('Login failed. Please try again.');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { user, error } = await AuthService.signup({
        email,
        password,
        firstName,
        lastName
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message || 'Signup failed. Please try again.');
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      if (user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        setState(prev => ({ ...prev, isLoading: false }));
        return true;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error: any) {
      console.error('Signup error occurred:', error);
      toast.error('Signup failed. Please try again.');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (state.session) {
        await SessionService.invalidateSession(state.session.access_token);
      }
      
      const { error } = await AuthService.logout();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error('Error logging out');
      } else {
        toast.info('You have been logged out.');
      }
    } catch (error) {
      console.error('Logout error occurred:', error);
      toast.error('Error logging out');
    }
  }, [state.session]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error.message);
        toast.error(error.message || 'Failed to send password reset email.');
        return false;
      }
      
      toast.success('Password reset email sent! Please check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Password reset error occurred:', error);
      toast.error('Failed to send password reset email.');
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await AuthService.updatePassword(password);
      
      if (error) {
        console.error('Password update error:', error.message);
        toast.error(error.message || 'Failed to update password.');
        return false;
      }
      
      toast.success('Password updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Password update error occurred:', error);
      toast.error('Failed to update password.');
      return false;
    }
  }, []);

  const resendVerification = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { error } = await AuthService.resendVerification(email);
      
      if (error) {
        console.error('Resend verification error:', error.message);
        toast.error(error.message || 'Failed to resend verification email.');
        return false;
      }
      
      toast.success('Verification email sent! Please check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Resend verification error occurred:', error);
      toast.error('Failed to resend verification email.');
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const updatedProfile = await UserService.updateUserProfile(state.user.id, updates);
      
      if (updatedProfile) {
        setState(prev => ({
          ...prev,
          profile: updatedProfile,
        }));
        toast.success('Profile updated successfully');
        return true;
      }
      
      toast.error('Failed to update profile');
      return false;
    } catch (error) {
      console.error('Profile update error occurred:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }, [state.user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user) return;

    try {
      const [profile, role] = await Promise.all([
        UserService.getUserProfile(state.user.id),
        UserService.getUserRole(state.user.id)
      ]);

      if (profile) {
        const isOnboarded = await UserService.isOnboardingComplete(state.user.id);
        
        setState(prev => ({
          ...prev,
          profile,
          role,
          isOnboarded,
        }));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user]);

  return {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    resendVerification,
    updateProfile,
    refreshProfile,
  };
}
