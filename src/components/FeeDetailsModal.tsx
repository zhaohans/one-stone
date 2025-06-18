import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';
import { CheckCircle, DollarSign, FileText, Users } from 'lucide-react';

interface Retrocession {
  id: string;
  amount: number;
  recipient: string;
}

interface FeeDetails {
  id: string;
  type: string;
  amount: number;
  period_start: string;
  period_end: string;
  is_paid?: boolean;
  retrocessions?: Retrocession[];
}

interface FeeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  fee: FeeDetails | null;
}

const FeeDetailsModal: React.FC<FeeDetailsModalProps> = ({ open, onClose, fee }) => {
  if (!fee) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fee Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <Badge>{fee.type}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span>${fee.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Period:</span>
            <span>{fee.period_start} - {fee.period_end}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span>{fee.is_paid ? <Badge variant="success">Paid</Badge> : <Badge variant="secondary">Unpaid</Badge>}</span>
          </div>
          {fee.retrocessions && fee.retrocessions.length > 0 && (
            <div>
              <span className="font-medium">Retrocessions:</span>
              <ul className="list-disc list-inside mt-1">
                {fee.retrocessions.map((r) => (
                  <li key={r.id}>
                    {r.recipient}: ${r.amount.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeDetailsModal;
