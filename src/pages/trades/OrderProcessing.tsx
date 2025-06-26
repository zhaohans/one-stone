
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  FileText,
  Send,
  User,
  Calendar
} from 'lucide-react';

const OrderProcessing = () => {
  const [selectedOrder] = useState({
    id: 'ORD-001',
    client: 'ABC Fund Management',
    product: 'USD/EUR Barrier Option',
    type: 'Buy',
    notional: '10,000,000',
    currency: 'USD',
    status: 'pending_approval',
    created: '2024-01-15 09:30',
    trader: 'K. Shen',
    priority: 'normal',
    strike: '1.0800',
    barrier: '1.0500',
    maturity: '2024-06-15'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Processing</h1>
          <p className="text-gray-600 mt-1">Review and process order approvals</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="destructive">
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Details - {selectedOrder.id}
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Approval
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-500">Client</h4>
                      <p className="text-lg">{selectedOrder.client}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Order Type</h4>
                      <Badge variant="outline">{selectedOrder.type}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Product</h4>
                      <p className="text-lg">{selectedOrder.product}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Notional</h4>
                      <p className="text-lg font-semibold">{selectedOrder.currency} {selectedOrder.notional}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Strike Rate</h4>
                      <p className="text-lg">{selectedOrder.strike}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Barrier Level</h4>
                      <p className="text-lg">{selectedOrder.barrier}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Maturity Date</h4>
                      <p className="text-lg">{selectedOrder.maturity}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Priority</h4>
                      <Badge className={selectedOrder.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Credit Risk</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Client Limit</span>
                          <span className="font-semibold">$50M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Current Exposure</span>
                          <span className="font-semibold">$35M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">After This Order</span>
                          <span className="font-semibold text-orange-600">$45M</span>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Within Limits
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Market Risk</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">VaR Impact</span>
                          <span className="font-semibold">$125K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Delta</span>
                          <span className="font-semibold">+0.65</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gamma</span>
                          <span className="font-semibold">+0.02</span>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Monitor Required
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Concentration Risk</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">EUR/USD Exposure</span>
                        <span className="font-semibold">$125M (25% of portfolio)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">FX Options</span>
                        <span className="font-semibold">$75M (15% of portfolio)</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Concentration
                      </Badge>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-500">Quoted Premium</h4>
                      <p className="text-2xl font-bold">3.25%</p>
                      <p className="text-sm text-gray-600">USD 325,000</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Fair Value</h4>
                      <p className="text-2xl font-bold">3.18%</p>
                      <p className="text-sm text-gray-600">USD 318,000</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Spread</h4>
                      <p className="text-2xl font-bold text-green-600">0.07%</p>
                      <p className="text-sm text-gray-600">USD 7,000</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500">Target Margin</h4>
                      <p className="text-2xl font-bold">0.05%</p>
                      <p className="text-sm text-gray-600">USD 5,000</p>
                    </div>
                  </div>
                  
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Pricing Approved</h4>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Pricing is within acceptable margins and risk parameters.
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">ISDA Master Agreement</h4>
                        <p className="text-sm text-gray-600">Signed and current</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Credit Support Annex</h4>
                        <p className="text-sm text-gray-600">Standard CSA in place</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">KYC Documentation</h4>
                        <p className="text-sm text-gray-600">Last updated: 2023-12-01</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Current
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approval Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Risk Team</p>
                    <p className="text-sm text-green-600">Approved - 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Pricing Team</p>
                    <p className="text-sm text-green-600">Approved - 1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Operations</p>
                    <p className="text-sm text-yellow-600">Pending Review</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trader</span>
                <span className="font-semibold">{selectedOrder.trader}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="font-semibold">{selectedOrder.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time to Expiry</span>
                <span className="font-semibold">152 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Settlement</span>
                <span className="font-semibold">T+2</span>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Risk Team:</p>
                <p className="text-gray-600">Credit exposure within limits. VaR impact acceptable.</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              
              <div className="text-sm">
                <p className="font-medium">Pricing Team:</p>
                <p className="text-gray-600">Premium reflects current market conditions. Margin adequate.</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              
              <Textarea 
                placeholder="Add your comment..."
                rows={3}
              />
              <Button size="sm" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessing;
