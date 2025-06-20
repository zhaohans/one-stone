import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthErrorState {
  errors: AuthError[];
  hasErrors: boolean;
}

export interface AuthErrorActions {
  addError: (error: AuthError) => void;
  removeError: (code: string) => void;
  clearErrors: () => void;
  handleAuthError: (error: any, context?: string) => void;
}

export function useAuthErrors(): AuthErrorState & AuthErrorActions {
  const [errors, setErrors] = useState<AuthError[]>([]);

  const addError = useCallback((error: AuthError) => {
    setErrors((prev) => {
      const filtered = prev.filter((e) => e.code !== error.code);
      return [...filtered, error];
    });
  }, []);

  const removeError = useCallback((code: string) => {
    setErrors((prev) => prev.filter((e) => e.code !== code));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleAuthError = useCallback(
    (error: any, context: string = "authentication") => {
      console.error(`${context} error:`, error);

      const errorMessages: Record<string, string> = {
        invalid_credentials: "Invalid email or password",
        user_not_found: "No account found with this email address",
        weak_password: "Password must be at least 6 characters long",
        email_not_confirmed:
          "Please verify your email address before signing in",
        signup_disabled: "Account registration is currently disabled",
        email_address_invalid: "Please enter a valid email address",
        password_mismatch: "Passwords do not match",
        user_already_registered: "An account with this email already exists",
        rate_limit_exceeded: "Too many attempts. Please try again later",
        invalid_request: "Invalid request. Please check your input",
        network_error: "Network error. Please check your connection",
        session_expired: "Your session has expired. Please log in again",
        insufficient_permissions:
          "You do not have permission to perform this action",
      };

      let message = error?.message || "An unexpected error occurred";
      let code = error?.error_code || error?.code || "unknown_error";

      // Map Supabase error codes to user-friendly messages
      if (errorMessages[code]) {
        message = errorMessages[code];
      } else if (error?.status === 400) {
        code = "invalid_request";
        message = errorMessages.invalid_request;
      } else if (error?.status === 401) {
        code = "invalid_credentials";
        message = errorMessages.invalid_credentials;
      } else if (error?.status === 403) {
        code = "insufficient_permissions";
        message = errorMessages.insufficient_permissions;
      } else if (error?.status === 429) {
        code = "rate_limit_exceeded";
        message = errorMessages.rate_limit_exceeded;
      }

      const authError: AuthError = {
        code,
        message,
        field: error?.field,
      };

      addError(authError);
      toast.error(message);
    },
    [addError],
  );

  return {
    errors,
    hasErrors: errors.length > 0,
    addError,
    removeError,
    clearErrors,
    handleAuthError,
  };
}
