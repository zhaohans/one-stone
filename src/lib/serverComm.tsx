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

export async function serverLogin(credentials: LoginCredentials): Promise<AuthResult> {
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
      // Check user approval status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        return {
          user: null,
          session: null,
          error: {
            message: 'Error checking user status. Please contact support.',
            name: 'ProfileError',
            status: 500
          } as AuthError
        };
      }

      // Check if user is approved
      if (profile.status === 'pending_approval') {
        // Sign out the user since they're not approved
        await supabase.auth.signOut();
        return {
          user: null,
          session: null,
          error: {
            message: 'Your account is pending approval. Please wait for an administrator to approve your account.',
            name: 'PendingApproval',
            status: 403
          } as AuthError
        };
      }

      if (profile.status === 'inactive' || profile.status === 'suspended') {
        // Sign out the user since their account is inactive
        await supabase.auth.signOut();
        return {
          user: null,
          session: null,
          error: {
            message: 'Your account has been deactivated. Please contact support.',
            name: 'AccountDeactivated',
            status: 403
          } as AuthError
        };
      }

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

export async function serverSignup(credentials: SignupCredentials): Promise<AuthResult> {
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