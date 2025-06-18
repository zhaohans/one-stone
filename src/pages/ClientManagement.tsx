import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  Eye, 
  Edit, 
  Archive, 
  Trash, 
  MoreHorizontal,
  Users,
  Building2,
  FileText,
  Activity,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Tag,
  Grid3X3,
  List,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useClientsContext, Client } from '@/contexts/ClientsContext';
import { ClientForm } from '@/components/ClientForm';

const ClientManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    kyc_status: 'all',
    country: '',
    search: ''
  });

  const { clients, isLoading, createClient, updateClient, deleteClient, bulkUpdateClients } = useClientsContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === clients.length 
        ? []
        : clients.map(client => client.id)
    );
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await deleteClient(clientId);
    }
  };

  const handleBulkKycUpdate = async (status: 'pending' | 'approved' | 'rejected' | 'expired') => {
    if (selectedClients.length > 0) {
      await bulkUpdateClients(selectedClients, { kyc_status: status });
      setSelectedClients([]);
    }
  };

  const ClientDetailView = ({ client }: { client: Client }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
              {client.first_name?.[0]}{client.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{client.first_name} {client.last_name}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <Badge variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Individual
              </Badge>
              <Badge className={getKycStatusColor(client.kyc_status || 'pending')}>
                {client.kyc_status || 'pending'}
              </Badge>
              <span className="text-sm text-gray-500">{client.country}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Send KYC Reminder
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteClient(client.id)}>
            <Archive className="w-4 h-4 mr-2" />
            Archive Client
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity & Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>KYC Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getKycStatusColor(client.kyc_status || 'pending')}>
                    {client.kyc_status || 'pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Profile</span>
                  <span className="text-sm">{client.risk_profile || 'moderate'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Client Code</span>
                  <span className="text-sm font-mono">{client.client_code}</span>
                </div>
                <div className="pt-2">
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View KYC Documents
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                )}
                {client.address_line1 && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {client.address_line1}
                      {client.address_line2 && `, ${client.address_line2}`}
                      {client.city && `, ${client.city}`}
                      {client.state && `, ${client.state}`}
                      {client.postal_code && ` ${client.postal_code}`}
                      {client.country && `, ${client.country}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Created: {new Date(client.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Linked Accounts</span>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Account
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No accounts found for this client</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Holdings data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents</span>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Activity timeline will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tasks</span>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Task
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks assigned</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (selectedClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedClient(null)}>
              ← Back to Clients
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
          </div>
        </div>
        <ClientDetailView client={selectedClient} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client relationships and onboarding</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Clients
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button size="sm" onClick={handleCreateClient}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name, email, or client code..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">KYC Status</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                    value={filters.kyc_status}
                    onChange={(e) => setFilters(prev => ({ ...prev, kyc_status: e.target.value }))}
                  >
                    <option value="all">All KYC</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Input 
                    placeholder="Filter by country"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedClients.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedClients.length} client(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkKycUpdate('approved')}
                >
                  Approve KYC
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkKycUpdate('rejected')}
                >
                  Reject KYC
                </Button>
                <Button variant="outline" size="sm">Bulk Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Directory</CardTitle>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `Showing ${clients.length} clients`}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <input 
                      type="checkbox"
                      checked={selectedClients.length === clients.length && clients.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Risk Profile</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input 
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleClientSelect(client.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <button 
                            className="font-medium text-blue-600 hover:text-blue-800 text-left"
                            onClick={() => setSelectedClient(client)}
                          >
                            {client.first_name} {client.last_name}
                          </button>
                          <div className="text-xs text-gray-500">{client.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{client.client_code}</span>
                    </TableCell>
                    <TableCell className="text-sm">{client.email}</TableCell>
                    <TableCell>
                      <Badge className={getKycStatusColor(client.kyc_status || 'pending')}>
                        {client.kyc_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{client.risk_profile || 'moderate'}</TableCell>
                    <TableCell className="text-sm">{client.country}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send KYC Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClient(client.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!isLoading && clients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">Add your first client to get started.</p>
              <Button onClick={handleCreateClient}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Form Modal */}
      <ClientForm
        client={editingClient}
        isOpen={showClientForm}
        onClose={() => {
          setShowClientForm(false);
          setEditingClient(null);
        }}
        onSubmit={editingClient ? 
          (data) => updateClient(editingClient.id, data) : 
          createClient
        }
      />
    </div>
  );
};

export default ClientManagement;
