
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';
import { CheckCircle, DollarSign, FileText, Users } from 'lucide-react';

interface Fee {
  id: string;
  account_id: string;
  fee_type: string;
  fee_description: string;
  calculation_period_start: string;
  calculation_period_end: string;
  fee_rate?: number;
  calculated_amount: number;
  billed_amount?: number;
  billing_date?: string;
  payment_date?: string;
  is_paid: boolean;
  currency: string;
  notes?: string;
  created_at: string;
  accounts?: {
    account_name: string;
    account_number: string;
    client_id: string;
  };
  retrocessions?: Array<{
    id: string;
    recipient_name: string;
    recipient_type: string;
    retrocession_rate: number;
    amount: number;
    currency: string;
    is_paid: boolean;
    payment_date?: string;
    notes?: string;
  }>;
}

interface FeeDetailsModalProps {
  fee: Fee;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const FeeDetailsModal: React.FC<FeeDetailsModalProps> = ({
  fee,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { markFeePaid } = useFeeCalculation();

  const handleMarkPaid = async () => {
    const result = await markFeePaid(fee.id);
    if (result.success) {
      onUpdate();
      onClose();
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Fee Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fee Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fee Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Account</label>
                  <div className="font-semibold">{fee.accounts?.account_name}</div>
                  <div className="text-sm text-gray-500">{fee.accounts?.account_number}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fee Type</label>
                  <div className="mt-1">
                    <Badge className={
                      fee.fee_type === 'management' ? 'bg-blue-100 text-blue-800' :
                      fee.fee_type === 'performance' ? 'bg-green-100 text-green-800' :
                      fee.fee_type === 'transaction' ? 'bg-yellow-100 text-yellow-800' :
                      fee.fee_type === 'custody' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {fee.fee_type.charAt(0).toUpperCase() + fee.fee_type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <div className="font-medium">{fee.fee_description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Calculation Period</label>
                  <div className="font-medium">
                    {formatDate(fee.calculation_period_start)} - {formatDate(fee.calculation_period_end)}
                  </div>
                </div>
                {fee.fee_rate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fee Rate</label>
                    <div className="font-medium">{fee.fee_rate}%</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Financial Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Calculated Amount</label>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(fee.calculated_amount, fee.currency)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {fee.is_paid ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending Payment</Badge>
                    )}
                  </div>
                </div>
              </div>

              {fee.billed_amount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Billed Amount</label>
                  <div className="font-semibold">{formatCurrency(fee.billed_amount, fee.currency)}</div>
                  {fee.billing_date && (
                    <div className="text-sm text-gray-500">Billed on {formatDate(fee.billing_date)}</div>
                  )}
                </div>
              )}

              {fee.payment_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Date</label>
                  <div className="font-semibold">{formatDate(fee.payment_date)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Retrocessions */}
          {fee.retrocessions && fee.retrocessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Retrocessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fee.retrocessions.map((retro, index) => (
                    <div key={retro.id}>
                      {index > 0 && <Separator className="my-3" />}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Recipient</label>
                          <div className="font-semibold">{retro.recipient_name}</div>
                          <div className="text-sm text-gray-500 capitalize">{retro.recipient_type}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Amount</label>
                          <div className="font-semibold">{formatCurrency(retro.amount, retro.currency)}</div>
                          <div className="text-sm text-gray-500">{retro.retrocession_rate}% rate</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          {retro.is_paid ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid {retro.payment_date && `on ${formatDate(retro.payment_date)}`}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                      </div>
                      {retro.notes && (
                        <div className="mt-2">
                          <label className="text-sm font-medium text-gray-500">Notes</label>
                          <div className="text-sm">{retro.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          {fee.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{fee.notes}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!fee.is_paid && (
            <Button onClick={handleMarkPaid}>
              <DollarSign className="w-4 h-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
