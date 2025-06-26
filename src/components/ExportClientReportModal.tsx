
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Calendar, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportClientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export const ExportClientReportModal = ({ isOpen, onClose, client }: ExportClientReportModalProps) => {
  const [reportConfig, setReportConfig] = useState({
    format: '',
    accounts: [] as string[],
    settlementCurrency: '',
    reportDate: '',
    performancePeriodStart: '',
    performancePeriodEnd: '',
    language: 'english',
    includePositions: true,
    includeTransactions: true,
    includePerformance: true,
    includeCash: true,
    includeAllocations: true,
    includeRiskMetrics: false,
    includeTaxInfo: false,
    includeCompliance: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const availableAccounts = [
    { id: 'ACC001', name: 'Investment Portfolio', currency: 'USD' },
    { id: 'ACC002', name: 'Pension Fund', currency: 'EUR' },
    { id: 'ACC003', name: 'Trading Account', currency: 'GBP' }
  ];

  const handleAccountSelection = (accountId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      accounts: checked 
        ? [...prev.accounts, accountId]
        : prev.accounts.filter(id => id !== accountId)
    }));
  };

  const handleExport = async () => {
    if (!reportConfig.format) {
      toast({
        title: "Error",
        description: "Please select a report format",
        variant: "destructive",
      });
      return;
    }

    if (reportConfig.accounts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one account",
        variant: "destructive",
      });
      return;
    }

    if (!reportConfig.reportDate) {
      toast({
        title: "Error",
        description: "Please select a report date",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const fileName = `${client?.first_name}_${client?.last_name}_Report_${reportConfig.reportDate}.${reportConfig.format.toLowerCase()}`;
      
      toast({
        title: "Success",
        description: `Report "${fileName}" has been generated and will be downloaded shortly`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setReportConfig({
      format: '',
      accounts: [],
      settlementCurrency: '',
      reportDate: '',
      performancePeriodStart: '',
      performancePeriodEnd: '',
      language: 'english',
      includePositions: true,
      includeTransactions: true,
      includePerformance: true,
      includeCash: true,
      includeAllocations: true,
      includeRiskMetrics: false,
      includeTaxInfo: false,
      includeCompliance: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Client Report - {client?.first_name} {client?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Format & Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Report Format & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="format">Format *</Label>
                  <Select 
                    value={reportConfig.format} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PPT">PowerPoint (PPT)</SelectItem>
                      <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                      <SelectItem value="PDF">PDF Report</SelectItem>
                      <SelectItem value="CSV">CSV Data Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="settlement-currency">Settlement Currency</Label>
                  <Select 
                    value={reportConfig.settlementCurrency} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, settlementCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="HKD">HKD - Hong Kong Dollar</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={reportConfig.language} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="chinese">Chinese (Simplified)</SelectItem>
                      <SelectItem value="chinese-traditional">Chinese (Traditional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Account Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Select Accounts to Include *</Label>
                {availableAccounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={reportConfig.accounts.includes(account.id)}
                      onCheckedChange={(checked) => handleAccountSelection(account.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-500">Account ID: {account.id} | Currency: {account.currency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Date Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="report-date">Report Date As Of *</Label>
                  <Input
                    type="date"
                    value={reportConfig.reportDate}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, reportDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="performance-start">Performance Period - Start Date</Label>
                  <Input
                    type="date"
                    value={reportConfig.performancePeriodStart}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, performancePeriodStart: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="performance-end">Performance Period - End Date</Label>
                  <Input
                    type="date"
                    value={reportConfig.performancePeriodEnd}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, performancePeriodEnd: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Report Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Core Sections</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includePositions}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includePositions: checked as boolean }))}
                      />
                      <Label>Portfolio Positions</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeTransactions}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeTransactions: checked as boolean }))}
                      />
                      <Label>Transaction History</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includePerformance}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includePerformance: checked as boolean }))}
                      />
                      <Label>Performance Analysis</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeCash}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeCash: checked as boolean }))}
                      />
                      <Label>Cash & Liquidity</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeAllocations}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeAllocations: checked as boolean }))}
                      />
                      <Label>Asset Allocation</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Advanced Sections</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeRiskMetrics}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeRiskMetrics: checked as boolean }))}
                      />
                      <Label>Risk Metrics & Analytics</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeTaxInfo}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeTaxInfo: checked as boolean }))}
                      />
                      <Label>Tax Information</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={reportConfig.includeCompliance}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeCompliance: checked as boolean }))}
                      />
                      <Label>Compliance & Regulatory</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
