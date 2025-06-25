
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Upload, Users, Edit } from 'lucide-react';
import { useAccountsContext } from '@/contexts/AccountsContext';

interface BankViewAccountsProps {
  filters: {
    search: string;
    bank: string;
    status: string;
    currency: string;
    rm: string;
  };
  onShowAuthMatrix: (bank?: string, client?: string) => void;
}

const BankViewAccounts = ({ filters, onShowAuthMatrix }: BankViewAccountsProps) => {
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

  // Mock bank data - in real app this would come from account metadata
  const banks = [
    { id: 'bos', name: 'Bank of Singapore', accounts: accounts.slice(0, 3) },
    { id: 'ca_indosuez', name: 'CA Indosuez', accounts: accounts.slice(3, 6) },
    { id: 'lgt', name: 'LGT Bank', accounts: accounts.slice(6, 9) },
    { id: 'ubs', name: 'UBS', accounts: accounts.slice(9) },
  ];

  if (isLoading) {
    return <div className="p-4">Loading accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {banks.map((bank) => (
        <Card key={bank.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {bank.name}
                <Badge variant="outline" className="ml-2">
                  {bank.accounts.length} account{bank.accounts.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowAuthMatrix(bank.id)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Authorized Signatories
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowAuthMatrix(bank.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Signatories
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead>Holdings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signatories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bank.accounts.map((account) => (
                  <TableRow key={account.id}>
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
                      <div className="font-medium">
                        {formatCurrency(account.total_aum, account.base_currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {account.holdings_count} holdings
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.account_status)}>
                        {account.account_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                            J
                          </div>
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                            M
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">2 active</span>
                      </div>
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

export default BankViewAccounts;
