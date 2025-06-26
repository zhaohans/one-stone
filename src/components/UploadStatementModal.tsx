
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

export const UploadStatementModal = ({ isOpen, onClose, clientId }: UploadStatementModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    statementType: '',
    accountId: '',
    statementPeriod: '',
    statementDate: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!uploadData.statementType || !uploadData.accountId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Success",
        description: "Statement uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setUploadData({
        statementType: '',
        accountId: '',
        statementPeriod: '',
        statementDate: '',
        description: ''
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload statement",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadData({
      statementType: '',
      accountId: '',
      statementPeriod: '',
      statementDate: '',
      description: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Client Statement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="statement-file"
                    className="hidden"
                    accept=".pdf,.xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="statement-file" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">Click to upload statement</p>
                        <p className="text-sm text-gray-500">Supports PDF, Excel, and CSV files</p>
                      </div>
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="statement-type">Statement Type *</Label>
                  <Select 
                    value={uploadData.statementType} 
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, statementType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select statement type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portfolio">Portfolio Statement</SelectItem>
                      <SelectItem value="transaction">Transaction Statement</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                      <SelectItem value="cash">Cash Statement</SelectItem>
                      <SelectItem value="tax">Tax Statement</SelectItem>
                      <SelectItem value="custody">Custody Statement</SelectItem>
                      <SelectItem value="trade-confirmation">Trade Confirmation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="account-id">Account *</Label>
                  <Select 
                    value={uploadData.accountId} 
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, accountId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACC001">Investment Portfolio (ACC001)</SelectItem>
                      <SelectItem value="ACC002">Pension Fund (ACC002)</SelectItem>
                      <SelectItem value="ACC003">Trading Account (ACC003)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="statement-period">Statement Period</Label>
                  <Select 
                    value={uploadData.statementPeriod} 
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, statementPeriod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="custom">Custom Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="statement-date">Statement Date</Label>
                  <Input
                    type="date"
                    value={uploadData.statementDate}
                    onChange={(e) => setUploadData(prev => ({ ...prev, statementDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  placeholder="Add any additional notes about this statement"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Statement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
