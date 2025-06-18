
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/hooks/useClients';

export const useClientOperations = () => {
  const { toast } = useToast();

  const createClient = async (clientData: Partial<Client>) => {
    try {
      // Generate client code using the database function
      const { data: clientCode, error: codeError } = await supabase.rpc('generate_client_code');
      
      if (codeError) throw codeError;

      const requiredData = {
        client_code: clientCode,
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

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updateData: any = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        email: updates.email,
        phone: updates.phone,
        date_of_birth: updates.date_of_birth,
        nationality: updates.nationality,
        tax_residence: updates.tax_residence,
        address_line1: updates.address_line1,
        address_line2: updates.address_line2,
        city: updates.city,
        state: updates.state,
        postal_code: updates.postal_code,
        country: updates.country,
        risk_profile: updates.risk_profile,
        kyc_status: updates.kyc_status,
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
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client updated successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const bulkUpdateClients = async (clientIds: string[], updates: Pick<Client, 'kyc_status'>) => {
    try {
      const updateData: any = {
        kyc_status: updates.kyc_status,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .in('id', clientIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${clientIds.length} client(s) updated successfully`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error bulk updating clients:', error);
      toast({
        title: "Error",
        description: "Failed to update clients",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    bulkUpdateClients
  };
};
