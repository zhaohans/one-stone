
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Receipt,
  Paperclip,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeReport {
  id: string;
  reportId: string;
  period: string;
  client: {
    id: string;
    name: string;
    initials: string;
    avatar?: string;
  };
  account: {
    id: string;
    number: string;
  };
  custodian: {
    name: string;
    logo?: string;
  };
  feeType: 'Management' | 'Retrocession' | 'Other';
  grossFee: number;
  netFee: number;
  retroRate: number;
  retroAmount: number;
  currency: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Invoiced' | 'Paid';
  rm: {
    name: string;
    initials: string;
  };
  attachments: number;
  createdAt: string;
  updatedAt: string;
  calculationMethod: string;
  notes?: string;
}

const mockFeeReports: FeeReport[] = [
  {
    id: '1',
    reportId: 'FR-2025-001',
    period: 'Q4 2024',
    client: { id: '1', name: 'ABC Holdings Pte Ltd', initials: 'AH' },
    account: { id: '1', number: 'ACC-001-2024' },
    custodian: { name: 'DBS Bank' },
    feeType: 'Management',
    grossFee: 25000,
    netFee: 22500,
    retroRate: 0.1250,
    retroAmount: 2812.50,
    currency: 'SGD',
    status: 'Approved',
    rm: { name: 'K. Shen', initials: 'KS' },
    attachments: 3,
    createdAt: '2025-01-15',
    updatedAt: '2025-01-16',
    calculationMethod: 'AUM'
  },
  {
    id: '2',
    reportId: 'FR-2025-002',
    period: 'Q4 2024',
    client: { id: '2', name: 'XYZ Investment Fund', initials: 'XY' },
    account: { id: '2', number: 'ACC-002-2024' },
    custodian: { name: 'UOB Bank' },
    feeType: 'Retrocession',
    grossFee: 45000,
    netFee: 40500,
    retroRate: 0.0875,
    retroAmount: 3543.75,
    currency: 'USD',
    status: 'Review',
    rm: { name: 'A. Chen', initials: 'AC' },
    attachments: 2,
    createdAt: '2025-01-14',
    updatedAt: '2025-01-15',
    calculationMethod: 'Net Asset'
  }
];

const FeeReports = () => {
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FeeReport | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    period: '',
    status: '',
    client: '',
    feeType: '',
    custodian: ''
  });

  // New report form state
  const [newReport, setNewReport] = useState({
    period: '',
    client: '',
    account: '',
    custodian: '',
    feeType: 'Management',
    grossFee: '',
    netFee: '',
    retroRate: '',
    calculationMethod: 'AUM',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Invoiced': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFeeTypeColor = (feeType: string) => {
    switch (feeType) {
      case 'Management': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Retrocession': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Other': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? mockFeeReports.map(report => report.id) : []);
  };

  const handleSelectRow = (reportId: string, checked: boolean) => {
    setSelectedRows(prev => 
      checked 
        ? [...prev, reportId]
        : prev.filter(id => id !== reportId)
    );
  };

  const handleCreateReport = () => {
    // Validate required fields
    if (!newReport.period || !newReport.client || !newReport.account || !newReport.custodian || !newReport.grossFee || !newReport.netFee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Fee report created and saved as draft."
    });
    setShowNewReportDialog(false);
    setNewReport({
      period: '',
      client: '',
      account: '',
      custodian: '',
      feeType: 'Management',
      grossFee: '',
      netFee: '',
      retroRate: '',
      calculationMethod: 'AUM',
      notes: ''
    });
  };

  const handleBulkApprove = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one report to approve.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${selectedRows.length} fee reports approved successfully.`
    });
    setSelectedRows([]);
  };

  const handleGenerateInvoice = (reportId: string) => {
    toast({
      title: "Success",
      description: "Invoice generated and attached to fee report."
    });
  };

  const handleViewReport = (report: FeeReport) => {
    setSelectedReport(report);
    setShowDetailDialog(true);
  };

  const filteredReports = mockFeeReports.filter(report => {
    return (
      (!filters.search || 
        report.reportId.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.account.number.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.period || report.period === filters.period) &&
      (!filters.status || report.status === filters.status) &&
      (!filters.feeType || report.feeType === filters.feeType)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage fee calculations, retrocession, and invoice generation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Statement
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setShowNewReportDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Fee Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">2,547</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">28</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fees (YTD)</p>
              <p className="text-2xl font-bold text-green-600">$2.4M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retrocession (YTD)</p>
              <p className="text-2xl font-bold text-purple-600">$185K</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by period, client, account, custodian, RM, status..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                <SelectItem value="Q3 2024">Q3 2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Invoiced">Invoiced</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.feeType} onValueChange={(value) => setFilters(prev => ({ ...prev, feeType: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Fee Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Retrocession">Retrocession</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedRows.length} report{selectedRows.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleBulkApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Bulk Approve
              </Button>
              <Button size="sm" variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                Generate Invoices
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Fee Reports Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === mockFeeReports.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Report ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead className="text-right">Gross Fee</TableHead>
                <TableHead className="text-right">Net Fee</TableHead>
                <TableHead className="text-right">Retro Rate</TableHead>
                <TableHead className="text-right">Retro Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>RM</TableHead>
                <TableHead>Files</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No fee reports found—click "New Fee Report" or "Import Statement" to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(report.id)}
                        onCheckedChange={(checked) => handleSelectRow(report.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewReport(report)}
                        className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {report.reportId}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{report.period}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">{report.client.initials}</span>
                        </div>
                        <span className="font-medium">{report.client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{report.account.number}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{report.custodian.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFeeTypeColor(report.feeType)}>
                        {report.feeType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {report.currency} {report.grossFee.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {report.currency} {report.netFee.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {(report.retroRate * 100).toFixed(4)}%
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {report.currency} {report.retroAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">{report.rm.initials}</span>
                        </div>
                        <span className="text-sm">{report.rm.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{report.attachments}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewReport(report)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {report.status === 'Approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateInvoice(report.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Receipt className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredReports.length} of {mockFeeReports.length} reports
          </p>
        </div>
      </Card>

      {/* New Fee Report Dialog */}
      <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Fee Report</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Period *</Label>
              <Select value={newReport.period} onValueChange={(value) => setNewReport(prev => ({ ...prev, period: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                  <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                  <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={newReport.client} onValueChange={(value) => setNewReport(prev => ({ ...prev, client: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ABC Holdings Pte Ltd</SelectItem>
                  <SelectItem value="2">XYZ Investment Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <Select value={newReport.account} onValueChange={(value) => setNewReport(prev => ({ ...prev, account: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ACC-001-2024</SelectItem>
                  <SelectItem value="2">ACC-002-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custodian">Custodian/Bank *</Label>
              <Select value={newReport.custodian} onValueChange={(value) => setNewReport(prev => ({ ...prev, custodian: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select custodian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dbs">DBS Bank</SelectItem>
                  <SelectItem value="uob">UOB Bank</SelectItem>
                  <SelectItem value="ocbc">OCBC Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeType">Fee Type</Label>
              <Select value={newReport.feeType} onValueChange={(value) => setNewReport(prev => ({ ...prev, feeType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Retrocession">Retrocession</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calculationMethod">Calculation Method</Label>
              <Select value={newReport.calculationMethod} onValueChange={(value) => setNewReport(prev => ({ ...prev, calculationMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUM">AUM</SelectItem>
                  <SelectItem value="Net Asset">Net Asset</SelectItem>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossFee">Gross Fee *</Label>
              <Input
                id="grossFee"
                type="number"
                placeholder="0.00"
                value={newReport.grossFee}
                onChange={(e) => setNewReport(prev => ({ ...prev, grossFee: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="netFee">Net Fee *</Label>
              <Input
                id="netFee"
                type="number"
                placeholder="0.00"
                value={newReport.netFee}
                onChange={(e) => setNewReport(prev => ({ ...prev, netFee: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retroRate">Retrocession Rate (%)</Label>
              <Input
                id="retroRate"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={newReport.retroRate}
                onChange={(e) => setNewReport(prev => ({ ...prev, retroRate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retroAmount">Retro Amount (Auto-calc)</Label>
              <Input
                id="retroAmount"
                type="number"
                placeholder="0.00"
                value={newReport.netFee && newReport.retroRate ? 
                  (parseFloat(newReport.netFee) * parseFloat(newReport.retroRate) / 100).toFixed(2) : ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes (max 500 characters)"
                value={newReport.notes}
                onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                maxLength={500}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewReportDialog(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleCreateReport}>
              Save as Draft
            </Button>
            <Button onClick={handleCreateReport}>
              Submit for Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Statement Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Fee Statement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag & drop or click to upload statement
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports Excel, CSV, PDF files
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button>
              Continue to Mapping
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fee Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Fee Report Details - {selectedReport.reportId}</DialogTitle>
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
                      <Label className="text-sm font-medium text-gray-600">Period</Label>
                      <p className="text-sm font-medium">{selectedReport.period}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Client</Label>
                      <p className="text-sm font-medium">{selectedReport.client.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account</Label>
                      <p className="text-sm font-mono">{selectedReport.account.number}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Custodian</Label>
                      <p className="text-sm font-medium">{selectedReport.custodian.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Fee Type</Label>
                      <Badge className={getFeeTypeColor(selectedReport.feeType)}>
                        {selectedReport.feeType}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Gross Fee</Label>
                      <p className="text-lg font-bold">{selectedReport.currency} {selectedReport.grossFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Net Fee</Label>
                      <p className="text-lg font-bold">{selectedReport.currency} {selectedReport.netFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Retrocession Rate</Label>
                      <p className="text-sm font-mono">{(selectedReport.retroRate * 100).toFixed(4)}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Retrocession Amount</Label>
                      <p className="text-lg font-bold text-purple-600">{selectedReport.currency} {selectedReport.retroAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {selectedReport.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Calculation Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Calculation Method: {selectedReport.calculationMethod}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Formula: Net Fee × Retro Rate = {selectedReport.currency} {selectedReport.netFee.toLocaleString()} × {(selectedReport.retroRate * 100).toFixed(4)}% = {selectedReport.currency} {selectedReport.retroAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  {selectedReport.status === 'Review' && (
                    <>
                      <Button variant="outline">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  {selectedReport.status === 'Approved' && (
                    <Button onClick={() => handleGenerateInvoice(selectedReport.id)}>
                      <Receipt className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="attachments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Attachments</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Fee Statement Q4 2024.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded by K. Shen on Jan 15, 2025</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Report approved by Compliance</p>
                      <p className="text-xs text-gray-500">Jan 16, 2025 at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Report submitted for review</p>
                      <p className="text-xs text-gray-500">Jan 15, 2025 at 10:15 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Report created by K. Shen</p>
                      <p className="text-xs text-gray-500">Jan 15, 2025 at 9:45 AM</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">K. Shen</span>
                      <span className="text-xs text-gray-500">Jan 15, 2025</span>
                    </div>
                    <p className="text-sm text-gray-700">Initial fee report for Q4 2024. All calculations verified against statement.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeeReports;
