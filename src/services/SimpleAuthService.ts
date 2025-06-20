import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

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

class SimpleAuthService {
  async login(credentials: LoginCredentials) {
    try {
      // Check if account is locked
      const { data: isLocked } = await supabase.rpc("is_account_locked", {
        user_email: credentials.email,
      });

      if (isLocked) {
        throw new Error(
          "Account is temporarily locked due to too many failed login attempts. Please try again later.",
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      if (error) {
        // Handle failed login attempt
        await supabase.rpc("handle_failed_login", {
          user_email: credentials.email,
        });
        throw error;
      }

      if (data.user) {
        // Reset failed login attempts on success
        await supabase.rpc("reset_failed_login_attempts", {
          user_email: credentials.email,
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  async signup(credentials: SignupCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: credentials.firstName || "",
            last_name: credentials.lastName || "",
          },
        },
      });

      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async resendVerification(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }
}

export const authService = new SimpleAuthService();
