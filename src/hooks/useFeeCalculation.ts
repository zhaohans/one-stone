
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeeCalculationParams {
  account_id: string;
  period_start: string;
  period_end: string;
  fee_type: 'management' | 'performance' | 'transaction' | 'custody' | 'retrocession' | 'other';
  fee_rate?: number;
}

export const useFeeCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculateFee = async (params: FeeCalculationParams) => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-fees', {
        body: params
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Fee Calculated",
        description: data.message || "Fee has been successfully calculated",
      });

      return { 
        success: true, 
        fee: data.fee, 
        retrocessions: data.retrocessions || []
      };

    } catch (error) {
      console.error('Fee calculation error:', error);
      
      toast({
        title: "Fee Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate fee",
        variant: "destructive",
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    } finally {
      setIsCalculating(false);
    }
  };

  const getFees = async (accountId?: string, startDate?: string, endDate?: string) => {
    try {
      // Create a fresh query builder each time to avoid subscription conflicts
      const queryBuilder = supabase
        .from('fees')
        .select(`
          *,
          accounts!inner(account_name, account_number, client_id),
          retrocessions(*)
        `);

      // Apply filters conditionally
      let query = queryBuilder;
      
      if (accountId) {
        query = query.eq('account_id', accountId);
      }

      if (startDate) {
        query = query.gte('calculation_period_start', startDate);
      }

      if (endDate) {
        query = query.lte('calculation_period_end', endDate);
      }

      // Add ordering and execute the query without creating subscriptions
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, fees: data || [] };

    } catch (error) {
      console.error('Error fetching fees:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        fees: []
      };
    }
  };

  const markFeePaid = async (feeId: string, paymentDate?: string) => {
    try {
      const { error } = await supabase
        .from('fees')
        .update({ 
          is_paid: true,
          payment_date: paymentDate || new Date().toISOString().split('T')[0]
        })
        .eq('id', feeId);

      if (error) {
        throw error;
      }

      toast({
        title: "Fee Payment Recorded",
        description: "Fee has been marked as paid",
      });

      return { success: true };

    } catch (error) {
      console.error('Error marking fee as paid:', error);
      
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update fee payment",
        variant: "destructive",
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  };

  return {
    calculateFee,
    getFees,
    markFeePaid,
    isCalculating
  };
};
