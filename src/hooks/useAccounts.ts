
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAccountOperations } from './useAccountOperations';
import { Account, AccountFilters } from '@/types/account';

export const useAccounts = (filters: AccountFilters = {}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createAccount, updateAccount, deleteAccount, bulkUpdateAccounts } = useAccountOperations();

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
        const validAccountTypes = ['individual', 'joint', 'corporate', 'trust', 'retirement'] as const;
        if (validAccountTypes.includes(filters.account_type as any)) {
          query = query.eq('account_type', filters.account_type as typeof validAccountTypes[number]);
        }
      }
      if (filters.account_status) {
        const validAccountStatuses = ['active', 'inactive', 'suspended', 'closed'] as const;
        if (validAccountStatuses.includes(filters.account_status as any)) {
          query = query.eq('account_status', filters.account_status as typeof validAccountStatuses[number]);
        }
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

      // Apply client search filter
      let filteredAccounts = processedAccounts;
      if (filters.client_search) {
        const searchTerm = filters.client_search.toLowerCase();
        filteredAccounts = processedAccounts.filter((account) => {
          const clientName = `${account.client?.first_name} ${account.client?.last_name}`.toLowerCase();
          const emailMatch = account.client?.email?.toLowerCase().includes(searchTerm);
          const accountNameMatch = account.account_name?.toLowerCase().includes(searchTerm);
          const accountNumberMatch = account.account_number?.toLowerCase().includes(searchTerm);
          
          return clientName.includes(searchTerm) || emailMatch || accountNameMatch || accountNumberMatch;
        });
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
    createAccount: async (accountData: any) => {
      const result = await createAccount(accountData);
      if (result.success) {
        fetchAccounts();
      }
      return result;
    },
    updateAccount: async (id: string, updates: any) => {
      const result = await updateAccount(id, updates);
      if (result.success) {
        fetchAccounts();
      }
      return result;
    },
    deleteAccount: async (id: string) => {
      const result = await deleteAccount(id);
      if (result.success) {
        fetchAccounts();
      }
      return result;
    },
    bulkUpdateAccounts: async (accountIds: string[], updates: any) => {
      const result = await bulkUpdateAccounts(accountIds, updates);
      if (result.success) {
        fetchAccounts();
      }
      return result;
    },
    refetch: fetchAccounts
  };
};

// Re-export types for backward compatibility
export type { Account, AccountFilters } from '@/types/account';
