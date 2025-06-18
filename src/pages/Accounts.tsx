
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User,
  Shield,
  UserCheck,
  Pen,
  FileUp,
  Bank
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Accounts = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'client' | 'bank'>('client');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAuthMatrix, setShowAuthMatrix] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
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

  // Mock data with additional authorization info
  const accountsData = [
    {
      id: '1',
      accountName: 'Matthews Investment Account',
      accountNumber: 'ACC-2024-001',
      clientName: 'John Matthews',
      clientId: 'C-1247',
      custodian: 'BOS (Bank of Singapore)',
      accountType: 'Brokerage',
      status: 'Open',
      currency: 'SGD',
      aum: 2450000,
      openedDate: '2024-01-15',
      holdings: 12,
      assignedRM: 'Sarah Chen',
      trend: '+2.3%',
      authorizationStatus: 'Complete'
    },
    {
      id: '2',
      accountName: 'Corporate Treasury Account',
      accountNumber: 'ACC-2024-002',
      clientName: 'Tech Solutions Pte Ltd',
      clientId: 'C-1248',
      custodian: 'CA Indosuez',
      accountType: 'Corporate',
      status: 'Pending',
      currency: 'USD',
      aum: 5600000,
      openedDate: '2024-02-01',
      holdings: 8,
      assignedRM: 'Michael Wong',
      trend: '+1.8%',
      authorizationStatus: 'Pending'
    },
    {
      id: '3',
      accountName: 'Retirement Portfolio',
      accountNumber: 'ACC-2024-003',
      clientName: 'Maria Rodriguez',
      clientId: 'C-1249',
      custodian: 'LGT Bank',
      accountType: 'Retirement',
      status: 'Blocked',
      currency: 'SGD',
      aum: 890000,
      openedDate: '2024-01-20',
      holdings: 15,
      assignedRM: 'David Tan',
      trend: '-0.5%',
      authorizationStatus: 'Incomplete'
    }
  ];

  // Mock authorization matrix data
  const authorizationMatrix = {
    'BOS (Bank of Singapore)': {
      signatories: [
        {
          id: '1',
          name: 'FANG Chen Chun',
          roles: {
            'Director': { active: true, mandateLimit: 'Unlimited', effectiveDate: '2024-01-01', expiry: '2025-12-31', status: 'Active' },
            'ATR': { active: false, mandateLimit: '', effectiveDate: '', expiry: '', status: '' },
            'AS': { active: true, mandateLimit: '500k', effectiveDate: '2024-01-01', expiry: '2025-12-31', status: 'Active' },
            'ID Delegate': { active: false, mandateLimit: '', effectiveDate: '', expiry: '', status: '' }
          }
        },
        {
          id: '2',
          name: 'LI Jianmin',
          roles: {
            'Director': { active: false, mandateLimit: '', effectiveDate: '', expiry: '', status: '' },
            'ATR': { active: true, mandateLimit: '1M', effectiveDate: '2024-02-01', expiry: '2025-12-31', status: 'Active' },
            'AS': { active: true, mandateLimit: '750k', effectiveDate: '2024-02-01', expiry: '2025-12-31', status: 'Pending', comments: 'Pending—formal relationship required' },
            'ID Delegate': { active: true, mandateLimit: 'N/A', effectiveDate: '2024-01-15', expiry: '2025-12-31', status: 'Active' }
          }
        }
      ]
    },
    'CA Indosuez': {
      signatories: [
        {
          id: '3',
          name: 'WANG Mei Lin',
          roles: {
            'Director': { active: true, mandateLimit: 'Unlimited', effectiveDate: '2024-01-01', expiry: '2025-12-31', status: 'Active' },
            'ATR': { active: false, mandateLimit: '', effectiveDate: '', expiry: '', status: '' },
            'AS': { active: false, mandateLimit: '', effectiveDate: '', expiry: '', status: '' },
            'ID Delegate': { active: true, mandateLimit: 'N/A', effectiveDate: '2024-01-01', expiry: '2025-12-31', status: 'Active' }
          }
        }
      ]
    }
  };

  const custodians = ['BOS (Bank of Singapore)', 'CA Indosuez', 'LGT Bank', 'Standard Chartered', 'Citibank'];
  const accountTypes = ['Brokerage', 'Corporate', 'Retirement', 'Margin', 'Fund', 'Bank'];
  const currencies = ['SGD', 'USD', 'EUR', 'HKD', 'GBP'];
  const statuses = ['Open', 'Closed', 'Pending', 'In Progress', 'Blocked'];
  const rms = ['Sarah Chen', 'Michael Wong', 'David Tan', 'Lisa Kumar', 'James Park'];
  const roles = ['Director', 'ATR', 'AS', 'ID Delegate'];

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

  const getAuthStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Incomplete': return 'bg-red-100 text-red-800';
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

  const handleAuthorizationClick = (clientName: string, bankName?: string) => {
    setSelectedClient(clientName);
    setSelectedBank(bankName || null);
    setShowAuthMatrix(true);
  };

  const handleUpdateSignatories = (bankName: string) => {
    setSelectedBank(bankName);
    setSelectedClient(null);
    setShowAuthMatrix(true);
  };

  const handleExportMatrix = (bankName: string) => {
    toast({
      title: "Export Started",
      description: `Authorization matrix for ${bankName} is being exported`,
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

  const groupedByBank = filteredAccounts.reduce((acc, account) => {
    const bank = account.custodian;
    if (!acc[bank]) {
      acc[bank] = [];
    }
    acc[bank].push(account);
    return acc;
  }, {} as Record<string, typeof accountsData>);

  const renderClientView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Client Accounts Overview</CardTitle>
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
                <TableHead>Bank</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bank Authorization</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">AUM</TableHead>
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
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAuthStatusColor(account.authorizationStatus)}>
                        {account.authorizationStatus}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAuthorizationClick(account.clientName, account.custodian)}
                        title="View Bank Authorization"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
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
  );

  const renderBankView = () => (
    <div className="space-y-6">
      {Object.entries(groupedByBank).map(([bankName, accounts]) => (
        <Card key={bankName}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bank className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{bankName}</CardTitle>
                  <CardDescription>{accounts.length} accounts</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateSignatories(bankName)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Update Signatories
                </Button>
                <Button variant="outline" size="sm">
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportMatrix(bankName)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Matrix
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Authorization</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Holdings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-semibold text-gray-900">{account.accountName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{account.accountNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAccountNumber(account.accountNumber)}
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
                      <Badge variant="outline">{account.accountType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getAuthStatusColor(account.authorizationStatus)}>
                          {account.authorizationStatus}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAuthorizationClick(account.clientName, bankName)}
                          title="View Authorization Details"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
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
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        {account.holdings}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Bank Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Summary:</span> {accounts.length} accounts • 
                  Total AUM: {formatCurrency(accounts.reduce((sum, acc) => sum + acc.aum, 0), 'USD')} • 
                  Authorized Signatories: {authorizationMatrix[bankName]?.signatories?.length || 0}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthorizationClick('', bankName)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Signatories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage client accounts and bank authorizations</p>
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

      {/* View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'client' | 'bank')}>
              <TabsList>
                <TabsTrigger value="client" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Client View</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Bank View</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
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

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select value={filters.custodian} onValueChange={(value) => setFilters({...filters, custodian: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Bank/Custodian" />
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
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Update Authorization')}>
                  Bulk Update Authorization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {activeView === 'client' ? renderClientView() : renderBankView()}

      {/* Authorization Matrix Modal */}
      <Dialog open={showAuthMatrix} onOpenChange={setShowAuthMatrix}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center space-x-3">
                  <Shield className="w-6 h-6" />
                  <div>
                    <div className="text-xl font-bold">Authorization Matrix</div>
                    <div className="text-sm text-gray-500">
                      {selectedBank ? `Bank: ${selectedBank}` : ''}
                      {selectedClient ? ` • Client: ${selectedClient}` : ''}
                    </div>
                  </div>
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pending-only"
                    checked={showPendingOnly}
                    onCheckedChange={setShowPendingOnly}
                  />
                  <label htmlFor="pending-only" className="text-sm">Show pending changes only</label>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Matrix
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Matrix
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {selectedBank && authorizationMatrix[selectedBank] && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{selectedBank} - Authorized Signatories</h3>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Signatory Name</TableHead>
                        {roles.map(role => (
                          <TableHead key={role} className="text-center min-w-32">{role}</TableHead>
                        ))}
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authorizationMatrix[selectedBank].signatories.map((signatory) => (
                        <TableRow key={signatory.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(signatory.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{signatory.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          {roles.map(role => {
                            const roleData = signatory.roles[role];
                            return (
                              <TableCell key={role} className="p-2">
                                {roleData.active ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-center">
                                      <Badge 
                                        className={
                                          roleData.status === 'Active' ? 'bg-green-100 text-green-800' :
                                          roleData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                        }
                                      >
                                        ✓
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-center space-y-1">
                                      {roleData.mandateLimit && (
                                        <div><strong>Limit:</strong> {roleData.mandateLimit}</div>
                                      )}
                                      {roleData.effectiveDate && (
                                        <div><strong>From:</strong> {roleData.effectiveDate}</div>
                                      )}
                                      {roleData.expiry && (
                                        <div><strong>To:</strong> {roleData.expiry}</div>
                                      )}
                                      {roleData.status && (
                                        <div><strong>Status:</strong> {roleData.status}</div>
                                      )}
                                      {roleData.comments && (
                                        <div className="text-yellow-600 italic">{roleData.comments}</div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-400">—</div>
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Signatory
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Apply to Multiple Banks
                    </Button>
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
