
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClientOperations } from './useClientOperations';

export interface Client {
  id: string;
  client_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  tax_residence?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  risk_profile?: string;
  kyc_status?: 'pending' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  user_id?: string;
}

export interface ClientFilters {
  status?: string;
  kyc_status?: string;
  country?: string;
  search?: string;
}

export const useClients = (filters: ClientFilters = {}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createClient, updateClient, deleteClient, bulkUpdateClients } = useClientOperations();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('*');

      // Apply filters
      if (filters.kyc_status && filters.kyc_status !== 'all' && filters.kyc_status !== '') {
        const validStatuses = ['pending', 'approved', 'rejected', 'expired'] as const;
        if (validStatuses.includes(filters.kyc_status as any)) {
          query = query.eq('kyc_status', filters.kyc_status as typeof validStatuses[number]);
        }
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},client_code.ilike.${searchTerm}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [JSON.stringify(filters)]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' }, 
        () => {
          fetchClients(); // Refresh data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    clients,
    isLoading,
    createClient: async (clientData: Partial<Client>) => {
      const result = await createClient(clientData);
      if (result.success) {
        fetchClients();
      }
      return result;
    },
    updateClient: async (id: string, updates: Partial<Client>) => {
      const result = await updateClient(id, updates);
      if (result.success) {
        fetchClients();
      }
      return result;
    },
    deleteClient: async (id: string) => {
      const result = await deleteClient(id);
      if (result.success) {
        fetchClients();
      }
      return result;
    },
    bulkUpdateClients: async (clientIds: string[], updates: Pick<Client, 'kyc_status'>) => {
      const result = await bulkUpdateClients(clientIds, updates);
      if (result.success) {
        fetchClients();
      }
      return result;
    },
    refetch: fetchClients
  };
};
