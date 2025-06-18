
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  client_id?: string;
  account_id?: string;
  trade_id?: string;
  document_type: 'kyc' | 'account_opening' | 'trade_confirmation' | 'statement' | 'tax_document' | 'compliance' | 'other';
  document_status: 'pending' | 'approved' | 'rejected' | 'expired';
  title: string;
  description?: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  storage_path: string;
  upload_date: string;
  expiry_date?: string;
  is_confidential?: boolean;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
  approved_by?: string;
}

export const useDocuments = (accountId?: string, clientId?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!accountId && !clientId) return;
    
    setIsLoading(true);
    try {
      let query = supabase.from('documents').select('*');
      
      if (accountId) {
        query = query.eq('account_id', accountId);
      } else if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query.order('upload_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [accountId, clientId]);

  return {
    documents,
    isLoading,
    refetch: fetchDocuments
  };
};
