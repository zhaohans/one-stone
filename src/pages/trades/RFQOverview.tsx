
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const RFQOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockRFQs = [
    {
      id: 'RFQ-001',
      client: 'ABC Fund',
      product: 'USD/EUR Barrier Option',
      notional: '10,000,000',
      currency: 'USD',
      status: 'pending',
      created: '2024-01-15 09:30',
      expires: '2024-01-15 17:00',
      quotes: 3
    },
    {
      id: 'RFQ-002',
      client: 'XYZ Capital',
      product: 'S&P 500 Auto-Callable',
      notional: '5,000,000',
      currency: 'USD',
      status: 'quoted',
      created: '2024-01-15 08:45',
      expires: '2024-01-15 16:00',
      quotes: 5
    },
    {
      id: 'RFQ-003',
      client: 'Global Investments',
      product: 'Gold Linked Note',
      notional: '2,500,000',
      currency: 'EUR',
      status: 'executed',
      created: '2024-01-14 14:20',
      expires: '2024-01-14 18:00',
      quotes: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      executed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'quoted': return <AlertCircle className="w-4 h-4" />;
      case 'executed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFQ Overview</h1>
          <p className="text-gray-600 mt-1">Monitor and manage Request for Quotes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notional</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125M</div>
            <p className="text-xs text-muted-foreground">Across all RFQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search RFQs by ID, client, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* RFQ Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All RFQs</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="quoted">Quoted</TabsTrigger>
          <TabsTrigger value="executed">Executed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Notional</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Quotes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-mono">{rfq.id}</TableCell>
                      <TableCell>{rfq.client}</TableCell>
                      <TableCell>{rfq.product}</TableCell>
                      <TableCell>
                        <div className="font-medium">{rfq.currency} {rfq.notional}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(rfq.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(rfq.status)}
                          {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{rfq.created}</TableCell>
                      <TableCell>{rfq.expires}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.quotes} quotes</Badge>
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

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Pending RFQs will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quoted">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Quoted RFQs will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executed">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Executed RFQs will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQOverview;
