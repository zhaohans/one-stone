import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { useUserProfile } from "./useUserProfile";
import { authService } from "@/services/SimpleAuthService";

export function useSimpleAuth() {
  const authState = useAuthState();
  const {
    profile,
    userStatus,
    isLoading: profileLoading,
    refreshProfile,
  } = useUserProfile(authState.user);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      console.log("🔑 Attempting login for:", email);

      const { data, error } = await authService.login({ email, password });

      if (error) {
        console.error("❌ Login error:", error.message);

        if (error.message.includes("locked")) {
          toast.error(error.message);
        } else if (error.message.includes("Email not confirmed")) {
          toast.error(
            "Please verify your email before signing in. Check your inbox for a verification link.",
          );
        } else {
          toast.error("Invalid email or password. Please try again.");
        }

        return false;
      }

      if (data.user) {
        console.log("✅ Login successful");
        toast.success("Login successful! Welcome back.");
        return true;
      }

      return false;
    },
    [],
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
    ): Promise<boolean> => {
      console.log("🔥 Attempting signup for:", email);

      const { data, error } = await authService.signup({
        email,
        password,
        firstName,
        lastName,
      });

      if (error) {
        console.error("❌ Signup error:", error.message);
        toast.error(error.message || "Signup failed. Please try again.");
        return false;
      }

      if (data.user) {
        console.log("✅ Signup successful");
        toast.success(
          "Account created successfully! Please check your email to verify your account.",
        );
        return true;
      }

      return false;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    const { error } = await authService.logout();

    if (error) {
      console.error("❌ Logout error:", error.message);
      toast.error("Error logging out");
    } else {
      toast.info("You have been logged out.");
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    const { error } = await authService.resetPassword(email);

    if (error) {
      console.error("❌ Password reset error:", error.message);
      toast.error(error.message || "Failed to send password reset email.");
      return false;
    }

    toast.success("Password reset email sent! Please check your inbox.");
    return true;
  }, []);

  const resendVerification = useCallback(
    async (email: string): Promise<boolean> => {
      const { error } = await authService.resendVerification(email);

      if (error) {
        console.error("❌ Resend verification error:", error.message);
        toast.error(error.message || "Failed to resend verification email.");
        return false;
      }

      toast.success("Verification email sent! Please check your inbox.");
      return true;
    },
    [],
  );

  return {
    // Auth state
    user: authState.user,
    session: authState.session,
    isLoading: authState.isLoading || profileLoading,
    isAuthenticated: authState.isAuthenticated,

    // User profile and status
    profile,
    userStatus,
    isEmailVerified: userStatus?.isEmailVerified || false,
    isApproved: userStatus?.isApproved || false,
    isOnboarded: userStatus?.isOnboarded || false,
    role: userStatus?.role || "user",

    // Actions
    login,
    signup,
    logout,
    resetPassword,
    resendVerification,
    refreshProfile,
  };
}
