
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionsTableProps {
  accountId: string;
}

const TransactionsTable = ({ accountId }: TransactionsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Transaction data for account {accountId}</p>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
