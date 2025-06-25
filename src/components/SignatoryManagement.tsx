
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Signatory, SignatoryAuditLog } from '@/types/signatory';
import { supabase } from '@/integrations/supabase/client';
import SignatoryForm from './SignatoryForm';
import SignatoryAuditHistory from './SignatoryAuditHistory';

interface SignatoryManagementProps {
  accountId: string;
  canManage?: boolean;
}

const SignatoryManagement = ({ accountId, canManage = false }: SignatoryManagementProps) => {
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [auditLogs, setAuditLogs] = useState<SignatoryAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignatory, setSelectedSignatory] = useState<Signatory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSignatories();
    fetchAuditLogs();
  }, [accountId]);

  const fetchSignatories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('signatories')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching signatories:', error);
        toast({
          title: "Error",
          description: "Failed to fetch signatories",
          variant: "destructive",
        });
        return;
      }

      // Transform database fields to match component expectations
      const transformedSignatories: Signatory[] = (data || []).map(item => ({
        id: item.id,
        account_id: item.account_id,
        name: item.name,
        title: '', // This field doesn't exist in DB schema, keeping empty for now
        email: item.email,
        phone: item.phone || '',
        role: item.role as 'primary' | 'secondary' | 'authorized_user' | 'view_only',
        is_active: item.is_active,
        start_date: item.date_added,
        end_date: null, // This field doesn't exist in DB schema
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setSignatories(transformedSignatories);
    } catch (error) {
      console.error('Error fetching signatories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch signatories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      // For now, we'll use empty audit logs since we don't have audit tracking implemented yet
      setAuditLogs([]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleAddSignatory = () => {
    setSelectedSignatory(null);
    setShowForm(true);
  };

  const handleEditSignatory = (signatory: Signatory) => {
    setSelectedSignatory(signatory);
    setShowForm(true);
  };

  const handleDeleteSignatory = async (signatory: Signatory) => {
    if (!window.confirm(`Are you sure you want to remove ${signatory.name} as a signatory?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('signatories')
        .update({ is_active: false })
        .eq('id', signatory.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Signatory removed successfully",
      });

      fetchSignatories();
    } catch (error) {
      console.error('Error removing signatory:', error);
      toast({
        title: "Error",
        description: "Failed to remove signatory",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSignatory(null);
    fetchSignatories();
    fetchAuditLogs();
  };

  const getStatusBadge = (signatory: Signatory) => {
    if (!signatory.is_active) {
      return <Badge variant="secondary">Removed</Badge>;
    }
    if (signatory.end_date && new Date(signatory.end_date) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-green-100 text-green-800',
      authorized_user: 'bg-yellow-100 text-yellow-800',
      view_only: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-4">Loading signatories...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Account Signatories</CardTitle>
            <div className="flex space-x-2">
              {canManage && (
                <Button onClick={handleAddSignatory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Signatory
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowHistory(true)}>
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position/Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Signing Authority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective Date</TableHead>
                {canManage && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatories.map((signatory) => (
                <TableRow key={signatory.id}>
                  <TableCell className="font-medium">{signatory.name}</TableCell>
                  <TableCell>{signatory.title || '-'}</TableCell>
                  <TableCell>{signatory.email}</TableCell>
                  <TableCell>{getRoleBadge(signatory.role)}</TableCell>
                  <TableCell>{getStatusBadge(signatory)}</TableCell>
                  <TableCell>{new Date(signatory.start_date).toLocaleDateString()}</TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSignatory(signatory)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSignatory(signatory)}
                          disabled={!signatory.is_active}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {signatories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canManage ? 7 : 6} className="text-center py-8 text-gray-500">
                    No signatories found for this account
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Signatory Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSignatory ? 'Edit Signatory' : 'Add New Signatory'}
            </DialogTitle>
          </DialogHeader>
          <SignatoryForm
            accountId={accountId}
            signatory={selectedSignatory}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Audit History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Signatory History & Audit Log</DialogTitle>
          </DialogHeader>
          <SignatoryAuditHistory
            accountId={accountId}
            auditLogs={auditLogs}
            onClose={() => setShowHistory(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatoryManagement;
