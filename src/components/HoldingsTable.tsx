
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePositions } from '@/hooks/usePositions';
import { Skeleton } from '@/components/ui/skeleton';

interface HoldingsTableProps {
  accountId: string;
}

const HoldingsTable = ({ accountId }: HoldingsTableProps) => {
  const { positions, isLoading } = usePositions(accountId);

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

  const getPnlColor = (pnl?: number) => {
    if (!pnl) return 'text-gray-500';
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Holdings
          <Badge variant="outline">
            {positions.length} positions • {formatCurrency(totalValue)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No holdings found for this account
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Security</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{position.security?.symbol}</div>
                      <div className="text-sm text-gray-500">{position.security?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(position.quantity)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(position.average_cost, position.security?.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(position.market_value, position.security?.currency)}
                  </TableCell>
                  <TableCell className={`text-right ${getPnlColor(position.unrealized_pnl)}`}>
                    {formatCurrency(position.unrealized_pnl, position.security?.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {position.security?.security_type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
