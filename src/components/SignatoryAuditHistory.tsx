
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter } from 'lucide-react';
import { SignatoryAuditLog } from '@/types/signatory';

interface SignatoryAuditHistoryProps {
  accountId: string;
  auditLogs: SignatoryAuditLog[];
  onClose: () => void;
}

const SignatoryAuditHistory = ({ accountId, auditLogs, onClose }: SignatoryAuditHistoryProps) => {
  const [filteredLogs, setFilteredLogs] = useState<SignatoryAuditLog[]>([]);
  const [filters, setFilters] = useState({
    action: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  useEffect(() => {
    let filtered = [...auditLogs];

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => new Date(log.changed_at) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => new Date(log.changed_at) <= new Date(filters.dateTo));
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.field_changed?.toLowerCase().includes(searchTerm) ||
        log.reason?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.old_value)?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.new_value)?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLogs(filtered);
  }, [auditLogs, filters]);

  const getActionBadge = (action: string) => {
    const actionColors = {
      created: 'bg-green-100 text-green-800',
      updated: 'bg-blue-100 text-blue-800',
      removed: 'bg-red-100 text-red-800',
      activated: 'bg-green-100 text-green-800',
      deactivated: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={actionColors[action as keyof typeof actionColors] || 'bg-gray-100 text-gray-800'}>
        {action.toUpperCase()}
      </Badge>
    );
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date/Time', 'Action', 'Field Changed', 'Old Value', 'New Value', 'Changed By', 'Reason'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.changed_at).toLocaleString(),
        log.action,
        log.field_changed || '',
        formatValue(log.old_value),
        formatValue(log.new_value),
        log.changed_by,
        log.reason || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signatory-audit-log-${accountId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="text-sm font-medium">Action</label>
          <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
              <SelectItem value="activated">Activated</SelectItem>
              <SelectItem value="deactivated">Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">From Date</label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">To Date</label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search changes..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredLogs.length} audit log entries
        </p>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Audit Log Table */}
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Field Changed</TableHead>
              <TableHead>Old Value</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">
                  {new Date(log.changed_at).toLocaleString()}
                </TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell className="font-medium">{log.field_changed || '-'}</TableCell>
                <TableCell className="max-w-32 truncate">{formatValue(log.old_value)}</TableCell>
                <TableCell className="max-w-32 truncate">{formatValue(log.new_value)}</TableCell>
                <TableCell>{log.changed_by}</TableCell>
                <TableCell className="max-w-32 truncate">{log.reason || '-'}</TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No audit log entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SignatoryAuditHistory;
