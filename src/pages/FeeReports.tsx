import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useFeeCalculation } from "@/hooks/useFeeCalculation";
import { useAccountsContext } from "@/contexts/AccountsContext";
import { FeeCalculationModal } from "@/components/FeeCalculationModal";
import { FeesTable } from "@/components/FeesTable";
import { Calculator, TrendingUp, DollarSign, Users } from "lucide-react";
import { DateRange } from "react-day-picker";

const FeeReports = () => {
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fees, setFees] = useState<any[]>([]);

  const { getFees } = useFeeCalculation();
  const { accounts } = useAccountsContext();

  const loadFees = async () => {
    const startDate = dateRange?.from
      ? dateRange.from.toISOString().split("T")[0]
      : undefined;
    const endDate = dateRange?.to
      ? dateRange.to.toISOString().split("T")[0]
      : undefined;

    const result = await getFees(
      selectedAccount === "all" ? undefined : selectedAccount,
      startDate,
      endDate,
    );
    if (result.success) {
      setFees(result.fees);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading fees with filters:", { selectedAccount, dateRange });
      const startDate = dateRange?.from
        ? dateRange.from.toISOString().split("T")[0]
        : undefined;
      const endDate = dateRange?.to
        ? dateRange.to.toISOString().split("T")[0]
        : undefined;

      const result = await getFees(
        selectedAccount === "all" ? undefined : selectedAccount,
        startDate,
        endDate,
      );
      if (result.success) {
        setFees(result.fees);
      }
    };

    loadData();
  }, [selectedAccount, dateRange]);

  const totalFees = fees.reduce((sum, fee) => sum + fee.calculated_amount, 0);
  const paidFees = fees
    .filter((fee) => fee.is_paid)
    .reduce((sum, fee) => sum + fee.calculated_amount, 0);
  const pendingFees = totalFees - paidFees;
  const totalRetrocessions = fees.reduce((sum, fee) => {
    if (fee.retrocessions) {
      return (
        sum +
        fee.retrocessions.reduce(
          (retroSum: number, retro: any) => retroSum + retro.amount,
          0,
        )
      );
    }
    return sum;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-2">
            Calculate, track, and manage fees and retrocessions
          </p>
        </div>
        <Button onClick={() => setShowCalculationModal(true)}>
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Fee
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalFees)}
            </div>
            <p className="text-xs text-muted-foreground">All calculated fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(paidFees)}
            </div>
            <p className="text-xs text-muted-foreground">
              {fees.filter((f) => f.is_paid).length} payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(pendingFees)}
            </div>
            <p className="text-xs text-muted-foreground">
              {fees.filter((f) => !f.is_paid).length} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retrocessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRetrocessions)}
            </div>
            <p className="text-xs text-muted-foreground">Partner payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account</label>
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All accounts</SelectItem>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name} ({account.account_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date Range
              </label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAccount("all");
                  setDateRange(undefined);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
        </CardHeader>
        <CardContent>
          <FeesTable fees={fees} onFeesUpdate={loadFees} />
        </CardContent>
      </Card>

      {/* Fee Calculation Modal */}
      <FeeCalculationModal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        onFeeCalculated={loadFees}
      />
    </div>
  );
};

export default FeeReports;
