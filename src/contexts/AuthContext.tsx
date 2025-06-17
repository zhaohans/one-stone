
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  position: string | null;
  phone: string | null;
  office_number: string | null;
  avatar_url: string | null;
  status: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setUser);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt for:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed. Please try again.');
        return false;
      }

      if (data.user) {
        console.log('Login successful for:', data.user.email);
        toast.success('Login successful! Welcome to One Stone Capital.');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<boolean> => {
    console.log('Signup attempt for:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Signup failed. Please try again.');
        return false;
      }

      if (data.user) {
        console.log('Signup successful for:', data.user.email);
        toast.success('Account created successfully! Please check your email to verify your account.');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out');
      } else {
        setUser(null);
        setSession(null);
        toast.info('You have been logged out.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
        return false;
      }

      // Refresh user data
      const updatedProfile = await fetchUserProfile(user.id);
      if (updatedProfile) {
        setUser(updatedProfile);
        toast.success('Profile updated successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
