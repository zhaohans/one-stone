
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign
} from 'lucide-react';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    currency: 'USD',
    minInvestment: '',
    description: '',
    riskLevel: '',
    fees: ''
  });

  // Product categories for EAM/Fund Management
  const productCategories = [
    {
      name: 'Equity',
      subcategories: ['Large Cap', 'Mid Cap', 'Small Cap', 'Growth', 'Value', 'Dividend', 'Sector Specific', 'ESG'],
      count: 125,
      totalVolume: 45000000
    },
    {
      name: 'Fixed Income',
      subcategories: ['Government Bonds', 'Corporate Bonds', 'Municipal Bonds', 'High Yield', 'Investment Grade', 'Convertibles'],
      count: 89,
      totalVolume: 62000000
    },
    {
      name: 'Fund',
      subcategories: ['Mutual Funds', 'ETFs', 'Index Funds', 'Target Date', 'Balanced', 'Money Market'],
      count: 67,
      totalVolume: 38000000
    },
    {
      name: 'Structured Products',
      subcategories: ['Capital Protected', 'Yield Enhancement', 'Participation', 'Barrier Options', 'Auto-Callable'],
      count: 43,
      totalVolume: 28000000
    },
    {
      name: 'Forex',
      subcategories: ['Major Pairs', 'Minor Pairs', 'Exotic Pairs', 'Currency Forwards', 'Currency Swaps'],
      count: 35,
      totalVolume: 15000000
    },
    {
      name: 'Hedge Fund',
      subcategories: ['Long/Short Equity', 'Market Neutral', 'Global Macro', 'Event Driven', 'Multi-Strategy'],
      count: 24,
      totalVolume: 42000000
    },
    {
      name: 'Alternative Investments',
      subcategories: ['Private Equity', 'Real Estate', 'Commodities', 'Infrastructure', 'Art & Collectibles'],
      count: 31,
      totalVolume: 35000000
    },
    {
      name: 'Precious Metals',
      subcategories: ['Gold', 'Silver', 'Platinum', 'Palladium', 'Mining Stocks', 'ETCs'],
      count: 18,
      totalVolume: 12000000
    },
    {
      name: 'Commodities',
      subcategories: ['Energy', 'Agriculture', 'Metals', 'Livestock', 'Soft Commodities'],
      count: 22,
      totalVolume: 8000000
    },
    {
      name: 'Real Estate Investment',
      subcategories: ['REITs', 'Real Estate Funds', 'Direct Investment', 'Property Development', 'Commercial'],
      count: 15,
      totalVolume: 25000000
    },
    {
      name: 'Insurance',
      subcategories: ['Life Insurance', 'Annuities', 'Unit Linked', 'Endowment', 'Term Insurance'],
      count: 12,
      totalVolume: 18000000
    },
    {
      name: 'Private Equity',
      subcategories: ['Buyout', 'Growth Capital', 'Venture Capital', 'Distressed', 'Mezzanine'],
      count: 8,
      totalVolume: 55000000
    },
    {
      name: 'Derivatives',
      subcategories: ['Options', 'Futures', 'Swaps', 'Forwards', 'Credit Derivatives'],
      count: 156,
      totalVolume: 75000000
    }
  ];

  // Mock product data
  const products = [
    {
      id: 'PRD001',
      name: 'S&P 500 Growth Fund',
      category: 'Equity',
      subcategory: 'Large Cap Growth',
      currency: 'USD',
      minInvestment: 10000,
      currentPrice: 125.50,
      performance: 12.5,
      volume: 2500000,
      riskLevel: 'Medium',
      status: 'Active'
    },
    {
      id: 'PRD002',
      name: 'European Corporate Bonds',
      category: 'Fixed Income',
      subcategory: 'Corporate Bonds',
      currency: 'EUR',
      minInvestment: 50000,
      currentPrice: 98.75,
      performance: 4.2,
      volume: 1200000,
      riskLevel: 'Low',
      status: 'Active'
    },
    {
      id: 'PRD003',
      name: 'Gold ETF',
      category: 'Precious Metals',
      subcategory: 'Gold',
      currency: 'USD',
      minInvestment: 1000,
      currentPrice: 187.25,
      performance: 8.7,
      volume: 850000,
      riskLevel: 'Medium',
      status: 'Active'
    }
  ];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800',
      'Very High': 'bg-purple-100 text-purple-800'
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Suspended': 'bg-red-100 text-red-800',
      'New': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddProduct = () => {
    console.log('Adding product:', productForm);
    setShowProductModal(false);
    setProductForm({
      name: '',
      category: '',
      subcategory: '',
      currency: 'USD',
      minInvestment: '',
      description: '',
      riskLevel: '',
      fees: ''
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const totalProducts = productCategories.reduce((sum, cat) => sum + cat.count, 0);
  const totalVolume = productCategories.reduce((sum, cat) => sum + cat.totalVolume, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600 mt-1">Comprehensive product management for EAM trading operations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Catalog
          </Button>
          <Button onClick={() => setShowProductModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">Trading volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCategories.length}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">Best performing product</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {productCategories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filter
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Product List</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Min Investment</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.currency}</TableCell>
                      <TableCell>{formatCurrency(product.minInvestment, product.currency)}</TableCell>
                      <TableCell>{formatCurrency(product.currentPrice, product.currency)}</TableCell>
                      <TableCell>
                        <span className={product.performance > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.performance > 0 ? '+' : ''}{product.performance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskBadge(product.riskLevel)}>
                          {product.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
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

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.count} products</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Volume:</span>
                      <span className="font-medium">{formatCurrency(category.totalVolume)}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Subcategories:</span>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <Badge key={sub} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {category.subcategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productCategories.slice(0, 5).map((category) => {
                    const percentage = (category.totalVolume / totalVolume) * 100;
                    return (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(category.totalVolume)}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Top Performer</span>
                    <span className="text-green-600 font-bold">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Performance</span>
                    <span className="font-bold">+8.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Underperformers</span>
                    <span className="text-red-600 font-bold">3 products</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={productForm.category} 
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency</Label>
                <Select 
                  value={productForm.currency} 
                  onValueChange={(value) => setProductForm({ ...productForm, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minimum Investment</Label>
                <Input
                  type="number"
                  value={productForm.minInvestment}
                  onChange={(e) => setProductForm({ ...productForm, minInvestment: e.target.value })}
                  placeholder="Enter minimum investment"
                />
              </div>
              <div>
                <Label>Risk Level</Label>
                <Select 
                  value={productForm.riskLevel} 
                  onValueChange={(value) => setProductForm({ ...productForm, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Management Fees (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.fees}
                  onChange={(e) => setProductForm({ ...productForm, fees: e.target.value })}
                  placeholder="Enter fee percentage"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowProductModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
