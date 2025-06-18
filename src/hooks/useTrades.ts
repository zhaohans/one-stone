
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trade {
  id: string;
  account_id: string;
  security_id: string;
  trade_date: string;
  settlement_date?: string;
  trade_type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'dividend' | 'fee';
  quantity: number;
  price?: number;
  gross_amount?: number;
  commission?: number;
  fees?: number;
  tax?: number;
  net_amount?: number;
  currency: string;
  exchange_rate?: number;
  trade_status: 'pending' | 'executed' | 'settled' | 'cancelled' | 'failed';
  reference_number?: string;
  counterparty?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  // Joined data
  security?: {
    id: string;
    symbol: string;
    name: string;
    currency: string;
  };
}

export const useTrades = (accountId?: string) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTrades = async () => {
    if (!accountId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          security:securities(id, symbol, name, currency)
        `)
        .eq('account_id', accountId)
        .order('trade_date', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [accountId]);

  return {
    trades,
    isLoading,
    refetch: fetchTrades
  };
};
