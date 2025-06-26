import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Settings,
  Eye,
  Edit,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileBarChart,
  Calculator,
  Banknote,
  Activity
} from 'lucide-react';
import { UploadStatementModal } from '@/components/UploadStatementModal';
import { ExportClientReportModal } from '@/components/ExportClientReportModal';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export const ClientDetailsModal = ({ isOpen, onClose, client }: ClientDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showUploadStatement, setShowUploadStatement] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [activeHoldingsTab, setActiveHoldingsTab] = useState('positions');

  if (!client) return null;

  // Mock data for advanced EAM features
  const clientData = {
    ...client,
    riskProfile: 'Moderate',
    investmentExperience: 'Advanced',
    netWorth: 2500000,
    annualIncome: 450000,
    totalAUM: 1850000,
    accounts: [
      { id: 'ACC001', name: 'Investment Portfolio', type: 'Discretionary', balance: 1200000, status: 'Active' },
      { id: 'ACC002', name: 'Pension Fund', type: 'Advisory', balance: 450000, status: 'Active' },
      { id: 'ACC003', name: 'Trading Account', type: 'Execution Only', balance: 200000, status: 'Restricted' }
    ],
    documents: [
      { name: 'KYC Documentation', type: 'KYC', status: 'Approved', date: '2024-01-15' },
      { name: 'Investment Policy Statement', type: 'IPS', status: 'Current', date: '2024-01-10' },
      { name: 'Risk Assessment', type: 'Risk', status: 'Review Required', date: '2023-12-20' },
      { name: 'Tax Documentation', type: 'Tax', status: 'Pending', date: '2024-01-18' }
    ],
    permissions: {
      trading: true,
      reporting: true,
      documentAccess: true,
      advisoryServices: true,
      discretionaryManagement: false,
      derivativesTrading: true,
      marginTrading: false,
      internationalInvestments: true
    },
    complianceChecks: [
      { check: 'AML Screening', status: 'Passed', date: '2024-01-15', nextReview: '2024-07-15' },
      { check: 'Sanctions Check', status: 'Passed', date: '2024-01-15', nextReview: '2024-04-15' },
      { check: 'PEP Status', status: 'Clear', date: '2024-01-10', nextReview: '2024-07-10' },
      { check: 'Tax Compliance', status: 'Review Required', date: '2024-01-05', nextReview: '2024-02-05' }
    ],
    holdings: {
      positions: [
        { symbol: 'AAPL', name: 'Apple Inc.', quantity: 500, price: 182.52, value: 91260, allocation: 4.93, change: 2.15 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 300, price: 378.85, value: 113655, allocation: 6.14, change: -0.85 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 200, price: 138.21, value: 27642, allocation: 1.49, change: 1.25 },
        { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 150, price: 244.12, value: 36618, allocation: 1.98, change: -3.42 }
      ],
      cashDistribution: [
        { account: 'Investment Portfolio', currency: 'USD', amount: 125000, yield: 4.2 },
        { account: 'Pension Fund', currency: 'EUR', amount: 75000, yield: 3.8 },
        { account: 'Trading Account', currency: 'GBP', amount: 50000, yield: 4.5 }
      ],
      profitLoss: {
        unrealized: { gain: 45620, loss: -12350, net: 33270 },
        realized: { gain: 28500, loss: -8200, net: 20300 },
        total: { gain: 74120, loss: -20550, net: 53570 }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Restricted': 'bg-red-100 text-red-800',
      'Approved': 'bg-green-100 text-green-800',
      'Current': 'bg-blue-100 text-blue-800',
      'Review Required': 'bg-orange-100 text-orange-800',
      'Passed': 'bg-green-100 text-green-800',
      'Clear': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Passed':
      case 'Clear':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
      case 'Review Required':
        return <Clock className="w-4 h-4" />;
      case 'Restricted':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {clientData.first_name?.[0]}{clientData.last_name?.[0]}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {clientData.first_name} {clientData.last_name}
                </DialogTitle>
                <p className="text-gray-600">{clientData.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUploadStatement(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Statement
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExportReport(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Client Report
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      value={`${clientData.first_name} ${clientData.last_name}`}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={clientData.email} disabled={!editMode} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={clientData.phone || '+1 (555) 123-4567'} disabled={!editMode} />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input value="1985-03-15" disabled={!editMode} />
                  </div>
                </CardContent>
              </Card>

              {/* Financial Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Total AUM</Label>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(clientData.totalAUM)}
                    </div>
                  </div>
                  <div>
                    <Label>Net Worth</Label>
                    <div className="text-lg font-semibold">
                      {formatCurrency(clientData.netWorth)}
                    </div>
                  </div>
                  <div>
                    <Label>Annual Income</Label>
                    <div className="text-lg font-semibold">
                      {formatCurrency(clientData.annualIncome)}
                    </div>
                  </div>
                  <div>
                    <Label>Risk Profile</Label>
                    <Badge variant="outline">{clientData.riskProfile}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Investment Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Investment Experience</Label>
                    <Badge variant="secondary">{clientData.investmentExperience}</Badge>
                  </div>
                  <div>
                    <Label>Investment Objectives</Label>
                    <Textarea 
                      value="Long-term wealth preservation and growth with moderate risk tolerance. Focus on diversified portfolio across asset classes."
                      disabled={!editMode}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Client Since</Label>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      January 2022
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account ID</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.accounts.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{account.id}</TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.type}</TableCell>
                        <TableCell>{formatCurrency(account.balance)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(account.status)}>
                            {getStatusIcon(account.status)}
                            <span className="ml-1">{account.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Holdings Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeHoldingsTab} onValueChange={setActiveHoldingsTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="positions">Positions</TabsTrigger>
                    <TabsTrigger value="cash">Cash Distribution</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
                    <TabsTrigger value="reports">Statement & Reports</TabsTrigger>
                  </TabsList>

                  <TabsContent value="positions" className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Security Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Market Value</TableHead>
                          <TableHead>Allocation %</TableHead>
                          <TableHead>Day Change %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientData.holdings.positions.map((position, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono font-bold">{position.symbol}</TableCell>
                            <TableCell className="font-medium">{position.name}</TableCell>
                            <TableCell>{position.quantity.toLocaleString()}</TableCell>
                            <TableCell>{formatCurrency(position.price)}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(position.value)}</TableCell>
                            <TableCell>{position.allocation}%</TableCell>
                            <TableCell>
                              <div className={`flex items-center ${position.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {position.change >= 0 ? 
                                  <TrendingUp className="w-4 h-4 mr-1" /> : 
                                  <TrendingDown className="w-4 h-4 mr-1" />
                                }
                                {position.change}%
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="cash" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {clientData.holdings.cashDistribution.map((cash, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{cash.account}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Currency</span>
                                <Badge variant="outline">{cash.currency}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Amount</span>
                                <span className="font-semibold">{formatCurrency(cash.amount)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Yield</span>
                                <span className="text-green-600 font-medium">{cash.yield}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Asset Allocation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>Equities</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                                </div>
                                <span className="text-sm font-medium">65%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Fixed Income</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                                </div>
                                <span className="text-sm font-medium">25%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Cash & Equivalents</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '10%'}}></div>
                                </div>
                                <span className="text-sm font-medium">10%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>YTD Return</span>
                              <span className="text-green-600 font-semibold">+12.4%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>1 Year Return</span>
                              <span className="text-green-600 font-semibold">+18.7%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Volatility</span>
                              <span className="font-semibold">14.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Sharpe Ratio</span>
                              <span className="font-semibold">1.23</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pnl" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Unrealized P&L</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Gains</span>
                              <span className="text-green-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.unrealized.gain)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Losses</span>
                              <span className="text-red-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.unrealized.loss)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold">
                              <span>Net P&L</span>
                              <span className="text-green-600">{formatCurrency(clientData.holdings.profitLoss.unrealized.net)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Realized P&L</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Gains</span>
                              <span className="text-green-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.realized.gain)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Losses</span>
                              <span className="text-red-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.realized.loss)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold">
                              <span>Net P&L</span>
                              <span className="text-green-600">{formatCurrency(clientData.holdings.profitLoss.realized.net)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Total P&L</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Gains</span>
                              <span className="text-green-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.total.gain)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Losses</span>
                              <span className="text-red-600 font-semibold">{formatCurrency(clientData.holdings.profitLoss.total.loss)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                              <span>Net P&L</span>
                              <span className="text-green-600">{formatCurrency(clientData.holdings.profitLoss.total.net)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col">
                        <FileBarChart className="w-6 h-6 mb-2" />
                        <span>Portfolio Statement</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Calculator className="w-6 h-6 mb-2" />
                        <span>Performance Report</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Banknote className="w-6 h-6 mb-2" />
                        <span>Transaction Report</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <FileText className="w-6 h-6 mb-2" />
                        <span>Tax Report</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Client Documents</CardTitle>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{doc.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
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

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Client Permissions & Access Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Trading Permissions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Trading Authorization</Label>
                        <Switch 
                          checked={clientData.permissions.trading}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Derivatives Trading</Label>
                        <Switch 
                          checked={clientData.permissions.derivativesTrading}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Margin Trading</Label>
                        <Switch 
                          checked={clientData.permissions.marginTrading}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>International Investments</Label>
                        <Switch 
                          checked={clientData.permissions.internationalInvestments}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Service Permissions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Reporting Access</Label>
                        <Switch 
                          checked={clientData.permissions.reporting}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Document Access</Label>
                        <Switch 
                          checked={clientData.permissions.documentAccess}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Advisory Services</Label>
                        <Switch 
                          checked={clientData.permissions.advisoryServices}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Discretionary Management</Label>
                        <Switch 
                          checked={clientData.permissions.discretionaryManagement}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Compliance & Regulatory Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compliance Check</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.complianceChecks.map((check, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{check.check}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(check.status)}>
                            {getStatusIcon(check.status)}
                            <span className="ml-1">{check.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{check.date}</TableCell>
                        <TableCell>{check.nextReview}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload Statement Modal */}
        <UploadStatementModal
          isOpen={showUploadStatement}
          onClose={() => setShowUploadStatement(false)}
          clientId={client?.id}
        />

        {/* Export Client Report Modal */}
        <ExportClientReportModal
          isOpen={showExportReport}
          onClose={() => setShowExportReport(false)}
          client={client}
        />
      </DialogContent>
    </Dialog>
  );
};
