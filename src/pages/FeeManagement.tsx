
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calculator, 
  Plus, 
  Settings, 
  DollarSign, 
  Percent, 
  Calendar,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const FeeManagement = () => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planType, setPlanType] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [flatRateAmount, setFlatRateAmount] = useState('');
  const [agencyCommission, setAgencyCommission] = useState('');

  // Mock data for fee plans
  const feePlans = [
    {
      id: 'FP001',
      name: 'Premium Management Plan',
      type: 'Management Fee',
      currency: 'USD',
      frequency: 'Quarterly',
      flatRate: 50000,
      agencyCommission: 2.5,
      status: 'Active',
      clients: 25,
      totalAUM: 125000000
    },
    {
      id: 'FP002',
      name: 'Performance Fee Structure',
      type: 'Performance Fee',
      currency: 'EUR',
      frequency: 'Annual',
      flatRate: 0,
      agencyCommission: 15.0,
      status: 'Active',
      clients: 18,
      totalAUM: 89000000
    },
    {
      id: 'FP003',
      name: 'Advisory Service Plan',
      type: 'Advisory Fee',
      currency: 'USD',
      frequency: 'Monthly',
      flatRate: 25000,
      agencyCommission: 1.8,
      status: 'Draft',
      clients: 0,
      totalAUM: 0
    }
  ];

  const feeCalculations = [
    {
      id: 'FC001',
      client: 'ABC Investment Fund',
      plan: 'Premium Management Plan',
      baseAmount: 1200000,
      calculatedFee: 18000,
      agencyCommission: 450,
      netFee: 17550,
      status: 'Calculated',
      date: '2024-01-15'
    },
    {
      id: 'FC002',
      client: 'XYZ Capital',
      plan: 'Performance Fee Structure',
      baseAmount: 850000,
      calculatedFee: 127500,
      agencyCommission: 19125,
      netFee: 108375,
      status: 'Approved',
      date: '2024-01-14'
    }
  ];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Calculated': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreatePlan = () => {
    // Logic to create new fee plan
    console.log('Creating new plan:', {
      planType,
      currency,
      paymentFrequency,
      flatRateAmount,
      agencyCommission
    });
    setShowPlanModal(false);
    // Reset form
    setPlanType('');
    setCurrency('USD');
    setPaymentFrequency('');
    setFlatRateAmount('');
    setAgencyCommission('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-1">Manage fee structures and calculations for EAM operations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Fees
          </Button>
          <Button onClick={() => setShowPlanModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feePlans.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Fee structures in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(feePlans.reduce((sum, plan) => sum + plan.totalAUM, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Under fee management</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(285750)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.4%</div>
            <p className="text-xs text-muted-foreground">Agency commission rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Fee Plans</TabsTrigger>
          <TabsTrigger value="calculations">Fee Calculations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Plan Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan ID</TableHead>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Flat Rate</TableHead>
                    <TableHead>Agency Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feePlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono">{plan.id}</TableCell>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.type}</Badge>
                      </TableCell>
                      <TableCell>{plan.currency}</TableCell>
                      <TableCell>{plan.frequency}</TableCell>
                      <TableCell>{formatCurrency(plan.flatRate, plan.currency)}</TableCell>
                      <TableCell>{plan.agencyCommission}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(plan.status)}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.clients}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Calculation ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Fee Plan</TableHead>
                    <TableHead>Base Amount</TableHead>
                    <TableHead>Calculated Fee</TableHead>
                    <TableHead>Agency Commission</TableHead>
                    <TableHead>Net Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeCalculations.map((calc) => (
                    <TableRow key={calc.id}>
                      <TableCell className="font-mono">{calc.id}</TableCell>
                      <TableCell className="font-medium">{calc.client}</TableCell>
                      <TableCell>{calc.plan}</TableCell>
                      <TableCell>{formatCurrency(calc.baseAmount)}</TableCell>
                      <TableCell>{formatCurrency(calc.calculatedFee)}</TableCell>
                      <TableCell>{formatCurrency(calc.agencyCommission)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(calc.netFee)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(calc.status)}>
                          {calc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{calc.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Fee Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Management Fees</span>
                    <span className="font-bold">{formatCurrency(125000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance Fees</span>
                    <span className="font-bold">{formatCurrency(108375)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Advisory Fees</span>
                    <span className="font-bold">{formatCurrency(52375)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agency Commission Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Commission Paid</span>
                    <span className="font-bold">{formatCurrency(19575)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Commission Rate</span>
                    <span className="font-bold">6.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Net Revenue</span>
                    <span className="font-bold text-green-600">{formatCurrency(266175)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Plan Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Fee Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planType">Plan Type</Label>
                <Select value={planType} onValueChange={setPlanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="management">Management Fee</SelectItem>
                    <SelectItem value="performance">Performance Fee</SelectItem>
                    <SelectItem value="advisory">Advisory Fee</SelectItem>
                    <SelectItem value="transaction">Transaction Fee</SelectItem>
                    <SelectItem value="custodial">Custodial Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="on-demand">On Demand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="flatRateAmount">Flat Rate Amount</Label>
                <Input
                  id="flatRateAmount"
                  type="number"
                  placeholder="Enter flat rate amount"
                  value={flatRateAmount}
                  onChange={(e) => setFlatRateAmount(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="agencyCommission">Agency Commission (%)</Label>
                <Input
                  id="agencyCommission"
                  type="number"
                  step="0.1"
                  placeholder="Enter agency commission percentage"
                  value={agencyCommission}
                  onChange={(e) => setAgencyCommission(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlan}>
                Create Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeManagement;
