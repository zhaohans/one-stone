import { Session, User } from '../types';
import { supabase } from '../lib/supabase';

const SESSION_KEY = 'app_session';

export const sessionService = {
  async getSession(): Promise<Session | null> {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session: Session = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (Date.now() >= session.expires_at) {
      await this.refreshSession(session.refresh_token);
      return this.getSession();
    }

    return session;
  },

  async setSession(session: Session): Promise<void> {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async clearSession(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  async refreshSession(refreshToken: string): Promise<void> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) throw error;

      if (data.session) {
        const user = data.session.user as User;
        const newSession: Session = {
          user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Date.now() + data.session.expires_in * 1000,
        };

        await this.setSession(newSession);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      await this.clearSession();
      throw error;
    }
  },

  async updateUser(user: User): Promise<void> {
    const session = await this.getSession();
    if (session) {
      session.user = user;
      await this.setSession(session);
    }
  },
}; 