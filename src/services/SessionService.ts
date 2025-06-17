
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface SessionInfo {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: string;
  last_activity: string;
  ip_address?: string;
  user_agent?: string;
}

class SessionService {
  private static instance: SessionService;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private readonly SESSION_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly WARNING_TIME = 2 * 60 * 1000; // 2 minutes before expiry

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async createSession(session: Session): Promise<void> {
    try {
      const sessionData = {
        user_id: session.user.id,
        session_token: session.access_token,
        expires_at: new Date(Date.now() + this.SESSION_DURATION).toISOString(),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      };

      await supabase
        .from('user_sessions')
        .insert(sessionData);

      this.startSessionTimer();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  async updateSessionActivity(sessionToken: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ 
          last_activity: new Date().toISOString(),
          expires_at: new Date(Date.now() + this.SESSION_DURATION).toISOString()
        })
        .eq('session_token', sessionToken);

      this.resetSessionTimer();
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  async invalidateSession(sessionToken: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', sessionToken);

      this.clearSessionTimer();
    } catch (error) {
      console.error('Error invalidating session:', error);
    }
  }

  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    
    // Set timer for session warning
    this.sessionTimeout = setTimeout(() => {
      this.showSessionWarning();
    }, this.SESSION_DURATION - this.WARNING_TIME);
  }

  private resetSessionTimer(): void {
    this.startSessionTimer();
  }

  private clearSessionTimer(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  private showSessionWarning(): void {
    // This will be handled by the SessionProvider
    window.dispatchEvent(new CustomEvent('session-warning', {
      detail: { timeRemaining: this.WARNING_TIME }
    }));
  }

  private async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  }

  isSessionExpiring(expiresAt: string): boolean {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    const timeRemaining = expiry - now;
    return timeRemaining <= this.WARNING_TIME;
  }

  getTimeUntilExpiry(expiresAt: string): number {
    const expiry = new Date(expiresAt).getTime();
    return Math.max(0, expiry - Date.now());
  }
}

export default SessionService.getInstance();
