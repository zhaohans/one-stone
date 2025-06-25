
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Download, Upload, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthorizationMatrixModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank?: string | null;
  client?: string | null;
}

const AuthorizationMatrixModal = ({ open, onOpenChange, bank, client }: AuthorizationMatrixModalProps) => {
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<string | null>(null);
  const [newSignatory, setNewSignatory] = useState({
    name: '',
    roles: {} as Record<string, any>
  });

  // Mock data - in real app this would come from the database
  const roles = ['Director', 'ATR', 'AS', 'ID Delegate', 'Compliance Officer'];
  const signatories = [
    {
      id: '1',
      name: 'FANG Chen Chun',
      roles: {
        'Director': { 
          active: true, 
          mandateLimit: '1,000,000 USD', 
          effectiveDate: '2024-01-01', 
          expiry: '2024-12-31', 
          status: 'Active',
          comments: ''
        },
        'ATR': { 
          active: false, 
          mandateLimit: '', 
          effectiveDate: '', 
          expiry: '', 
          status: '',
          comments: ''
        }
      },
      isPending: false
    },
    {
      id: '2',
      name: 'LI Jianmin',
      roles: {
        'ATR': { 
          active: true, 
          mandateLimit: '500,000 USD', 
          effectiveDate: '2024-02-01', 
          expiry: '2024-12-31', 
          status: 'Pending',
          comments: 'Formal relationship required'
        },
        'AS': { 
          active: true, 
          mandateLimit: '250,000 USD', 
          effectiveDate: '2024-01-15', 
          expiry: '2024-12-31', 
          status: 'Active',
          comments: ''
        }
      },
      isPending: true
    }
  ];

  const handleExportMatrix = () => {
    console.log('Exporting authorization matrix...');
  };

  const handleImportMatrix = () => {
    console.log('Importing authorization matrix...');
  };

  const handleAddSignatory = () => {
    console.log('Adding new signatory:', newSignatory);
    setNewSignatory({ name: '', roles: {} });
  };

  const handleRoleChange = (signatoryId: string, role: string, field: string, value: any) => {
    console.log('Updating role:', { signatoryId, role, field, value });
  };

  const filteredSignatories = showPendingOnly 
    ? signatories.filter(sig => sig.isPending)
    : signatories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              Authorization Matrix
              {bank && ` - ${bank.toUpperCase()}`}
              {client && ` - Client ${client}`}
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleImportMatrix}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportMatrix}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="pending-only"
                checked={showPendingOnly}
                onCheckedChange={setShowPendingOnly}
              />
              <Label htmlFor="pending-only">Show pending changes only</Label>
            </div>
            <Button onClick={() => setEditingSignatory('new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Signatory
            </Button>
          </div>

          {/* Add New Signatory Form */}
          {editingSignatory === 'new' && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Signatory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Signatory Name"
                  value={newSignatory.name}
                  onChange={(e) => setNewSignatory(prev => ({ ...prev, name: e.target.value }))}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddSignatory}>Add Signatory</Button>
                  <Button variant="outline" onClick={() => setEditingSignatory(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Authorization Matrix */}
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white border-r min-w-[200px]">
                    Signatory
                  </TableHead>
                  {roles.map((role) => (
                    <TableHead key={role} className="text-center min-w-[150px]">
                      {role}
                    </TableHead>
                  ))}
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignatories.map((signatory) => (
                  <TableRow key={signatory.id}>
                    <TableCell className="sticky left-0 bg-white border-r font-medium">
                      <div className="flex items-center justify-between">
                        <span>{signatory.name}</span>
                        {signatory.isPending && (
                          <Badge variant="outline" className="ml-2">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    {roles.map((role) => {
                      const roleData = signatory.roles[role];
                      return (
                        <TableCell key={role} className="text-center">
                          {roleData?.active ? (
                            <div className="space-y-1">
                              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                              <div className="text-xs space-y-1">
                                <div className="font-medium">{roleData.mandateLimit}</div>
                                <div className="text-gray-500">
                                  {roleData.effectiveDate} - {roleData.expiry}
                                </div>
                                <Badge 
                                  variant={roleData.status === 'Active' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {roleData.status}
                                </Badge>
                                {roleData.comments && (
                                  <div className="text-xs text-orange-600">
                                    {roleData.comments}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto"></div>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSignatory(signatory.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  Apply to Multiple Banks
                </Button>
                <Button variant="outline">
                  Copy Authorization Matrix
                </Button>
                <Button variant="outline">
                  Bulk Update Expiry Dates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Added FANG Chen Chun as Director</span>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>2024-01-15 10:30</span>
                    <span>by John Doe</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Updated LI Jianmin mandate limit to 500,000 USD</span>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>2024-01-14 14:15</span>
                    <span>by Jane Smith</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorizationMatrixModal;
