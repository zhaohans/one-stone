
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure session management
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TOKEN_KEY = 'auth_token';
const SESSION_KEY = 'session_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    const sessionData = localStorage.getItem(SESSION_KEY);
    
    if (token && sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session is still valid
        if (session.expiresAt > now) {
          setUser(session.user);
          // Refresh session timeout
          refreshSession(session.user);
        } else {
          // Session expired
          logout();
        }
      } catch (error) {
        console.error('Invalid session data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const refreshSession = (userData: User) => {
    const expiresAt = Date.now() + SESSION_TIMEOUT;
    const sessionData = {
      user: userData,
      expiresAt,
      lastActivity: Date.now()
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    Cookies.set(TOKEN_KEY, 'auth_token_' + Date.now(), {
      expires: 1, // 1 day
      httpOnly: false, // In real app, this should be httpOnly server-side
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll use a secure validation approach
      const validCredentials = await validateCredentials(email, password);
      
      if (validCredentials) {
        const userData: User = {
          id: 'user_' + Date.now(),
          email: email,
          name: 'K. Shen',
          role: 'admin'
        };
        
        setUser(userData);
        refreshSession(userData);
        toast.success('Login successful! Welcome to One Stone Capital.');
        return true;
      } else {
        toast.error('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    toast.info('You have been logged out.');
  };

  const checkSession = (): boolean => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;
    
    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session expired
      if (session.expiresAt <= now) {
        logout();
        return false;
      }
      
      // Check for idle timeout (no activity for 30 minutes)
      if (now - session.lastActivity > SESSION_TIMEOUT) {
        logout();
        toast.warning('Session expired due to inactivity.');
        return false;
      }
      
      // Update last activity
      session.lastActivity = now;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  // Auto logout on session expiry
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      if (!checkSession()) {
        // Session expired, user will be logged out by checkSession
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Secure credential validation (in real app, this would be server-side)
const validateCredentials = async (email: string, password: string): Promise<boolean> => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // For demo purposes - in production, this would be handled by your backend
  // Never store or validate passwords client-side in a real application
  return email === 'k.shen@onestone.sg' && password === 'onestone123';
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
