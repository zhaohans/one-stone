
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Account {
  id: string;
  account_name: string;
  account_number: string;
  client_id: string;
  account_type: 'individual' | 'joint' | 'corporate' | 'trust' | 'retirement';
  account_status: 'active' | 'inactive' | 'suspended' | 'closed';
  base_currency: string;
  opening_date: string;
  closing_date?: string;
  risk_tolerance?: string;
  investment_objective?: string;
  benchmark?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  // Joined data
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    client_code: string;
    email: string;
  };
  positions?: any[];
  total_aum?: number;
  holdings_count?: number;
}

export interface AccountFilters {
  account_type?: string;
  account_status?: string;
  base_currency?: string;
  client_search?: string;
}

export const useAccounts = (filters: AccountFilters = {}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('accounts')
        .select(`
          *,
          client:clients(id, first_name, last_name, client_code, email),
          positions(id, market_value)
        `);

      // Apply filters with proper type casting
      if (filters.account_type) {
        query = query.eq('account_type', filters.account_type as Account['account_type']);
      }
      if (filters.account_status) {
        query = query.eq('account_status', filters.account_status as Account['account_status']);
      }
      if (filters.base_currency) {
        query = query.eq('base_currency', filters.base_currency);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Process data to match our interface
      const processedAccounts = data?.map(account => ({
        ...account,
        total_aum: account.positions?.reduce((sum: number, pos: any) => sum + (pos.market_value || 0), 0) || 0,
        holdings_count: account.positions?.length || 0
      })) || [];

      // Apply client search filter if provided
      let filteredAccounts = processedAccounts;
      if (filters.client_search) {
        const searchTerm = filters.client_search.toLowerCase();
        filteredAccounts = processedAccounts.filter(account => 
          account.client?.first_name?.toLowerCase().includes(searchTerm) ||
          account.client?.last_name?.toLowerCase().includes(searchTerm) ||
          account.client?.email?.toLowerCase().includes(searchTerm)
        );
      }

      setAccounts(filteredAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (accountData: Partial<Account>) => {
    try {
      // Ensure required fields are present
      const requiredData = {
        account_name: accountData.account_name || '',
        client_id: accountData.client_id || '',
        account_type: accountData.account_type || 'individual' as const,
        base_currency: accountData.base_currency || 'USD',
        opening_date: accountData.opening_date || new Date().toISOString().split('T')[0],
        account_status: 'active' as const,
        account_number: `ACC-${Date.now()}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        risk_tolerance: accountData.risk_tolerance,
        investment_objective: accountData.investment_objective,
        benchmark: accountData.benchmark
      };

      const { data, error } = await supabase
        .from('accounts')
        .insert([requiredData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      fetchAccounts(); // Refresh the list
      return { success: true, data };
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    try {
      // Filter out computed fields and ensure proper types
      const updateData: any = {
        account_name: updates.account_name,
        account_type: updates.account_type,
        account_status: updates.account_status,
        base_currency: updates.base_currency,
        risk_tolerance: updates.risk_tolerance,
        investment_objective: updates.investment_objective,
        benchmark: updates.benchmark,
        closing_date: updates.closing_date,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data, error } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account updated successfully",
      });

      fetchAccounts(); // Refresh the list
      return { success: true, data };
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account deleted successfully",
      });

      fetchAccounts(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const bulkUpdateAccounts = async (accountIds: string[], updates: Partial<Account>) => {
    try {
      // Filter out computed fields and ensure proper types
      const updateData: any = {
        account_status: updates.account_status,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { error } = await supabase
        .from('accounts')
        .update(updateData)
        .in('id', accountIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${accountIds.length} account(s) updated successfully`,
      });

      fetchAccounts(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating accounts:', error);
      toast({
        title: "Error",
        description: "Failed to update accounts",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [JSON.stringify(filters)]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('accounts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'accounts' }, 
        () => {
          fetchAccounts(); // Refresh data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
    bulkUpdateAccounts,
    refetch: fetchAccounts
  };
};
