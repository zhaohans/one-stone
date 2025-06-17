import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  Plus,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  Filter
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const ClientManagement = () => {
  const stats = [
    { title: 'Total AUM', value: '83,722,598.67', change: '+5.2%', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Active Clients', value: '142', change: '+8', icon: Users, color: 'bg-blue-500' },
    { title: 'Monthly Fees', value: '2,142,847.00', change: '+12.3%', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Pending Reviews', value: '23', change: '-5', icon: FileText, color: 'bg-orange-500' },
  ];

  const cashDistributionData = [
    { name: 'UBS SG', value: 2142847, percentage: 67.43 },
    { name: 'HSBC SG', value: 1034890, percentage: 32.57 },
  ];

  const productAllocationData = [
    { name: 'Fixed Income', value: 42994127.71, percentage: 51.35, color: '#3B82F6' },
    { name: 'Structure Products', value: 18702186.63, percentage: 22.34, color: '#EF4444' },
    { name: 'Equities', value: 11426138.98, percentage: 13.65, color: '#10B981' },
    { name: 'Deposit', value: 5710746.00, percentage: 6.82, color: '#F59E0B' },
    { name: 'Cash', value: 3177737.34, percentage: 3.80, color: '#8B5CF6' },
    { name: 'Hedge Fund', value: 961444.00, percentage: 1.15, color: '#06B6D4' },
  ];

  const topHoldingsData = [
    { name: 'JPM 8 04/12/22', percentage: 33.82 },
    { name: '6M USD FCN ...', percentage: 19.64 },
    { name: 'Deposit', percentage: 6.82 },
    { name: 'ALPHABET INC...', percentage: 6.09 },
    { name: 'Cash', percentage: 3.80 },
    { name: '5.902% Notes...', percentage: 1.74 },
    { name: '5.50% Notes...', percentage: 1.42 },
    { name: '5.25% Notes...', percentage: 1.22 },
  ];

  const clients = [
    { 
      id: 'C001', 
      name: 'John Smith', 
      email: 'john.smith@email.com', 
      status: 'Active', 
      aum: '5,250,000', 
      lastContact: '2024-01-15',
      rm: 'K. Shen'
    },
    { 
      id: 'C002', 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com', 
      status: 'Pending KYC', 
      aum: '2,800,000', 
      lastContact: '2024-01-12',
      rm: 'K. Shen'
    },
    { 
      id: 'C003', 
      name: 'Michael Chen', 
      email: 'michael.chen@email.com', 
      status: 'Active', 
      aum: '8,100,000', 
      lastContact: '2024-01-14',
      rm: 'A. Wong'
    },
  ];

  // Chart configurations
  const barChartConfig = {
    value: {
      label: "Value",
      color: "#3B82F6",
    },
  };

  const pieChartConfig = {
    "Fixed Income": {
      label: "Fixed Income",
      color: "#3B82F6",
    },
    "Structure Products": {
      label: "Structure Products", 
      color: "#EF4444",
    },
    "Equities": {
      label: "Equities",
      color: "#10B981",
    },
    "Deposit": {
      label: "Deposit",
      color: "#F59E0B",
    },
    "Cash": {
      label: "Cash",
      color: "#8B5CF6",
    },
    "Hedge Fund": {
      label: "Hedge Fund",
      color: "#06B6D4",
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Comprehensive client portfolio analysis and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      {/* Client Navigation */}
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
        <Button variant="ghost" size="sm" className="text-blue-600">
          ← Back
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">C</span>
          </div>
          <span className="font-medium">Client 0001</span>
        </div>
        <div className="flex items-center space-x-6 ml-8">
          <Button variant="ghost" className="text-sm">Profile</Button>
          <Button variant="ghost" className="text-sm">Custodians</Button>
          <Button variant="ghost" className="text-sm font-medium border-b-2 border-blue-600 text-blue-600">Assets</Button>
          <Button variant="ghost" className="text-sm">Compliance</Button>
          <Button variant="ghost" className="text-sm">Documents</Button>
          <Button variant="ghost" className="text-sm">Data Permissions</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="portfolio-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="portfolio-analysis">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="client-directory">Client Directory</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="statement">Statement</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Cash Distribution</span>
                <span className="text-lg font-normal text-gray-600">Total Cash Value: 3,177,737.34</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cash Distribution List */}
                <div className="space-y-4">
                  {cashDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-red-500' : 'bg-red-400'}`}></div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">({item.percentage}%)</p>
                        </div>
                      </div>
                      <p className="font-bold">{item.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Bar Chart */}
                <div className="h-64">
                  <ChartContainer config={barChartConfig}>
                    <BarChart data={cashDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Allocation */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Product Allocation</CardTitle>
                <CardDescription>Market Value: 83,722,598.67</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  {/* Pie Chart */}
                  <div className="w-48 h-48">
                    <ChartContainer config={pieChartConfig}>
                      <PieChart>
                        <Pie
                          data={productAllocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {productAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2">
                    {productAllocationData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: item.color}}></div>
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div>{item.value.toLocaleString()}</div>
                          <div className="text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Holdings */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>TOP 10 Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topHoldingsData.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                        <span className="text-sm">{holding.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${Math.min(holding.percentage * 3, 100)}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{holding.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="client-directory" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search clients by name, email, or ID..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Table */}
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>Comprehensive list of all clients and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AUM</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>RM</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : client.status === 'Pending KYC'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell>${client.aum}</TableCell>
                      <TableCell>{client.lastContact}</TableCell>
                      <TableCell>{client.rm}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
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

        {/* Other tab contents */}
        <TabsContent value="holdings">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Holdings content will be implemented next...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientManagement;
