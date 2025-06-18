
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAccounts } from '@/hooks/useAccounts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MoreHorizontal } from 'lucide-react';
import CreateAccountModal from '@/components/CreateAccountModal';
import { Account } from '@/types/account';
import { Badge } from '@/components/ui/badge';

const Accounts = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    account_type: 'all',
    account_status: 'all',
    base_currency: 'all',
    client_search: '',
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const { accounts, isLoading, createAccount, bulkUpdateAccounts } = useAccounts({
    ...filters,
    account_type: filters.account_type === 'all' ? '' : filters.account_type,
    account_status: filters.account_status === 'all' ? '' : filters.account_status,
    base_currency: filters.base_currency === 'all' ? '' : filters.base_currency,
  });
  const { toast } = useToast();

  const handleAccountClick = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    setSelectedAccounts((prevSelected) =>
      checked
        ? [...prevSelected, accountId]
        : prevSelected.filter((id) => id !== accountId)
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectedAccounts(checked ? accounts.map((account) => account.id) : []);
  };

  const handleBulkAction = async () => {
    if (selectedAccounts.length === 0 || !bulkAction) return;

    try {
      let status: Account['account_status'] = 'active';
      if (bulkAction === 'activate') status = 'active';
      else if (bulkAction === 'suspend') status = 'suspended';
      else if (bulkAction === 'close') status = 'closed';

      const result = await bulkUpdateAccounts(selectedAccounts, {
        account_status: status,
      });

      if (result?.success) {
        toast({
          title: 'Success',
          description: `Successfully ${bulkAction}d ${selectedAccounts.length} accounts.`,
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to ${bulkAction} accounts.`,
          variant: 'destructive',
        });
      }
      setSelectedAccounts([]);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount?: number, currency = 'USD') => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
            Manage your client accounts here.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="client_search">Search</Label>
              <Input
                type="text"
                id="client_search"
                name="client_search"
                placeholder="Search client name, email, account name or number..."
                value={filters.client_search}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                value={filters.account_type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, account_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="joint">Joint</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account_status">Account Status</Label>
              <Select
                value={filters.account_status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, account_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="base_currency">Base Currency</Label>
              <Select
                value={filters.base_currency}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, base_currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="HKD">HKD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Accounts
            <div className="flex items-center space-x-2">
              {selectedAccounts.length > 0 && (
                <>
                  <Select onValueChange={setBulkAction}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Bulk actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activate">Activate</SelectItem>
                      <SelectItem value="suspend">Suspend</SelectItem>
                      <SelectItem value="close">Close</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction}>
                    Apply ({selectedAccounts.length})
                  </Button>
                </>
              )}
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opening Date</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow 
                    key={account.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={(e) => handleSelectAccount(account.id, e.target.checked)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{account.account_name}</div>
                        <div className="text-sm text-gray-500">{account.account_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {account.client?.first_name} {account.client?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{account.client?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {account.account_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.base_currency}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">
                          {formatCurrency(account.total_aum, account.base_currency)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.holdings_count} holdings
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.account_status)}>
                        {account.account_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(account.opening_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Account Modal */}
      <CreateAccountModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateAccount={createAccount}
      />
    </div>
  );
};

export default Accounts;
