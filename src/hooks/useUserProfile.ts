
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Use the actual database type for profiles
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export interface UserStatus {
  isEmailVerified: boolean;
  isApproved: boolean;
  isOnboarded: boolean;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval';
}

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUserStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchUserData(user.id);
  }, [user]);

  const fetchUserData = async (userId: string) => {
    try {
      // Get comprehensive user status using our new database function
      const { data: statusData } = await supabase.rpc('get_user_auth_status', {
        user_id_param: userId
      });

      if (statusData && statusData.length > 0) {
        const status = statusData[0];
        setUserStatus({
          isEmailVerified: status.is_email_verified,
          isApproved: status.is_approved,
          isOnboarded: status.is_onboarded,
          role: status.user_role,
          status: status.user_status,
        });
      }

      // Get detailed profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    if (user) {
      fetchUserData(user.id);
    }
  };

  return {
    profile,
    userStatus,
    isLoading,
    refreshProfile,
  };
}
