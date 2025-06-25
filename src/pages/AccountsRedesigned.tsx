
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Filter } from 'lucide-react';
import ClientViewAccounts from '@/components/accounts/ClientViewAccounts';
import BankViewAccounts from '@/components/accounts/BankViewAccounts';
import AuthorizationMatrixModal from '@/components/accounts/AuthorizationMatrixModal';
import { useAccountsContext } from '@/contexts/AccountsContext';

const AccountsRedesigned = () => {
  const [activeView, setActiveView] = useState('client');
  const [showAuthMatrix, setShowAuthMatrix] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    bank: 'all',
    status: 'all',
    currency: 'all',
    rm: 'all'
  });

  const { accounts } = useAccountsContext();

  const handleExportExcel = () => {
    // Export functionality
    console.log('Exporting to Excel...');
  };

  const handleImportAccounts = () => {
    // Import functionality
    console.log('Importing accounts...');
  };

  const handleShowAuthMatrix = (bank?: string, client?: string) => {
    setSelectedBank(bank || null);
    setSelectedClient(client || null);
    setShowAuthMatrix(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Accounts Management</h2>
          <p className="text-muted-foreground">
            Manage client accounts and bank authorizations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleImportAccounts}>
            <Upload className="h-4 w-4 mr-2" />
            Import Accounts
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Search accounts, clients..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <Select value={filters.bank} onValueChange={(value) => handleFilterChange('bank', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Banks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  <SelectItem value="bos">Bank of Singapore</SelectItem>
                  <SelectItem value="ca_indosuez">CA Indosuez</SelectItem>
                  <SelectItem value="lgt">LGT Bank</SelectItem>
                  <SelectItem value="ubs">UBS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Currencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="HKD">HKD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.rm} onValueChange={(value) => handleFilterChange('rm', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All RMs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All RMs</SelectItem>
                  <SelectItem value="john_doe">John Doe</SelectItem>
                  <SelectItem value="jane_smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client View</TabsTrigger>
          <TabsTrigger value="bank">Bank View</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-4">
          <ClientViewAccounts 
            filters={filters}
            onShowAuthMatrix={handleShowAuthMatrix}
          />
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <BankViewAccounts 
            filters={filters}
            onShowAuthMatrix={handleShowAuthMatrix}
          />
        </TabsContent>
      </Tabs>

      {/* Authorization Matrix Modal */}
      <AuthorizationMatrixModal
        open={showAuthMatrix}
        onOpenChange={setShowAuthMatrix}
        bank={selectedBank}
        client={selectedClient}
      />
    </div>
  );
};

export default AccountsRedesigned;
