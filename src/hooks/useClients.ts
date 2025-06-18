import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

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

  const createClient = async (clientData: Partial<Client>) => {
    try {
      // Ensure required fields are present
      const requiredData = {
        client_code: clientData.client_code || `CL${Date.now()}`,
        first_name: clientData.first_name || '',
        last_name: clientData.last_name || '',
        email: clientData.email || '',
        phone: clientData.phone,
        date_of_birth: clientData.date_of_birth,
        nationality: clientData.nationality,
        tax_residence: clientData.tax_residence,
        address_line1: clientData.address_line1,
        address_line2: clientData.address_line2,
        city: clientData.city,
        state: clientData.state,
        postal_code: clientData.postal_code,
        country: clientData.country,
        risk_profile: clientData.risk_profile || 'moderate',
        kyc_status: (clientData.kyc_status || 'pending') as 'pending' | 'approved' | 'rejected' | 'expired',
        created_by: (await supabase.auth.getUser()).data.user?.id,
        user_id: clientData.user_id
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([requiredData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client created successfully",
      });

      fetchClients(); // Refresh the list
      return { success: true, data };
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    createClient,
    refetch: fetchClients
  };
};
