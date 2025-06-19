import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeeCalculation } from "@/hooks/useFeeCalculation";
import { CheckCircle, DollarSign, Eye, FileText } from "lucide-react";
import FeeDetailsModal from "./FeeDetailsModal";

interface Fee {
  id: string;
  account_id: string;
  fee_type: string;
  fee_description: string;
  calculation_period_start: string;
  calculation_period_end: string;
  calculated_amount: number;
  currency: string;
  is_paid: boolean;
  payment_date?: string;
  created_at: string;
  updated_at: string;
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

interface FeesTableProps {
  fees: Fee[];
  onFeesUpdate: () => void;
}

export const FeesTable: React.FC<FeesTableProps> = ({ fees, onFeesUpdate }) => {
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const { markFeePaid } = useFeeCalculation();

  const handleMarkPaid = async (feeId: string) => {
    const result = await markFeePaid(feeId);
    if (result.success) {
      onFeesUpdate();
    }
  };

  const getFeeTypeBadge = (feeType: string) => {
    const colors = {
      management: "bg-blue-100 text-blue-800",
      performance: "bg-green-100 text-green-800",
      transaction: "bg-yellow-100 text-yellow-800",
      custody: "bg-purple-100 text-purple-800",
      retrocession: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[feeType as keyof typeof colors] || colors.other}>
        {feeType.charAt(0).toUpperCase() + feeType.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retrocessions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">
                        {fee.accounts?.account_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fee.accounts?.account_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getFeeTypeBadge(fee.fee_type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {new Date(
                          fee.calculation_period_start,
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        to{" "}
                        {new Date(
                          fee.calculation_period_end,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(fee.calculated_amount, fee.currency)}
                  </TableCell>
                  <TableCell>
                    {fee.is_paid ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    {fee.payment_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(fee.payment_date).toLocaleDateString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {fee.retrocessions && fee.retrocessions.length > 0 ? (
                      <div className="space-y-1">
                        {fee.retrocessions.map((retro) => (
                          <div key={retro.id} className="text-xs">
                            <div className="font-medium">
                              {retro.recipient_name}
                            </div>
                            <div className="text-gray-500">
                              {formatCurrency(retro.amount, retro.currency)}
                              {retro.is_paid && (
                                <span className="text-green-600 ml-1">✓</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFee(fee)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!fee.is_paid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPaid(fee.id)}
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedFee && (
        <FeeDetailsModal
          fee={{
            id: selectedFee.id,
            type: selectedFee.fee_type,
            amount: selectedFee.calculated_amount,
            period_start: selectedFee.calculation_period_start,
            period_end: selectedFee.calculation_period_end,
            is_paid: selectedFee.is_paid,
            retrocessions:
              selectedFee.retrocessions?.map((r) => ({
                id: r.id,
                amount: r.amount,
                recipient: r.recipient_name,
              })) || [],
          }}
          open={!!selectedFee}
          onClose={() => setSelectedFee(null)}
        />
      )}
    </>
  );
};
