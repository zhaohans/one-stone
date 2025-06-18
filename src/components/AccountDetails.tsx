
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, MoreHorizontal } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import HoldingsTable from './HoldingsTable';
import TransactionsTable from './TransactionsTable';
import DocumentsTable from './DocumentsTable';
import { Skeleton } from '@/components/ui/skeleton';

const AccountDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { accounts, isLoading } = useAccounts();

  const account = accounts.find(acc => acc.id === accountId);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h2>
        <p className="text-gray-600 mb-6">The account you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/accounts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.account_name}</h1>
            <p className="text-gray-600">{account.account_number}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {account.client?.first_name} {account.client?.last_name}
            </div>
            <p className="text-sm text-gray-600">{account.client?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(account.total_aum, account.base_currency)}
            </div>
            <p className="text-sm text-gray-600">{account.holdings_count} holdings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(account.account_status)}>
              {account.account_status}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">
              Opened: {new Date(account.opening_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {account.account_type}
            </div>
            <p className="text-sm text-gray-600">{account.base_currency}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="details">Account Details</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings">
          <HoldingsTable accountId={account.id} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTable accountId={account.id} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTable accountId={account.id} />
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Name</label>
                  <p className="text-sm">{account.account_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Number</label>
                  <p className="text-sm">{account.account_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Type</label>
                  <p className="text-sm capitalize">{account.account_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Base Currency</label>
                  <p className="text-sm">{account.base_currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Opening Date</label>
                  <p className="text-sm">{new Date(account.opening_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Risk Tolerance</label>
                  <p className="text-sm capitalize">{account.risk_tolerance}</p>
                </div>
                {account.investment_objective && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Investment Objective</label>
                    <p className="text-sm">{account.investment_objective}</p>
                  </div>
                )}
                {account.benchmark && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Benchmark</label>
                    <p className="text-sm">{account.benchmark}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountDetails;
