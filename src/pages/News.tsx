
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search,
  Plus,
  Upload,
  Download,
  Filter,
  Eye,
  Edit,
  Archive,
  Trash2,
  Share,
  Calendar as CalendarIcon,
  Paperclip,
  FileText,
  Image,
  Video,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Tag,
  Users,
  Building2,
  TrendingUp,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  headline: string;
  author: string;
  source: 'Internal' | 'External' | 'Market' | 'Regulatory' | 'Research' | 'Custom';
  publishDate: Date;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Archived' | 'Pending Approval';
  content: string;
  tags: string[];
  linkedClients: string[];
  linkedAccounts: string[];
  attachments: { name: string; type: string; size: string }[];
  createdBy: string;
  lastModified: Date;
  needsApproval: boolean;
}

interface NewsFormData {
  headline: string;
  author: string;
  source: string;
  publishDate: Date;
  status: string;
  content: string;
  tags: string[];
  linkedClients: string[];
  linkedAccounts: string[];
}

const News = () => {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<NewsFormData>({
    headline: '',
    author: 'K. Shen',
    source: '',
    publishDate: new Date(),
    status: 'Draft',
    content: '',
    tags: [],
    linkedClients: [],
    linkedAccounts: []
  });

  // Mock data
  const newsItems: NewsItem[] = [
    {
      id: 'NEWS-001',
      headline: 'Q4 2024 Market Outlook: Interest Rate Outlook and Equity Markets',
      author: 'K. Shen',
      source: 'Market',
      publishDate: new Date('2024-12-15'),
      status: 'Published',
      content: 'Market analysis for Q4 2024 showing positive trends...',
      tags: ['Market Analysis', 'Equities', 'Interest Rates'],
      linkedClients: ['Goldman Sachs', 'JP Morgan'],
      linkedAccounts: ['ACC-001', 'ACC-002'],
      attachments: [
        { name: 'market-outlook-q4.pdf', type: 'PDF', size: '2.1 MB' },
        { name: 'charts.xlsx', type: 'Excel', size: '845 KB' }
      ],
      createdBy: 'K. Shen',
      lastModified: new Date('2024-12-15'),
      needsApproval: false
    },
    {
      id: 'NEWS-002',
      headline: 'New Regulatory Requirements for ESG Reporting - Effective January 2025',
      author: 'Compliance Team',
      source: 'Regulatory',
      publishDate: new Date('2024-12-10'),
      status: 'Pending Approval',
      content: 'Important regulatory changes affecting ESG reporting requirements...',
      tags: ['Regulatory', 'ESG', 'Compliance', 'Urgent'],
      linkedClients: [],
      linkedAccounts: [],
      attachments: [
        { name: 'regulatory-notice.pdf', type: 'PDF', size: '1.5 MB' }
      ],
      createdBy: 'Compliance Team',
      lastModified: new Date('2024-12-10'),
      needsApproval: true
    },
    {
      id: 'NEWS-003',
      headline: 'One Stone Capital Wins Best Wealth Management Firm 2024',
      author: 'Marketing',
      source: 'Internal',
      publishDate: new Date('2024-12-20'),
      status: 'Scheduled',
      content: 'We are proud to announce that One Stone Capital has been awarded...',
      tags: ['Company News', 'Awards'],
      linkedClients: [],
      linkedAccounts: [],
      attachments: [
        { name: 'award-photo.jpg', type: 'Image', size: '3.2 MB' }
      ],
      createdBy: 'Marketing',
      lastModified: new Date('2024-12-08'),
      needsApproval: false
    }
  ];

  const sources = ['Internal', 'External', 'Market', 'Regulatory', 'Research', 'Custom'];
  const statuses = ['Draft', 'Scheduled', 'Published', 'Archived', 'Pending Approval'];
  const availableTags = ['Market Analysis', 'Regulatory', 'ESG', 'Compliance', 'Company News', 'Awards', 'Equities', 'Interest Rates', 'Urgent', 'Alert'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Internal': return <Building2 className="w-4 h-4" />;
      case 'Market': return <TrendingUp className="w-4 h-4" />;
      case 'Regulatory': return <Shield className="w-4 h-4" />;
      case 'Research': return <FileText className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const handleCreateNews = (action: 'draft' | 'schedule' | 'publish') => {
    console.log('Creating news item with action:', action, formData);
    
    const needsApproval = formData.source === 'Regulatory' || 
                         formData.tags.some(tag => ['Compliance', 'Urgent', 'Alert'].includes(tag));
    
    let status = 'Draft';
    let message = 'News item saved as draft.';
    
    if (action === 'schedule') {
      status = 'Scheduled';
      message = `News item scheduled for ${format(formData.publishDate, 'MMM dd, yyyy')}.`;
    } else if (action === 'publish') {
      if (needsApproval) {
        status = 'Pending Approval';
        message = 'News item submitted for approval.';
      } else {
        status = 'Published';
        message = 'News published successfully.';
      }
    }

    toast({
      title: "Success",
      description: message
    });

    setShowCreateModal(false);
    setFormData({
      headline: '',
      author: 'K. Shen',
      source: '',
      publishDate: new Date(),
      status: 'Draft',
      content: '',
      tags: [],
      linkedClients: [],
      linkedAccounts: []
    });
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for items:`, selectedItems);
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedItems.length} items.`
    });
    setSelectedItems([]);
  };

  const filteredNews = newsItems.filter(item =>
    item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Announcements</h1>
          <p className="text-gray-600 mt-1">Manage and distribute news, updates, and announcements</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import News</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export News</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add News Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add News Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline/Title *</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="Enter news headline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Select value={formData.author} onValueChange={(value) => setFormData({ ...formData, author: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="K. Shen">K. Shen</SelectItem>
                        <SelectItem value="Compliance Team">Compliance Team</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Research Team">Research Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Source *</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.publishDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.publishDate}
                          onSelect={(date) => date && setFormData({ ...formData, publishDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter news content..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags/Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={formData.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, tags: [...formData.tags, tag] });
                            } else {
                              setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
                            }
                          }}
                        />
                        <Label htmlFor={tag} className="text-sm">{tag}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Drag & drop or click to upload images, PDFs, docs</p>
                    <Button variant="outline" className="mt-2">Browse Files</Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => handleCreateNews('draft')}>
                    Save as Draft
                  </Button>
                  <Button variant="outline" onClick={() => handleCreateNews('schedule')}>
                    Schedule for Publish
                  </Button>
                  <Button onClick={() => handleCreateNews('publish')}>
                    Publish Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by title, topic, author, tag, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Archive')}>
                Bulk Archive
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                Bulk Export
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Share')}>
                Bulk Share
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Tag')}>
                Bulk Tag
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === filteredNews.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(filteredNews.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Headline/Title</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Linked</TableHead>
                <TableHead>Files</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedNews(item);
                        setShowDetailModal(true);
                      }}
                      className="font-medium text-blue-600 hover:text-blue-800 text-left"
                    >
                      {item.headline}
                    </button>
                  </TableCell>
                  <TableCell>{format(item.publishDate, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(item.source)}
                      <span>{item.source}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {item.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{item.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs', getStatusColor(item.status))}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(item.linkedClients.length > 0 || item.linkedAccounts.length > 0) && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {item.linkedClients.length + item.linkedAccounts.length}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.attachments.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.attachments.length}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => {
                        setSelectedNews(item);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={cn('text-xs', getStatusColor(item.status))}>
                    {item.status}
                  </Badge>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2">{item.headline}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(item.source)}
                      <span>{item.source}</span>
                    </div>
                    <span>{format(item.publishDate, 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-3 text-sm">{item.content}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {item.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-600">{item.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.attachments.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{item.attachments.length}</span>
                        </div>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => {
                        setSelectedNews(item);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* News Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl">{selectedNews.headline}</DialogTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge className={cn('text-xs', getStatusColor(selectedNews.status))}>
                        {selectedNews.status}
                      </Badge>
                      <span>{format(selectedNews.publishDate, 'PPP')}</span>
                      <span>By {selectedNews.author}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="prose max-w-none">
                    <p>{selectedNews.content}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Source</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getSourceIcon(selectedNews.source)}
                        <span>{selectedNews.source}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedNews.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {(selectedNews.linkedClients.length > 0 || selectedNews.linkedAccounts.length > 0) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Linked Clients/Accounts</Label>
                      <div className="mt-1 space-y-1">
                        {selectedNews.linkedClients.map(client => (
                          <div key={client} className="text-sm text-blue-600">{client}</div>
                        ))}
                        {selectedNews.linkedAccounts.map(account => (
                          <div key={account} className="text-sm text-blue-600">{account}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4">
                  <div className="space-y-3">
                    {selectedNews.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-gray-600">{attachment.type} • {attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Document
                  </Button>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">News published</span> by {selectedNews.author}
                        </p>
                        <p className="text-xs text-gray-500">{format(selectedNews.publishDate, 'PPp')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">News created</span> by {selectedNews.createdBy}
                        </p>
                        <p className="text-xs text-gray-500">{format(selectedNews.lastModified, 'PPp')}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a note..."
                      rows={3}
                    />
                    <Button>Add Note</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {filteredNews.length === 0 
            ? "No news items found—click 'Add News Item' to publish your first article."
            : `Showing ${filteredNews.length} of ${newsItems.length} news articles`
          }
        </span>
      </div>
    </div>
  );
};

export default News;
