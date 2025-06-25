
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('🔔 Initial session loaded:', session?.user?.id || 'null');
          setState({
            user: session?.user || null,
            session,
            isLoading: false,
            isAuthenticated: !!session?.user,
          });
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 Auth state changed:', event, session?.user?.id || 'null');
        
        setState({
          user: session?.user || null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
