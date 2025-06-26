
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calculator,
  FileText,
  Users
} from 'lucide-react';

const RFQProcessing = () => {
  const [selectedRFQ, setSelectedRFQ] = useState('RFQ-001');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFQ Processing</h1>
          <p className="text-gray-600 mt-1">Process and respond to client RFQs</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Quote
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFQ Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                RFQ Details
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">RFQ ID</Label>
                  <p className="font-mono text-lg">{selectedRFQ}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Client</Label>
                  <p className="text-lg">ABC Fund Management</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Product Type</Label>
                  <p className="text-lg">USD/EUR Barrier Option</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notional Amount</Label>
                  <p className="text-lg font-semibold">USD 10,000,000</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expiry Date</Label>
                  <p className="text-lg">2024-06-15</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Barrier Level</Label>
                  <p className="text-lg">1.0500</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Additional Requirements</Label>
                <p className="mt-1 text-gray-700">
                  Client requires daily fixing observations with American barrier monitoring. 
                  Settlement in T+2. Documentation to follow ISDA Master Agreement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quote Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Pricing & Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pricing" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="premium">Premium (%)</Label>
                      <Input id="premium" placeholder="3.25" />
                    </div>
                    <div>
                      <Label htmlFor="premium-amount">Premium Amount</Label>
                      <Input id="premium-amount" placeholder="USD 325,000" disabled />
                    </div>
                    <div>
                      <Label htmlFor="strike">Strike Rate</Label>
                      <Input id="strike" placeholder="1.0800" />
                    </div>
                    <div>
                      <Label htmlFor="spot">Current Spot</Label>
                      <Input id="spot" placeholder="1.0756" disabled />
                    </div>
                    <div>
                      <Label htmlFor="volatility">Implied Volatility (%)</Label>
                      <Input id="volatility" placeholder="12.5" />
                    </div>
                    <div>
                      <Label htmlFor="delta">Delta</Label>
                      <Input id="delta" placeholder="0.65" disabled />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="terms" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settlement">Settlement</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="T+2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t0">T+0</SelectItem>
                          <SelectItem value="t1">T+1</SelectItem>
                          <SelectItem value="t2">T+2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exercise">Exercise Style</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="American" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="european">European</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="special-terms">Special Terms</Label>
                    <Textarea 
                      id="special-terms" 
                      placeholder="Any additional terms or conditions..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-4">
                  <div>
                    <Label htmlFor="master-agreement">Master Agreement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="ISDA 2002" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="isda2002">ISDA 2002</SelectItem>
                        <SelectItem value="isda2021">ISDA 2021</SelectItem>
                        <SelectItem value="custom">Custom Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="csa">Credit Support Annex</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Standard CSA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard CSA</SelectItem>
                        <SelectItem value="enhanced">Enhanced CSA</SelectItem>
                        <SelectItem value="none">No CSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EUR/USD Spot</span>
                <span className="font-semibold">1.0756</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">1M Vol</span>
                <span className="font-semibold">12.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">3M Vol</span>
                <span className="font-semibold">12.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">USD Rate</span>
                <span className="font-semibold">5.25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EUR Rate</span>
                <span className="font-semibold">4.50%</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-4 h-4" />
                Team Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Risk Team:</p>
                <p className="text-gray-600">Delta hedging approved for up to 15M notional</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Sales:</p>
                <p className="text-gray-600">Client prefers indicative pricing first</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
              <Textarea 
                placeholder="Add team note..."
                className="mt-3"
                rows={2}
              />
              <Button size="sm" className="w-full">Add Note</Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Request Risk Approval
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Reviewed
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Term Sheet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RFQProcessing;
