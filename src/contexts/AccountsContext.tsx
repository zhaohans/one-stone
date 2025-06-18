import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAccountOperations } from '@/hooks/useAccountOperations';
import { Account, AccountFilters } from '@/types/account';

interface AccountsContextType {
  accounts: Account[];
  isLoading: boolean;
  refetch: () => void;
  createAccount: ReturnType<typeof useAccountOperations>['createAccount'];
  updateAccount: ReturnType<typeof useAccountOperations>['updateAccount'];
  deleteAccount: ReturnType<typeof useAccountOperations>['deleteAccount'];
  bulkUpdateAccounts: ReturnType<typeof useAccountOperations>['bulkUpdateAccounts'];
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createAccount, updateAccount, deleteAccount, bulkUpdateAccounts } = useAccountOperations();

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('accounts')
        .select(`*, client:clients(id, first_name, last_name, client_code, email), positions(id, market_value)`);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      const processedAccounts = data?.map(account => ({
        ...account,
        total_aum: account.positions?.reduce((sum: number, pos: any) => sum + (pos.market_value || 0), 0) || 0,
        holdings_count: account.positions?.length || 0
      })) || [];
      setAccounts(processedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({ title: 'Error', description: 'Failed to fetch accounts', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // Set up real-time subscription
    const channel = supabase
      .channel('accounts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, fetchAccounts)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AccountsContext.Provider value={{ accounts, isLoading, refetch: fetchAccounts, createAccount, updateAccount, deleteAccount, bulkUpdateAccounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  if (!context) throw new Error('useAccountsContext must be used within an AccountsProvider');
  return context;
}; 