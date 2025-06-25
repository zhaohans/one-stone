
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, MoreHorizontal } from 'lucide-react';
import { useAccountsContext } from '@/contexts/AccountsContext';
import { Account } from '@/types/account';

interface ClientViewAccountsProps {
  filters: {
    search: string;
    bank: string;
    status: string;
    currency: string;
    rm: string;
  };
  onShowAuthMatrix: (bank?: string, client?: string) => void;
}

const ClientViewAccounts = ({ filters, onShowAuthMatrix }: ClientViewAccountsProps) => {
  const { accounts, isLoading } = useAccountsContext();

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

  // Group accounts by client
  const groupedAccounts = accounts.reduce((acc, account) => {
    const clientKey = account.client?.id || 'unknown';
    if (!acc[clientKey]) {
      acc[clientKey] = {
        client: account.client,
        accounts: []
      };
    }
    acc[clientKey].accounts.push(account);
    return acc;
  }, {} as Record<string, { client: any; accounts: Account[] }>);

  if (isLoading) {
    return <div className="p-4">Loading accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAccounts).map(([clientId, { client, accounts: clientAccounts }]) => (
        <Card key={clientId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {client?.first_name} {client?.last_name}
                <Badge variant="outline" className="ml-2">
                  {clientAccounts.length} account{clientAccounts.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowAuthMatrix(undefined, clientId)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Bank Authorizations
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auth Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{account.account_name}</div>
                        <div className="text-sm text-gray-500">{account.account_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {/* This would come from account metadata or separate bank field */}
                        Bank of Singapore
                      </Badge>
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
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Authorized</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientViewAccounts;
