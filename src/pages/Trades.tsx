
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  Search,
  Paperclip,
  Eye,
  Edit,
  Check,
  X,
  Play,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Trades = () => {
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [showTradeDetail, setShowTradeDetail] = useState(false);
  const { toast } = useToast();

  // Mock data
  const trades = [
    {
      id: 'TR-2024-001',
      date: '2024-01-15',
      client: { name: 'John Smith', avatar: 'JS' },
      account: 'ACC-001',
      security: { ticker: 'AAPL', name: 'Apple Inc.', isin: 'US0378331005' },
      action: 'Buy',
      quantity: 100,
      price: 150.25,
      total: 15025.00,
      status: 'Executed',
      trader: 'K. Shen',
      custodian: 'DBS Bank',
      attachments: 2,
      currency: 'USD'
    },
    {
      id: 'TR-2024-002',
      date: '2024-01-16',
      client: { name: 'Sarah Johnson', avatar: 'SJ' },
      account: 'ACC-002',
      security: { ticker: 'MSFT', name: 'Microsoft Corp.', isin: 'US5949181045' },
      action: 'Sell',
      quantity: 50,
      price: 420.80,
      total: 21040.00,
      status: 'Pending Review',
      trader: 'M. Tan',
      custodian: 'UBS',
      attachments: 1,
      currency: 'USD'
    },
    {
      id: 'TR-2024-003',
      date: '2024-01-17',
      client: { name: 'Robert Chen', avatar: 'RC' },
      account: 'ACC-003',
      security: { ticker: 'GOOGL', name: 'Alphabet Inc.', isin: 'US02079K3059' },
      action: 'Buy',
      quantity: 25,
      price: 2750.90,
      total: 68772.50,
      status: 'Draft',
      trader: 'L. Wong',
      custodian: 'CITI',
      attachments: 0,
      currency: 'USD'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Executed': 'bg-blue-100 text-blue-800',
      'Settled': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActionColor = (action: string) => {
    const colors = {
      'Buy': 'bg-green-100 text-green-800',
      'Sell': 'bg-red-100 text-red-800',
      'Subscription': 'bg-blue-100 text-blue-800',
      'Redemption': 'bg-orange-100 text-orange-800',
      'Transfer': 'bg-purple-100 text-purple-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSelectTrade = (tradeId: string) => {
    setSelectedTrades(prev => 
      prev.includes(tradeId) 
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrades.length === trades.length) {
      setSelectedTrades([]);
    } else {
      setSelectedTrades(trades.map(trade => trade.id));
    }
  };

  const handleTradeAction = (action: string, tradeId: string) => {
    toast({
      title: "Action Completed",
      description: `Trade ${tradeId} has been ${action.toLowerCase()}.`,
    });
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action Completed",
      description: `${action} applied to ${selectedTrades.length} trades.`,
    });
    setSelectedTrades([]);
  };

  const AddTradeModal = () => {
    const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      client: '',
      account: '',
      security: '',
      action: 'Buy',
      quantity: '',
      price: '',
      currency: 'USD',
      custodian: '',
      trader: 'K. Shen',
      notes: ''
    });

    const calculateTotal = () => {
      const quantity = parseFloat(formData.quantity) || 0;
      const price = parseFloat(formData.price) || 0;
      return (quantity * price).toFixed(2);
    };

    return (
      <Dialog open={showAddTrade} onOpenChange={setShowAddTrade}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trade Date *</label>
                <Input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client *</label>
                <Select value={formData.client} onValueChange={(value) => setFormData({...formData, client: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">John Smith</SelectItem>
                    <SelectItem value="client2">Sarah Johnson</SelectItem>
                    <SelectItem value="client3">Robert Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account *</label>
                <Select value={formData.account} onValueChange={(value) => setFormData({...formData, account: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acc1">ACC-001</SelectItem>
                    <SelectItem value="acc2">ACC-002</SelectItem>
                    <SelectItem value="acc3">ACC-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Security *</label>
                <Input 
                  placeholder="Search by ISIN, ticker, or name"
                  value={formData.security}
                  onChange={(e) => setFormData({...formData, security: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Action *</label>
                <Select value={formData.action} onValueChange={(value) => setFormData({...formData, action: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Redemption">Redemption</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="HKD">HKD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <Input 
                  value={`${formData.currency} ${calculateTotal()}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Custodian/Bank *</label>
                <Select value={formData.custodian} onValueChange={(value) => setFormData({...formData, custodian: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select custodian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dbs">DBS Bank</SelectItem>
                    <SelectItem value="ubs">UBS</SelectItem>
                    <SelectItem value="citi">CITI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea 
              placeholder="Add any additional notes (max 500 characters)"
              maxLength={500}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <div className="text-sm text-gray-500 mt-1">{formData.notes.length}/500 characters</div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag & drop or click to upload docs</p>
              <p className="text-xs text-gray-500 mt-1">Supports PDF, Excel, images</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddTrade(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {
              toast({ title: "Success", description: "Trade created and saved as draft." });
              setShowAddTrade(false);
            }}>
              Save as Draft
            </Button>
            <Button onClick={() => {
              toast({ title: "Success", description: "Trade submitted for approval." });
              setShowAddTrade(false);
            }}>
              Submit for Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const TradeDetailModal = () => {
    if (!selectedTrade) return null;

    return (
      <Dialog open={showTradeDetail} onOpenChange={setShowTradeDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trade Details - {selectedTrade.id}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Trade ID</label>
                    <p className="font-mono text-lg">{selectedTrade.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Trade Date</label>
                    <p>{selectedTrade.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Client</label>
                    <p>{selectedTrade.client.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account</label>
                    <p>{selectedTrade.account}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Security</label>
                    <p className="font-medium">{selectedTrade.security.ticker} - {selectedTrade.security.name}</p>
                    <p className="text-sm text-gray-500">{selectedTrade.security.isin}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Action</label>
                    <Badge className={getActionColor(selectedTrade.action)}>{selectedTrade.action}</Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Quantity</label>
                    <p>{selectedTrade.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Price</label>
                    <p>{selectedTrade.currency} {selectedTrade.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="font-bold text-lg">{selectedTrade.currency} {selectedTrade.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <Badge className={getStatusColor(selectedTrade.status)}>{selectedTrade.status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="flex space-x-3">
                  {selectedTrade.status === 'Pending Review' && (
                    <>
                      <Button size="sm" onClick={() => handleTradeAction('Approved', selectedTrade.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleTradeAction('Rejected', selectedTrade.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedTrade.status === 'Approved' && (
                    <Button size="sm" onClick={() => handleTradeAction('Executed', selectedTrade.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Trade
                    </Button>
                  )}
                  {selectedTrade.status === 'Executed' && (
                    <Button size="sm" onClick={() => handleTradeAction('Settled', selectedTrade.id)}>
                      <Check className="w-4 h-4 mr-2" />
                      Settle Trade
                    </Button>
                  )}
                  {!['Executed', 'Settled'].includes(selectedTrade.status) && (
                    <Button variant="outline" size="sm" onClick={() => handleTradeAction('Cancelled', selectedTrade.id)}>
                      <Ban className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attachments">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-gray-500 text-center py-8">No attachments uploaded yet</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Activity Log</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-200 pl-4 py-2">
                    <p className="font-medium">Trade created</p>
                    <p className="text-sm text-gray-500">By K. Shen • {selectedTrade.date} 09:30 AM</p>
                  </div>
                  <div className="border-l-2 border-yellow-200 pl-4 py-2">
                    <p className="font-medium">Submitted for review</p>
                    <p className="text-sm text-gray-500">By K. Shen • {selectedTrade.date} 09:45 AM</p>
                  </div>
                  {selectedTrade.status !== 'Draft' && selectedTrade.status !== 'Pending Review' && (
                    <div className="border-l-2 border-green-200 pl-4 py-2">
                      <p className="font-medium">Trade approved</p>
                      <p className="text-sm text-gray-500">By Compliance Team • {selectedTrade.date} 10:15 AM</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Notes</h3>
                  <Button size="sm">Add Note</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-gray-500 text-center py-8">No notes added yet</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trades</h1>
          <p className="text-gray-600 mt-1">Manage and track all trading activities</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Trades
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowAddTrade(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Trade
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by trade ID, security, client, account, date, status…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTrades.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedTrades.length} trade{selectedTrades.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Bulk Approve')}>
                Bulk Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Bulk Export')}>
                Bulk Export
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Bulk Assign Trader')}>
                Bulk Assign Trader
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Bulk Cancel')}>
                Bulk Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTrades.length === trades.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Trade ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trader</TableHead>
              <TableHead>Custodian</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow 
                key={trade.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedTrade(trade);
                  setShowTradeDetail(true);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedTrades.includes(trade.id)}
                    onCheckedChange={() => handleSelectTrade(trade.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">{trade.id}</TableCell>
                <TableCell>{trade.date}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {trade.client.avatar}
                    </div>
                    <span>{trade.client.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{trade.account}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{trade.security.ticker} - {trade.security.name}</div>
                    <div className="text-sm text-gray-500">{trade.security.isin}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getActionColor(trade.action)}>{trade.action}</Badge>
                </TableCell>
                <TableCell className="text-right">{trade.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right">{trade.currency} {trade.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-bold">{trade.currency} {trade.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(trade.status)}>{trade.status}</Badge>
                </TableCell>
                <TableCell>{trade.trader}</TableCell>
                <TableCell>{trade.custodian}</TableCell>
                <TableCell>
                  {trade.attachments > 0 && (
                    <div className="flex items-center space-x-1">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{trade.attachments}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedTrade(trade);
                        setShowTradeDetail(true);
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {trade.status === 'Pending Review' && (
                        <>
                          <DropdownMenuItem onClick={() => handleTradeAction('Approved', trade.id)}>
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTradeAction('Rejected', trade.id)}>
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {trade.status === 'Approved' && (
                        <DropdownMenuItem onClick={() => handleTradeAction('Executed', trade.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Execute
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleTradeAction('Cancelled', trade.id)}>
                        <Ban className="w-4 h-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {trades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No trades found—add your first trade to get started.</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">Showing {trades.length} of {trades.length} trades</p>
        </div>
      </div>

      {/* Modals */}
      <AddTradeModal />
      <TradeDetailModal />
    </div>
  );
};

export default Trades;
