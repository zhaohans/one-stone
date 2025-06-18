
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Check if account is locked before attempting login
      const { data: isLocked } = await supabase.rpc('is_account_locked', {
        user_email: credentials.email
      });

      if (isLocked) {
        return {
          user: null,
          session: null,
          error: {
            message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
            name: 'AccountLocked',
            status: 423
          } as AuthError
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      if (error) {
        // Handle failed login attempt
        await supabase.rpc('handle_failed_login', {
          user_email: credentials.email
        });

        return {
          user: null,
          session: null,
          error
        };
      }

      if (data.user && data.session) {
        // Reset failed login attempts on successful login
        await supabase.rpc('reset_failed_login_attempts', {
          user_email: credentials.email
        });
      }

      return {
        user: data.user,
        session: data.session,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: credentials.firstName || '',
            last_name: credentials.lastName || '',
          }
        }
      });

      return {
        user: data.user,
        session: data.session,
        error
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  async logout(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async resendVerification(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return {
        session: data.session,
        error
      };
    } catch (error) {
      return {
        session: null,
        error: error as AuthError
      };
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default AuthService.getInstance();
