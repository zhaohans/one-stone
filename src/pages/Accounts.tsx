
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Plus,
  Filter,
  Download,
  Upload,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  X,
  Calendar as CalendarIcon,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Grid3X3,
  List,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Accounts = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [filters, setFilters] = useState({
    custodian: '',
    accountType: '',
    currency: '',
    status: '',
    rm: '',
    client: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null
  });

  // Mock data
  const accountsData = [
    {
      id: '1',
      accountName: 'Matthews Investment Account',
      accountNumber: 'ACC-2024-001',
      clientName: 'John Matthews',
      clientId: 'C-1247',
      custodian: 'DBS Bank',
      accountType: 'Brokerage',
      status: 'Open',
      currency: 'SGD',
      aum: 2450000,
      openedDate: '2024-01-15',
      holdings: 12,
      assignedRM: 'Sarah Chen',
      trend: '+2.3%'
    },
    {
      id: '2',
      accountName: 'Corporate Treasury Account',
      accountNumber: 'ACC-2024-002',
      clientName: 'Tech Solutions Pte Ltd',
      clientId: 'C-1248',
      custodian: 'UOB Bank',
      accountType: 'Corporate',
      status: 'Pending',
      currency: 'USD',
      aum: 5600000,
      openedDate: '2024-02-01',
      holdings: 8,
      assignedRM: 'Michael Wong',
      trend: '+1.8%'
    },
    {
      id: '3',
      accountName: 'Retirement Portfolio',
      accountNumber: 'ACC-2024-003',
      clientName: 'Maria Rodriguez',
      clientId: 'C-1249',
      custodian: 'OCBC Bank',
      accountType: 'Retirement',
      status: 'Blocked',
      currency: 'SGD',
      aum: 890000,
      openedDate: '2024-01-20',
      holdings: 15,
      assignedRM: 'David Tan',
      trend: '-0.5%'
    }
  ];

  const custodians = ['DBS Bank', 'UOB Bank', 'OCBC Bank', 'Standard Chartered', 'Citibank'];
  const accountTypes = ['Brokerage', 'Corporate', 'Retirement', 'Margin', 'Fund', 'Bank'];
  const currencies = ['SGD', 'USD', 'EUR', 'HKD', 'GBP'];
  const statuses = ['Open', 'Closed', 'Pending', 'In Progress', 'Blocked'];
  const rms = ['Sarah Chen', 'Michael Wong', 'David Tan', 'Lisa Kumar', 'James Park'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'SGD' ? 'SGD' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedAccounts.length} account(s)`,
    });
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "Copied",
      description: "Account number copied to clipboard",
    });
  };

  const handleCreateAccount = () => {
    setShowCreateModal(false);
    toast({
      title: "Account Created",
      description: "Account created and assigned to RM successfully",
    });
  };

  const filteredAccounts = accountsData.filter(account => {
    return (
      (!filters.custodian || account.custodian === filters.custodian) &&
      (!filters.accountType || account.accountType === filters.accountType) &&
      (!filters.currency || account.currency === filters.currency) &&
      (!filters.status || account.status === filters.status) &&
      (!filters.rm || account.assignedRM === filters.rm) &&
      (!filters.client || account.clientName.toLowerCase().includes(filters.client.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage client accounts and their lifecycle</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Accounts
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Account
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select value={filters.custodian} onValueChange={(value) => setFilters({...filters, custodian: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Custodian/Bank" />
              </SelectTrigger>
              <SelectContent>
                {custodians.map(custodian => (
                  <SelectItem key={custodian} value={custodian}>{custodian}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.accountType} onValueChange={(value) => setFilters({...filters, accountType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.currency} onValueChange={(value) => setFilters({...filters, currency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.rm} onValueChange={(value) => setFilters({...filters, rm: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Assigned RM" />
              </SelectTrigger>
              <SelectContent>
                {rms.map(rm => (
                  <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search client..."
              value={filters.client}
              onChange={(e) => setFilters({...filters, client: e.target.value})}
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({
                  custodian: '', accountType: '', currency: '', status: '', rm: '', client: '', dateFrom: null, dateTo: null
                })}
              >
                Clear Filters
              </Button>
            </div>
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
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAccounts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedAccounts.length} account(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Close')}>
                  Bulk Close
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Assign RM')}>
                  Bulk Assign RM
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                  Bulk Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Compliance Review')}>
                  Bulk Compliance Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts Table/List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accounts Overview</CardTitle>
            <span className="text-sm text-gray-500">
              Showing {filteredAccounts.length} of {accountsData.length} accounts
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
              <p className="text-gray-500 mb-4">Add your first account to get started.</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Account
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedAccounts.length === filteredAccounts.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAccounts(filteredAccounts.map(a => a.id));
                        } else {
                          setSelectedAccounts([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Custodian</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Opened Date</TableHead>
                  <TableHead>Holdings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowDetailModal(true);
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAccounts([...selectedAccounts, account.id]);
                          } else {
                            setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{account.accountName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{account.accountNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAccountNumber(account.accountNumber);
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(account.clientName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{account.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{account.custodian}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.accountType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                      {account.status === 'Blocked' && (
                        <div className="flex items-center mt-1 text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Account blocked—no trades allowed
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{account.currency}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(account.aum, account.currency)}
                      </div>
                      <div className="text-xs text-green-600">{account.trend}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{account.openedDate}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        {account.holdings}
                      </Button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
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

      {/* Create Account Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account for an existing client
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name *</label>
              <Input placeholder="Enter account name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number *</label>
              <Input placeholder="Enter account number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Linked Client *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Search client..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">John Matthews</SelectItem>
                  <SelectItem value="c2">Tech Solutions Pte Ltd</SelectItem>
                  <SelectItem value="c3">Maria Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Custodian/Bank *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select custodian" />
                </SelectTrigger>
                <SelectContent>
                  {custodians.map(custodian => (
                    <SelectItem key={custodian} value={custodian}>{custodian}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned RM *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select RM" />
                </SelectTrigger>
                <SelectContent>
                  {rms.map(rm => (
                    <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Opened Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={new Date()} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Source of Funds/Wealth</label>
              <Textarea placeholder="Describe the source of funds..." />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAccount}>
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Building2 className="w-6 h-6" />
              <div>
                <div className="text-xl font-bold">{selectedAccount?.accountName}</div>
                <div className="text-sm text-gray-500 font-mono">{selectedAccount?.accountNumber}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Account Detail Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {['profile', 'holdings', 'transactions', 'fees', 'documents', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-2 px-1 border-b-2 font-medium text-sm capitalize",
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab === 'fees' ? 'Fee/Retrocession' : tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Name</label>
                        <Input value={selectedAccount?.accountName || ''} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Number</label>
                        <Input value={selectedAccount?.accountNumber || ''} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Linked Client</label>
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {getInitials(selectedAccount?.clientName || '')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{selectedAccount?.clientName}</span>
                          <Button size="sm" variant="ghost" className="ml-auto text-blue-600">
                            View Client Profile
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Select value={selectedAccount?.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Custodian/Bank</label>
                        <Select value={selectedAccount?.custodian}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {custodians.map(custodian => (
                              <SelectItem key={custodian} value={custodian}>{custodian}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Type</label>
                        <Select value={selectedAccount?.accountType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accountTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Assigned RM</label>
                        <Select value={selectedAccount?.assignedRM}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rms.map(rm => (
                              <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Currency</label>
                        <Input value={selectedAccount?.currency || ''} disabled />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Request Compliance Review
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Close Account
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holdings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Holdings Overview</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Holdings
                  </Button>
                </div>
                <div className="text-center py-12 text-gray-500">
                  Holdings data will be displayed here
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <div className="text-center py-12 text-gray-500">
                  Transaction data will be displayed here
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fee & Retrocession</h3>
                <div className="text-center py-12 text-gray-500">
                  Fee and retrocession data will be displayed here
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                <div className="text-center py-12 text-gray-500">
                  Account documents will be displayed here
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activity & Notes</h3>
                <div className="text-center py-12 text-gray-500">
                  Activity timeline and notes will be displayed here
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
