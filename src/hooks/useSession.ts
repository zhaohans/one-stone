import { useState, useEffect, useCallback } from "react";
import SessionService, { SessionInfo } from "@/services/SessionService";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { toast } from "sonner";

export interface SessionState {
  sessions: SessionInfo[];
  isExpiring: boolean;
  timeUntilExpiry: number;
  showWarning: boolean;
}

export interface SessionActions {
  refreshSessions: () => Promise<void>;
  invalidateSession: (sessionToken: string) => Promise<void>;
  extendSession: () => Promise<void>;
  dismissWarning: () => void;
}

export function useSession(): SessionState & SessionActions {
  const { session, user, logout } = useAuth();
  const [state, setState] = useState<SessionState>({
    sessions: [],
    isExpiring: false,
    timeUntilExpiry: 0,
    showWarning: false,
  });

  const refreshSessions = useCallback(async () => {
    if (!user) return;

    try {
      const sessions = await SessionService.getUserSessions(user.id);
      setState((prev) => ({ ...prev, sessions }));
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    }
  }, [user]);

  const invalidateSession = useCallback(
    async (sessionToken: string) => {
      try {
        await SessionService.invalidateSession(sessionToken);
        await refreshSessions();
        toast.success("Session terminated successfully");
      } catch (error) {
        console.error("Error invalidating session:", error);
        toast.error("Failed to terminate session");
      }
    },
    [refreshSessions],
  );

  const extendSession = useCallback(async () => {
    if (!session) return;

    try {
      await SessionService.updateSessionActivity(session.access_token);
      setState((prev) => ({
        ...prev,
        showWarning: false,
        isExpiring: false,
      }));
      toast.success("Session extended successfully");
    } catch (error) {
      console.error("Error extending session:", error);
      toast.error("Failed to extend session");
    }
  }, [session]);

  const dismissWarning = useCallback(() => {
    setState((prev) => ({ ...prev, showWarning: false }));
  }, []);

  // Session warning listener
  useEffect(() => {
    const handleSessionWarning = (event: CustomEvent) => {
      setState((prev) => ({
        ...prev,
        showWarning: true,
        isExpiring: true,
        timeUntilExpiry: event.detail.timeRemaining,
      }));

      toast.warning("Your session will expire soon. Click to extend.", {
        duration: 10000,
        action: {
          label: "Extend Session",
          onClick: extendSession,
        },
      });
    };

    window.addEventListener(
      "session-warning",
      handleSessionWarning as EventListener,
    );

    return () => {
      window.removeEventListener(
        "session-warning",
        handleSessionWarning as EventListener,
      );
    };
  }, [extendSession]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (state.isExpiring && state.timeUntilExpiry <= 0) {
      toast.error("Session expired. Please log in again.");
      logout();
    }
  }, [state.isExpiring, state.timeUntilExpiry, logout]);

  // Cleanup expired sessions periodically
  useEffect(() => {
    const cleanup = setInterval(
      () => {
        SessionService.cleanupExpiredSessions();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    return () => clearInterval(cleanup);
  }, []);

  return {
    ...state,
    refreshSessions,
    invalidateSession,
    extendSession,
    dismissWarning,
  };
}
