
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Document } from '@/hooks/useDocuments';

export interface UploadDocumentData {
  title: string;
  description?: string;
  document_type: 'kyc' | 'account_opening' | 'trade_confirmation' | 'statement' | 'tax_document' | 'compliance' | 'other';
  client_id?: string;
  account_id?: string;
  trade_id?: string;
  is_confidential?: boolean;
}

export const useDocumentOperations = () => {
  const { toast } = useToast();

  const uploadDocument = async (file: File, documentData: UploadDocumentData) => {
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${documentData.document_type}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: uploadData.path,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          upload_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      return { success: true, document: data };
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateDocumentStatus = async (documentId: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          document_status: status,
          approved_by: status === 'approved' ? (await supabase.auth.getUser()).data.user?.id : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Document ${status} successfully`,
      });

      return { success: true, document: data };
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteDocument = async (document: Document) => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storage_path]);

      if (storageError) throw storageError;

      // Delete document record
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    uploadDocument,
    downloadDocument,
    updateDocumentStatus,
    deleteDocument,
  };
};
