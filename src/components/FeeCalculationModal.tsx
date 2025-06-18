
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';
import { useAccounts } from '@/hooks/useAccounts';

interface FeeCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeeCalculated: () => void;
}

export const FeeCalculationModal: React.FC<FeeCalculationModalProps> = ({
  isOpen,
  onClose,
  onFeeCalculated
}) => {
  const [accountId, setAccountId] = useState<string>('');
  const [feeType, setFeeType] = useState<'management' | 'performance' | 'transaction' | 'custody' | 'retrocession' | 'other'>('management');
  const [feeRate, setFeeRate] = useState<number>(1.0);
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();

  const { calculateFee, isCalculating } = useFeeCalculation();
  const { data: accountsData } = useAccounts();

  const handleCalculate = async () => {
    if (!accountId || !periodStart || !periodEnd) return;

    const result = await calculateFee({
      account_id: accountId,
      period_start: format(periodStart, 'yyyy-MM-dd'),
      period_end: format(periodEnd, 'yyyy-MM-dd'),
      fee_type: feeType,
      fee_rate: feeRate
    });

    if (result.success) {
      onFeeCalculated();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Calculate Fee</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account" className="text-right">Account</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accountsData?.accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name} ({account.account_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feeType" className="text-right">Fee Type</Label>
            <Select value={feeType} onValueChange={(value: any) => setFeeType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="management">Management Fee</SelectItem>
                <SelectItem value="performance">Performance Fee</SelectItem>
                <SelectItem value="transaction">Transaction Fee</SelectItem>
                <SelectItem value="custody">Custody Fee</SelectItem>
                <SelectItem value="retrocession">Retrocession</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feeRate" className="text-right">Fee Rate (%)</Label>
            <Input
              id="feeRate"
              type="number"
              step="0.01"
              value={feeRate}
              onChange={(e) => setFeeRate(parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Period Start</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !periodStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {periodStart ? format(periodStart, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={periodStart}
                  onSelect={setPeriodStart}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Period End</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !periodEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {periodEnd ? format(periodEnd, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={periodEnd}
                  onSelect={setPeriodEnd}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating || !accountId || !periodStart || !periodEnd}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Fee'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
