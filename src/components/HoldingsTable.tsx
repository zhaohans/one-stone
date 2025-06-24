
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HoldingsTableProps {
  accountId: string;
}

const HoldingsTable = ({ accountId }: HoldingsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Holdings data for account {accountId}</p>
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
