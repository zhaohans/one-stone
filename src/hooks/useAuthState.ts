import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuthState() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log("🔔 Auth state changed:", event, session?.user?.id || "null");

      setState({
        user: session?.user || null,
        session,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
    });

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (mounted) {
          setState({
            user: session?.user || null,
            session,
            isLoading: false,
            isAuthenticated: !!session?.user,
          });
        }
      })
      .catch((error) => {
        console.error("❌ Error getting initial session:", error);
        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
