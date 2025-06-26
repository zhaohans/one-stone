
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  GitBranch, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';

const Lifecycle = () => {
  const mockPositions = [
    {
      id: 'TR-001',
      product: 'USD/EUR Barrier Option',
      client: 'ABC Fund',
      notional: '10,000,000',
      currency: 'USD',
      tradeDate: '2024-01-15',
      maturityDate: '2024-06-15',
      status: 'live',
      pnl: '+125,000',
      delta: '0.65',
      nextEvent: 'Barrier Observation',
      nextEventDate: '2024-01-20'
    },
    {
      id: 'TR-002',
      product: 'S&P 500 Auto-Callable',
      client: 'XYZ Capital',
      notional: '5,000,000',
      currency: 'USD',
      tradeDate: '2024-01-10',
      maturityDate: '2024-07-10',
      status: 'called',
      pnl: '+75,000',
      delta: '0.00',
      nextEvent: 'Settlement',
      nextEventDate: '2024-01-18'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      live: 'bg-green-100 text-green-800',
      called: 'bg-blue-100 text-blue-800',
      knocked: 'bg-red-100 text-red-800',
      matured: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade Lifecycle</h1>
          <p className="text-gray-600 mt-1">Monitor and manage trade lifecycle events</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Event Calendar
          </Button>
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Risk Monitor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Positions</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$2.1M</div>
            <p className="text-xs text-muted-foreground">MTD performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Live Positions</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="history">Event History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Position Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Notional</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Delta</TableHead>
                    <TableHead>Next Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-mono">{position.id}</TableCell>
                      <TableCell>{position.product}</TableCell>
                      <TableCell>{position.client}</TableCell>
                      <TableCell>
                        {position.currency} {position.notional}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(position.status)}>
                          {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className={position.pnl.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {position.pnl}
                      </TableCell>
                      <TableCell>{position.delta}</TableCell>
                      <TableCell>{position.nextEvent}</TableCell>
                      <TableCell>{position.nextEventDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Activity className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lifecycle Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Barrier Observation - TR-001</h4>
                    <p className="text-sm text-gray-600">USD/EUR Barrier Option - Barrier Level: 1.0500</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Jan 20, 2024</p>
                    <Badge variant="outline" className="mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      2 days
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Auto-Call Observation - TR-002</h4>
                    <p className="text-sm text-gray-600">S&P 500 Auto-Callable - Call Level: 4200</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Jan 25, 2024</p>
                    <Badge variant="outline" className="mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      1 week
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Maturity Settlement - TR-005</h4>
                    <p className="text-sm text-gray-600">Gold Linked Note - Final Settlement</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Feb 01, 2024</p>
                    <Badge variant="outline" className="mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      2 weeks
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Event history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  P&L Evolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                  <p className="text-gray-500">P&L Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Delta</span>
                  <span className="font-semibold">+2.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Gamma</span>
                  <span className="font-semibold">+0.12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Vega</span>
                  <span className="font-semibold">-15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Theta</span>
                  <span className="font-semibold">-2,500</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lifecycle;
