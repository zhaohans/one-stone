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
  isApproved: boolean;
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
    isApproved: false,
  });

  const updateAuthState = useCallback(async (session: Session | null) => {
    console.log('🔄 updateAuthState called with session:', session?.user?.id || 'null');
    
    if (!session?.user) {
      console.log('❌ No session or user, clearing auth state');
      setState(prev => ({
        ...prev,
        user: null,
        profile: null,
        session: null,
        role: 'user',
        isAuthenticated: false,
        isEmailVerified: false,
        isOnboarded: false,
        isApproved: false,
        isLoading: false,
      }));
      return;
    }

    try {
      console.log('🔍 Fetching user profile and role for user:', session.user.id);
      
      // Fetch user profile and role
      const [profile, role] = await Promise.all([
        UserService.getUserProfile(session.user.id),
        UserService.getUserRole(session.user.id)
      ]);

      console.log('📊 Profile fetched:', profile ? 'Found' : 'Not found');
      console.log('👤 Role fetched:', role);

      if (profile) {
        // Check onboarding status
        console.log('🎯 Checking onboarding status...');
        const isOnboarded = await UserService.isOnboardingComplete(session.user.id);
        const isApproved = profile.status === 'active';
        
        console.log('✅ Onboarded:', isOnboarded);
        console.log('✅ Approved:', isApproved);
        
        setState(prev => ({
          ...prev,
          user: session.user,
          profile,
          session,
          role,
          isAuthenticated: true,
          isEmailVerified: UserService.isEmailVerified(session.user),
          isOnboarded,
          isApproved,
          isLoading: false,
        }));

        console.log('🎉 Auth state updated successfully');

        // Update session activity only if user is approved
        if (isApproved) {
          console.log('📝 Updating session activity...');
          await SessionService.updateSessionActivity(session.access_token);
        }
      } else {
        console.log('❌ No profile found for user, creating one...');
        
        // If no profile exists, create a minimal one to prevent infinite loading
        const newProfile: Partial<UserProfile> = {
          id: session.user.id,
          email: session.user.email || '',
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          role: 'user',
          status: 'active',
          email_confirmed_at: session.user.email_confirmed_at || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Try to create the profile
        try {
          const createdProfile = await UserService.updateUserProfile(session.user.id, newProfile);
          if (createdProfile) {
            console.log('✅ Profile created successfully');
            setState(prev => ({
              ...prev,
              user: session.user,
              profile: createdProfile,
              session,
              role: 'user',
              isAuthenticated: true,
              isEmailVerified: UserService.isEmailVerified(session.user),
              isOnboarded: false,
              isApproved: true,
              isLoading: false,
            }));
          } else {
            throw new Error('Failed to create profile');
          }
        } catch (profileError) {
          console.error('❌ Failed to create profile:', profileError);
          // Even if profile creation fails, don't leave user in loading state
          setState(prev => ({
            ...prev,
            user: session.user,
            profile: null,
            session,
            role: 'user',
            isAuthenticated: true,
            isEmailVerified: UserService.isEmailVerified(session.user),
            isOnboarded: false,
            isApproved: false,
            isLoading: false,
          }));
        }
      }
    } catch (error) {
      console.error('❌ Error updating auth state:', error);
      // Don't leave user stuck in loading state even on error
      setState(prev => ({
        ...prev,
        user: session.user,
        profile: null,
        session,
        role: 'user',
        isAuthenticated: true,
        isEmailVerified: UserService.isEmailVerified(session.user),
        isOnboarded: false,
        isApproved: false,
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    console.log('🚀 Auth hook initializing...');

    // Set up auth state listener
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 Auth state changed:', event);
        
        if (session) {
          console.log('📝 Creating session...');
          await SessionService.createSession(session);
        }
        
        await updateAuthState(session);
      }
    );

    // Get initial session
    console.log('🔍 Getting initial session...');
    AuthService.getCurrentSession().then(({ session }) => {
      if (mounted) {
        console.log('📋 Initial session:', session?.user?.id || 'null');
        updateAuthState(session);
      }
    }).catch(error => {
      console.error('❌ Error getting initial session:', error);
      if (mounted) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth hook...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('🔑 Login function called');
    
    try {
      const { user, session, error } = await AuthService.login({ email, password });

      if (error) {
        console.error('❌ Login error:', error.message);
        
        if (error.name === 'AccountLocked') {
          toast.error(error.message);
        } else if (error.name === 'PendingApproval') {
          toast.warning(error.message);
        } else if (error.name === 'AccountDeactivated') {
          toast.error(error.message);
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
        
        return false;
      }

      if (user && session) {
        console.log('✅ Login successful');
        toast.success('Login successful! Welcome back.');
        return true;
      }

      console.log('⚠️ No user or session returned from login');
      return false;
    } catch (error: any) {
      console.error('💥 Login error occurred:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  }, []);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<boolean> => {
    console.log('🔥 Signup function called');

    try {
      const { user, error } = await AuthService.signup({
        email,
        password,
        firstName,
        lastName
      });

      console.log('📊 Signup response:', { user: user?.id || 'null', error: error?.message || 'none' });

      if (error) {
        console.error('❌ Signup error:', error.message);
        toast.error(error.message || 'Signup failed. Please try again.');
        return false;
      }

      if (user) {
        console.log('✅ User created successfully:', user.id);
        toast.success('Account created successfully! Please check your email to verify your account. Your account will need to be approved by an administrator before you can log in.');
        return true;
      }

      console.log('⚠️ No user returned from signup');
      return false;
    } catch (error: any) {
      console.error('💥 Signup error occurred:', error);
      toast.error('Signup failed. Please try again.');
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
