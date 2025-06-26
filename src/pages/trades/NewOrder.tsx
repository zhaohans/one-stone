
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Calculator, 
  FileText, 
  Save,
  Send,
  AlertTriangle
} from 'lucide-react';

const NewOrder = () => {
  const [orderType, setOrderType] = useState('');
  const [productType, setProductType] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Order</h1>
          <p className="text-gray-600 mt-1">Create structured product orders</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Submit Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="product">Product Details</TabsTrigger>
                  <TabsTrigger value="risk">Risk Parameters</TabsTrigger>
                  <TabsTrigger value="settlement">Settlement</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client">Client *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abc-fund">ABC Fund Management</SelectItem>
                          <SelectItem value="xyz-capital">XYZ Capital</SelectItem>
                          <SelectItem value="global-inv">Global Investments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="account">Account *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acc-001">ACC-001-MAIN</SelectItem>
                          <SelectItem value="acc-002">ACC-002-HEDGE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="order-type">Order Type *</Label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                          <SelectItem value="structure">Structure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="product" className="space-y-4">
                  <div>
                    <Label htmlFor="product-type">Product Type *</Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barrier-option">Barrier Option</SelectItem>
                        <SelectItem value="auto-callable">Auto-Callable</SelectItem>
                        <SelectItem value="reverse-convertible">Reverse Convertible</SelectItem>
                        <SelectItem value="structured-note">Structured Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {productType === 'barrier-option' && (
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <Label htmlFor="underlying">Underlying *</Label>
                        <Input id="underlying" placeholder="EUR/USD" />
                      </div>
                      <div>
                        <Label htmlFor="barrier-type">Barrier Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Up & In" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="up-in">Up & In</SelectItem>
                            <SelectItem value="up-out">Up & Out</SelectItem>
                            <SelectItem value="down-in">Down & In</SelectItem>
                            <SelectItem value="down-out">Down & Out</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="strike">Strike *</Label>
                        <Input id="strike" placeholder="1.0800" />
                      </div>
                      <div>
                        <Label htmlFor="barrier-level">Barrier Level *</Label>
                        <Input id="barrier-level" placeholder="1.0500" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="notional">Notional Amount *</Label>
                      <Input id="notional" placeholder="10,000,000" />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trade-date">Trade Date</Label>
                      <Input id="trade-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="maturity-date">Maturity Date *</Label>
                      <Input id="maturity-date" type="date" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="risk-limit">Risk Limit Check</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="enable-risk-check" />
                        <Label htmlFor="enable-risk-check">Enable automatic risk limit validation</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hedge-required">Hedging Required</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="hedge-required" />
                        <Label htmlFor="hedge-required">Require delta hedging</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="credit-limit">Credit Limit Check</Label>
                      <Input id="credit-limit" placeholder="Available: $50M" disabled />
                    </div>
                    <div>
                      <Label htmlFor="margin-impact">Margin Impact</Label>
                      <Input id="margin-impact" placeholder="Estimated: $2.5M" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="risk-notes">Risk Notes</Label>
                    <Textarea 
                      id="risk-notes" 
                      placeholder="Additional risk considerations..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settlement" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settlement-date">Settlement Date</Label>
                      <Input id="settlement-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="settlement-method">Settlement Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Cash Settlement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash Settlement</SelectItem>
                          <SelectItem value="physical">Physical Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="custodian">Custodian</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select custodian" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dbs">DBS Bank</SelectItem>
                          <SelectItem value="ubs">UBS</SelectItem>
                          <SelectItem value="citi">Citibank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="account-number">Settlement Account</Label>
                      <Input id="account-number" placeholder="Account number" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Product</span>
                <span className="font-semibold">{productType || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Type</span>
                <span className="font-semibold">{orderType || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Notional</span>
                <span className="font-semibold">USD 10,000,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Est. Premium</span>
                <span className="font-semibold">USD 325,000</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total Value</span>
                <span>USD 10,325,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <p className="font-medium text-yellow-800">Credit Utilization</p>
                <p className="text-yellow-700">This order will utilize 85% of client credit limit</p>
              </div>
              <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                <p className="font-medium text-orange-800">Concentration Risk</p>
                <p className="text-orange-700">High exposure to EUR/USD in client portfolio</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calculator className="w-4 h-4 mr-2" />
                Price Calculator
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Load Template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add to Basket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
