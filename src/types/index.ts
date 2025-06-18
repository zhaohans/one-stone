export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
} 