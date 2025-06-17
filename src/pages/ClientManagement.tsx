
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Flag,
  Tag,
  Grid3X3,
  List,
  Check,
  X
} from 'lucide-react';

const ClientManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for clients
  const clients = [
    {
      id: 'C001',
      name: 'John Smith',
      type: 'Individual',
      email: 'john.smith@email.com',
      phone: '+65 9123 4567',
      rm: 'K. Shen',
      status: 'Active',
      kycStatus: 'Approved',
      onboardedDate: '2024-01-15',
      country: 'Singapore',
      countryFlag: '🇸🇬',
      tags: ['High Net Worth', 'VIP'],
      accountsCount: 3,
      aum: '5,250,000',
      avatar: '',
      riskProfile: 'Moderate',
      sourceOfWealth: 'Business Income',
      address: '1 Marina Bay Sands, Singapore 018956'
    },
    {
      id: 'C002',
      name: 'Sarah Johnson',
      type: 'Individual',
      email: 'sarah.j@email.com',
      phone: '+65 8765 4321',
      rm: 'K. Shen',
      status: 'Prospect',
      kycStatus: 'In Progress',
      onboardedDate: '2024-01-12',
      country: 'Malaysia',
      countryFlag: '🇲🇾',
      tags: ['Referral'],
      accountsCount: 1,
      aum: '2,800,000',
      avatar: '',
      riskProfile: 'Conservative',
      sourceOfWealth: 'Inheritance',
      address: 'Kuala Lumpur, Malaysia'
    },
    {
      id: 'C003',
      name: 'Chen Industries Pte Ltd',
      type: 'Corporate',
      email: 'contact@chenindustries.com',
      phone: '+65 6234 5678',
      rm: 'A. Wong',
      status: 'Active',
      kycStatus: 'Approved',
      onboardedDate: '2024-01-14',
      country: 'Singapore',
      countryFlag: '🇸🇬',
      tags: ['Corporate', 'Large Cap'],
      accountsCount: 5,
      aum: '18,100,000',
      avatar: '',
      riskProfile: 'Aggressive',
      sourceOfWealth: 'Business Operations',
      address: '50 Raffles Place, Singapore 048623'
    }
  ];

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
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Not Started': return 'bg-red-100 text-red-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
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

  const ClientDetailView = ({ client }: { client: any }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
              {client.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <Badge variant="outline" className="text-xs">
                {client.type === 'Individual' ? <User className="w-3 h-3 mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
                {client.type}
              </Badge>
              <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
              <span className="text-sm text-gray-500">{client.countryFlag} {client.country}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Send KYC Reminder
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Profile
          </Button>
          <Button variant="outline" size="sm">
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
                  <Badge className={getKycStatusColor(client.kycStatus)}>{client.kycStatus}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Profile</span>
                  <span className="text-sm">{client.riskProfile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Reviewed</span>
                  <span className="text-sm text-gray-500">2024-01-10</span>
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
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{client.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Onboarded: {client.onboardedDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Source of Wealth</label>
                <p className="text-sm text-gray-600 mt-1">{client.sourceOfWealth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {client.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  className="w-full mt-2 p-3 border rounded-md text-sm"
                  placeholder="Add notes about this client..."
                  rows={3}
                />
                <div className="text-xs text-gray-500 mt-1">500 characters max</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Linked Accounts ({client.accountsCount})</span>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Account
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Account details will be displayed here</p>
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
          <Button size="sm">
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
                placeholder="Search by name, email, RM, tag, or KYC status..."
                className="pl-10"
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">RM</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>All RMs</option>
                    <option>K. Shen</option>
                    <option>A. Wong</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Prospect</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">KYC Status</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>All KYC</option>
                    <option>Approved</option>
                    <option>In Progress</option>
                    <option>Not Started</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>All Countries</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                    <option>Hong Kong</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">From Date</label>
                  <Input type="date" className="text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">To Date</label>
                  <Input type="date" className="text-sm" />
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
                <Button variant="outline" size="sm">Bulk Archive</Button>
                <Button variant="outline" size="sm">Bulk Assign RM</Button>
                <Button variant="outline" size="sm">Bulk Export</Button>
                <Button variant="outline" size="sm">Bulk KYC Reminder</Button>
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
            <span className="text-sm text-gray-500">Showing {clients.length} of {clients.length} clients</span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <input 
                    type="checkbox"
                    checked={selectedClients.length === clients.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>RM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Onboarded</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead className="text-right">AUM</TableHead>
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
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <button 
                          className="font-medium text-blue-600 hover:text-blue-800 text-left"
                          onClick={() => setSelectedClient(client)}
                        >
                          {client.name}
                        </button>
                        <div className="text-xs text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {client.type === 'Individual' ? 
                        <User className="w-4 h-4 text-gray-500" /> : 
                        <Building2 className="w-4 h-4 text-gray-500" />
                      }
                      <span className="text-sm">{client.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-gray-100">
                          {client.rm.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{client.rm}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getKycStatusColor(client.kycStatus)}>{client.kycStatus}</Badge>
                    {client.kycStatus === 'Not Started' && (
                      <div className="text-xs text-orange-600 mt-1">⚠️ KYC not started</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{client.onboardedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{client.countryFlag}</span>
                      <span className="text-sm">{client.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {client.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{client.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {client.accountsCount}
                    </button>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${client.aum}
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
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send KYC Reminder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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

          {clients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">Add your first client to get started.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
