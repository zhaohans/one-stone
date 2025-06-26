
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';
import { useAccountsContext } from '@/contexts/AccountsContext';
import { FeeCalculationModal } from '@/components/FeeCalculationModal';
import { FeesTable } from '@/components/FeesTable';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Users, 
  PieChart, 
  BarChart3,
  Download,
  Filter,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

const FeeReports = () => {
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fees, setFees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getFees } = useFeeCalculation();
  const { accounts } = useAccountsContext();

  const loadFees = async () => {
    const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined;
    const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined;
    
    const result = await getFees(selectedAccount === 'all' ? undefined : selectedAccount, startDate, endDate);
    if (result.success) {
      setFees(result.fees);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      console.log('Loading fees with filters:', { selectedAccount, dateRange });
      const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined;
      const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined;
      
      const result = await getFees(selectedAccount === 'all' ? undefined : selectedAccount, startDate, endDate);
      if (result.success) {
        setFees(result.fees);
      }
    };

    loadData();
  }, [selectedAccount, dateRange]);

  // Mock data for advanced EAM features
  const revenueData = {
    totalRevenue: 2847350,
    monthlyGrowth: 12.5,
    quarterlyGrowth: 34.2,
    yearlyGrowth: 156.8,
    revenueByProduct: [
      { name: 'Management Fees', amount: 1247350, percentage: 43.8 },
      { name: 'Performance Fees', amount: 856200, percentage: 30.1 },
      { name: 'Transaction Fees', amount: 432100, percentage: 15.2 },
      { name: 'Advisory Fees', amount: 311700, percentage: 10.9 }
    ]
  };

  const retrocessionData = {
    totalRetrocessions: 456780,
    pendingPayments: 89420,
    paidThisMonth: 367360,
    partners: [
      { name: 'Bank Alpha', amount: 156780, status: 'paid', dueDate: '2024-01-15' },
      { name: 'Custody Beta', amount: 89420, status: 'pending', dueDate: '2024-01-20' },
      { name: 'Platform Gamma', amount: 121160, status: 'paid', dueDate: '2024-01-10' },
      { name: 'Service Delta', amount: 89420, status: 'processing', dueDate: '2024-01-25' }
    ]
  };

  const managementFeeData = {
    totalAUM: 125000000,
    averageFeeRate: 1.35,
    totalManagementFees: 1687500,
    feesByStrategy: [
      { strategy: 'Equity Growth', aum: 45000000, rate: 1.5, fees: 675000 },
      { strategy: 'Fixed Income', aum: 35000000, rate: 1.2, fees: 420000 },
      { strategy: 'Multi-Asset', aum: 25000000, rate: 1.4, fees: 350000 },
      { strategy: 'Alternative', aum: 20000000, rate: 1.8, fees: 360000 }
    ]
  };

  const totalFees = fees.reduce((sum, fee) => sum + fee.calculated_amount, 0);
  const paidFees = fees.filter(fee => fee.is_paid).reduce((sum, fee) => sum + fee.calculated_amount, 0);
  const pendingFees = totalFees - paidFees;
  const totalRetrocessions = fees.reduce((sum, fee) => {
    if (fee.retrocessions) {
      return sum + fee.retrocessions.reduce((retroSum: number, retro: any) => retroSum + retro.amount, 0);
    }
    return sum;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management & Revenue Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive fee management and revenue analytics for EAM operations</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowCalculationModal(true)}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Fee
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              {formatPercentage(revenueData.monthlyGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Management Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(managementFeeData.totalManagementFees)}</div>
            <div className="text-xs text-muted-foreground">
              AUM: {formatCurrency(managementFeeData.totalAUM)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retrocessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(retrocessionData.totalRetrocessions)}</div>
            <div className="text-xs text-orange-600">
              {formatCurrency(retrocessionData.pendingPayments)} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managementFeeData.averageFeeRate}%</div>
            <div className="text-xs text-muted-foreground">
              Across all strategies
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="management">Management Fees</TabsTrigger>
          <TabsTrigger value="retrocession">Retrocessions</TabsTrigger>
          <TabsTrigger value="fees">Fee Records</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.revenueByProduct.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.percentage}% of total</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(product.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Growth</span>
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {formatPercentage(revenueData.monthlyGrowth)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quarterly Growth</span>
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {formatPercentage(revenueData.quarterlyGrowth)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Yearly Growth</span>
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {formatPercentage(revenueData.yearlyGrowth)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Management Fees by Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strategy</TableHead>
                    <TableHead>AUM</TableHead>
                    <TableHead>Fee Rate</TableHead>
                    <TableHead>Annual Fees</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managementFeeData.feesByStrategy.map((strategy, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{strategy.strategy}</TableCell>
                      <TableCell>{formatCurrency(strategy.aum)}</TableCell>
                      <TableCell>{strategy.rate}%</TableCell>
                      <TableCell>{formatCurrency(strategy.fees)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          12.5%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retrocession" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retrocession Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retrocessionData.partners.map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>{formatCurrency(partner.amount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={partner.status === 'paid' ? 'default' : 
                                  partner.status === 'pending' ? 'destructive' : 'secondary'}
                        >
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{partner.dueDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Process</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Fee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Account</label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="All accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All accounts</SelectItem>
                      {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name} ({account.account_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search fees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedAccount('all');
                      setDateRange(undefined);
                      setSearchTerm('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <FeesTable fees={fees} onFeesUpdate={loadFees} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fee Calculation Modal */}
      <FeeCalculationModal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        onFeeCalculated={loadFees}
      />
    </div>
  );
};

export default FeeReports;
