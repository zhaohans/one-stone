
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentOperations } from '@/hooks/useDocumentOperations';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Check, 
  X, 
  Clock,
  AlertTriangle 
} from 'lucide-react';
import DocumentUploadModal from './DocumentUploadModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentsTableProps {
  accountId?: string;
  clientId?: string;
  tradeId?: string;
}

const DocumentsTable = ({ accountId, clientId, tradeId }: DocumentsTableProps) => {
  const { documents, isLoading, refetch } = useDocuments(accountId, clientId);
  const { downloadDocument, updateDocumentStatus, deleteDocument } = useDocumentOperations();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
      case 'expired':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'kyc':
        return 'bg-blue-100 text-blue-800';
      case 'account_opening':
        return 'bg-green-100 text-green-800';
      case 'trade_confirmation':
        return 'bg-purple-100 text-purple-800';
      case 'statement':
        return 'bg-indigo-100 text-indigo-800';
      case 'tax_document':
        return 'bg-orange-100 text-orange-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async (document: any) => {
    await downloadDocument(document);
  };

  const handleStatusChange = async (documentId: string, status: 'approved' | 'rejected') => {
    await updateDocumentStatus(documentId, status);
    refetch();
  };

  const handleDelete = async (document: any) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(document);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Documents
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {documents.length} documents
              </Badge>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No documents found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload your first document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{document.title}</div>
                          <div className="text-sm text-gray-500">{document.file_name}</div>
                          {document.is_confidential && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Confidential
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(document.document_type)}>
                        {document.document_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(document.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatFileSize(document.file_size)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(document.document_status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(document.document_status)}
                          <span>{document.document_status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {document.document_status === 'pending' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(document.id, 'approved')}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(document.id, 'rejected')}>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(document)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onDocumentUploaded={refetch}
        accountId={accountId}
        clientId={clientId}
        tradeId={tradeId}
      />
    </>
  );
};

export default DocumentsTable;
