
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAccounts, Account, AccountFilters } from '@/hooks/useAccounts';
import CreateAccountModal from '@/components/CreateAccountModal';
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
  Landmark,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Accounts = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'client' | 'bank'>('client');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [filters, setFilters] = useState<AccountFilters>({
    account_type: '',
    account_status: '',
    base_currency: '',
    client_search: ''
  });

  // Use real data hooks
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount, bulkUpdateAccounts } = useAccounts(filters);

  const accountTypes = ['brokerage', 'corporate', 'retirement', 'margin', 'fund', 'bank'];
  const currencies = ['SGD', 'USD', 'EUR', 'HKD', 'GBP'];
  const statuses = ['active', 'inactive', 'pending', 'closed', 'suspended'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAccounts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select accounts to perform bulk actions",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (action) {
        case 'Close':
          await bulkUpdateAccounts(selectedAccounts, { account_status: 'closed' });
          break;
        case 'Activate':
          await bulkUpdateAccounts(selectedAccounts, { account_status: 'active' });
          break;
        case 'Export':
          toast({
            title: "Export Started",
            description: `Exporting ${selectedAccounts.length} account(s)`,
          });
          break;
        default:
          toast({
            title: "Action Applied",
            description: `${action} applied to ${selectedAccounts.length} account(s)`,
          });
      }
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "Copied",
      description: "Account number copied to clipboard",
    });
  };

  const handleExport = () => {
    const csvContent = accounts.map(account => [
      account.account_number,
      account.account_name,
      `${account.client?.first_name || ''} ${account.client?.last_name || ''}`,
      account.account_type,
      account.account_status,
      account.base_currency,
      formatCurrency(account.total_aum || 0, account.base_currency)
    ].join(',')).join('\n');

    const blob = new Blob([`Account Number,Account Name,Client,Type,Status,Currency,AUM\n${csvContent}`], 
      { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts_export.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Accounts data exported to CSV",
    });
  };

  const groupedByBank = accounts.reduce((acc, account) => {
    // For now, we'll group by a default custodian since it's not in our current schema
    const bank = 'Default Custodian';
    if (!acc[bank]) {
      acc[bank] = [];
    }
    acc[bank].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const renderClientView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Client Accounts Overview</CardTitle>
          <span className="text-sm text-gray-500">
            Showing {accounts.length} accounts
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading accounts...</span>
          </div>
        ) : accounts.length === 0 ? (
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
                    checked={selectedAccounts.length === accounts.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAccounts(accounts.map(a => a.id));
                      } else {
                        setSelectedAccounts([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">AUM</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
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
                    <div className="font-semibold text-gray-900">{account.account_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{account.account_number}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyAccountNumber(account.account_number);
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
                          {getInitials(account.client?.first_name || '', account.client?.last_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {account.client?.first_name} {account.client?.last_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {account.account_type?.charAt(0).toUpperCase() + account.account_type?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(account.account_status)}>
                      {account.account_status?.charAt(0).toUpperCase() + account.account_status?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{account.base_currency}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(account.total_aum || 0, account.base_currency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      {account.holdings_count || 0}
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
      {Object.entries(groupedByBank).map(([bankName, bankAccounts]) => (
        <Card key={bankName}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Landmark className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{bankName}</CardTitle>
                  <CardDescription>{bankAccounts.length} accounts</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Update Signatories
                </Button>
                <Button variant="outline" size="sm">
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
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
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Holdings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-semibold text-gray-900">{account.account_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{account.account_number}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAccountNumber(account.account_number)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(account.client?.first_name || '', account.client?.last_name || '')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {account.client?.first_name} {account.client?.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {account.account_type?.charAt(0).toUpperCase() + account.account_type?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.account_status)}>
                        {account.account_status?.charAt(0).toUpperCase() + account.account_status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{account.base_currency}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(account.total_aum || 0, account.base_currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        {account.holdings_count || 0}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Summary:</span> {bankAccounts.length} accounts • 
                  Total AUM: {formatCurrency(bankAccounts.reduce((sum, acc) => sum + (acc.total_aum || 0), 0), 'USD')}
                </div>
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
          <Button variant="outline" size="sm" onClick={handleExport}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filters.account_type} onValueChange={(value) => setFilters({...filters, account_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.base_currency} onValueChange={(value) => setFilters({...filters, base_currency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.account_status} onValueChange={(value) => setFilters({...filters, account_status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search client..."
              value={filters.client_search}
              onChange={(e) => setFilters({...filters, client_search: e.target.value})}
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({
                account_type: '', account_status: '', base_currency: '', client_search: ''
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
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Activate')}>
                  Bulk Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                  Bulk Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {activeView === 'client' ? renderClientView() : renderBankView()}

      {/* Create Account Modal */}
      <CreateAccountModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateAccount={createAccount}
      />

      {/* Account Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Building2 className="w-6 h-6" />
              <div>
                <div className="text-xl font-bold">{selectedAccount?.account_name}</div>
                <div className="text-sm text-gray-500 font-mono">{selectedAccount?.account_number}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="border-b">
            <nav className="flex space-x-8">
              {['profile', 'holdings', 'transactions', 'documents'].map((tab) => (
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
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'profile' && selectedAccount && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Name</label>
                        <div className="mt-1 text-sm">{selectedAccount.account_name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Number</label>
                        <div className="mt-1 text-sm font-mono">{selectedAccount.account_number}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Client</label>
                        <div className="mt-1 text-sm">
                          {selectedAccount.client?.first_name} {selectedAccount.client?.last_name}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <Badge className={getStatusColor(selectedAccount.account_status)}>
                            {selectedAccount.account_status?.charAt(0).toUpperCase() + selectedAccount.account_status?.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Type</label>
                        <div className="mt-1 text-sm">
                          {selectedAccount.account_type?.charAt(0).toUpperCase() + selectedAccount.account_type?.slice(1)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Base Currency</label>
                        <div className="mt-1 text-sm">{selectedAccount.base_currency}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Risk Tolerance</label>
                        <div className="mt-1 text-sm">
                          {selectedAccount.risk_tolerance?.charAt(0).toUpperCase() + selectedAccount.risk_tolerance?.slice(1)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Opening Date</label>
                        <div className="mt-1 text-sm">
                          {new Date(selectedAccount.opening_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holdings' && (
              <div className="text-center py-12 text-gray-500">
                Holdings data will be implemented in the next phase
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="text-center py-12 text-gray-500">
                Transaction data will be implemented in the next phase
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12 text-gray-500">
                Document management will be implemented in the next phase
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
