
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentsTableProps {
  accountId: string;
}

const DocumentsTable = ({ accountId }: DocumentsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Documents for account {accountId}</p>
      </CardContent>
    </Card>
  );
};

export default DocumentsTable;
