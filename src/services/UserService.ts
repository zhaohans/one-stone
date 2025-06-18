import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  department: string | null;
  position: string | null;
  phone: string | null;
  office_number: string | null;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval';
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  assigned_at: string;
  assigned_by: string | null;
}

export interface UserPreferences {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  timezone: string;
  preferences: Record<string, any>;
}

export interface OnboardingStep {
  step: 'profile_completion' | 'preferences_setup' | 'tutorial_completion';
  completed_at: string | null;
  data: Record<string, any>;
}

class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  async getUserRole(userId: string): Promise<'admin' | 'user'> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.role || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      return {
        theme: data.theme,
        language: data.language,
        notifications_enabled: data.notifications_enabled,
        email_notifications: data.email_notifications,
        timezone: data.timezone,
        preferences: typeof data.preferences === 'object' && data.preferences !== null 
          ? data.preferences as Record<string, any>
          : {}
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        theme: data.theme,
        language: data.language,
        notifications_enabled: data.notifications_enabled,
        email_notifications: data.email_notifications,
        timezone: data.timezone,
        preferences: typeof data.preferences === 'object' && data.preferences !== null 
          ? data.preferences as Record<string, any>
          : {}
      };
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStep[]> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      return (data || []).map(step => ({
        step: step.step as 'profile_completion' | 'preferences_setup' | 'tutorial_completion',
        completed_at: step.completed_at,
        data: typeof step.data === 'object' && step.data !== null 
          ? step.data as Record<string, any>
          : {}
      }));
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      return [];
    }
  }

  async completeOnboardingStep(
    userId: string, 
    step: 'profile_completion' | 'preferences_setup' | 'tutorial_completion',
    data: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: userId,
          step,
          completed_at: new Date().toISOString(),
          data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      return false;
    }
  }

  async isOnboardingComplete(userId: string): Promise<boolean> {
    try {
      const steps = await this.getOnboardingStatus(userId);
      const requiredSteps = ['profile_completion', 'preferences_setup', 'tutorial_completion'];
      
      return requiredSteps.every(step => 
        steps.some(s => s.step === step && s.completed_at !== null)
      );
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false;
    }
  }

  async getOnboardingProgress(userId: string): Promise<{ completed: number; total: number; steps: OnboardingStep[] }> {
    try {
      const steps = await this.getOnboardingStatus(userId);
      const requiredSteps = ['profile_completion', 'preferences_setup', 'tutorial_completion'];
      
      const completedCount = requiredSteps.filter(step => 
        steps.some(s => s.step === step && s.completed_at !== null)
      ).length;

      return {
        completed: completedCount,
        total: requiredSteps.length,
        steps
      };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return { completed: 0, total: 3, steps: [] };
    }
  }

  async getPendingUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending users:', error);
      return [];
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  async approveUser(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('approve_user', {
        user_id_to_approve: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error approving user:', error);
      return false;
    }
  }

  async rejectUser(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('reject_user', {
        user_id_to_reject: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error rejecting user:', error);
      return false;
    }
  }

  isEmailVerified(user: any): boolean {
    return !!user?.email_confirmed_at;
  }

  hasRole(userRole: string, requiredRole: string): boolean {
    if (requiredRole === 'user') return true;
    if (requiredRole === 'admin') return userRole === 'admin';
    return false;
  }
}

export default UserService.getInstance();
