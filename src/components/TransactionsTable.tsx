import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrades } from '@/hooks/useTrades';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionsTableProps {
  accountId: string;
}

const TransactionsTable = ({ accountId }: TransactionsTableProps) => {
  const { trades, isLoading } = useTrades(accountId);

  const formatCurrency = (amount?: number, currency = 'USD') => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const getTradeTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'transfer_in':
        return 'bg-green-100 text-green-800';
      case 'sell':
      case 'transfer_out':
        return 'bg-red-100 text-red-800';
      case 'dividend':
        return 'bg-blue-100 text-blue-800';
      case 'fee':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled':
        return 'bg-green-100 text-green-800';
      case 'executed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Transactions
          <Badge variant="outline">
            {trades.length} transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found for this account
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      {new Date(trade.trade_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trade.security?.symbol}</div>
                        <div className="text-sm text-gray-500">{trade.security?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTradeTypeColor(trade.trade_type)}>
                        {trade.trade_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(trade.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(trade.price, trade.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(trade.net_amount, trade.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trade.trade_status)}>
                        {trade.trade_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
