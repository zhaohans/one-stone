import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Plus, FileDown, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';

// Dummy data for placeholder
const EMPLOYEES = [
  { id: 1, name: 'Alice Smith', department: 'Compliance', role: 'Officer', status: 'up_to_date', last: '2024-01-10', next: '2025-01-10', provider: 'ACME Training' },
  { id: 2, name: 'Bob Lee', department: 'Finance', role: 'Analyst', status: 'expiring', last: '2023-08-01', next: '2024-08-01', provider: 'SafeCert' },
  { id: 3, name: 'Carol Jones', department: 'Compliance', role: 'Manager', status: 'expired', last: '2022-06-15', next: '2023-06-15', provider: 'ACME Training' },
];

const STATUS_COLORS = {
  up_to_date: 'bg-green-500',
  expiring: 'bg-yellow-500',
  expired: 'bg-red-500',
};
const STATUS_LABELS = {
  up_to_date: 'Up to Date',
  expiring: 'Expiring',
  expired: 'Expired',
};

const ComplianceTraining = () => {
  const [filterDept, setFilterDept] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Placeholder for filtered data
  const filtered = EMPLOYEES.filter(e =>
    (filterDept === 'all' || e.department === filterDept) &&
    (filterRole === 'all' || e.role === filterRole) &&
    (filterType === 'all' || filterType === 'all') && // Placeholder, update when training type is in data
    (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Page header and breadcrumb */}
      <div className="mb-4 flex items-center gap-4">
        <GraduationCap className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Compliance Training</h1>
          <Breadcrumb>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Compliance</BreadcrumbItem>
            <BreadcrumbItem>Training</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      {/* Filter/search bar */}
      <Card className="mb-4">
        <CardContent className="flex flex-wrap gap-4 items-center py-4">
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-56"
          />
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Officer">Officer</SelectItem>
              <SelectItem value="Analyst">Analyst</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
            </SelectContent>
          </Select>
          {/* Training type filter placeholder */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Training Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="AML">AML</SelectItem>
              <SelectItem value="KYC">KYC</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="ml-auto" size="sm">
            <FileDown className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => setShowModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add Training Record
          </Button>
        </CardContent>
      </Card>
      {/* Table of employees */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Training Status</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Training</th>
                <th className="px-4 py-2 text-left">Next Due</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Proof</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-400">No records found.</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.department}</td>
                  <td className="px-4 py-2">{emp.role}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold ${STATUS_COLORS[emp.status]}`}>{STATUS_LABELS[emp.status]}</span>
                  </td>
                  <td className="px-4 py-2">{emp.last}</td>
                  <td className="px-4 py-2">{emp.next}</td>
                  <td className="px-4 py-2">{emp.provider}</td>
                  <td className="px-4 py-2">
                    {/* Placeholder for proof upload/download */}
                    <Button variant="ghost" size="icon" title="Upload/View Proof"><Upload className="w-4 h-4" /></Button>
                  </td>
                  <td className="px-4 py-2">
                    {/* Placeholder for edit/delete actions */}
                    <Button variant="outline" size="icon" title="Edit"><span className="sr-only">Edit</span>✏️</Button>
                    <Button variant="destructive" size="icon" title="Delete" className="ml-2"><span className="sr-only">Delete</span>🗑️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Add Training Record Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Training Record</DialogTitle>
          </DialogHeader>
          {/* Form fields for new record (employee, type, date, provider, proof upload) */}
          <div className="space-y-4 py-2">
            <Input placeholder="Employee Name" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Training Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AML">AML</SelectItem>
                <SelectItem value="KYC">KYC</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Training Date" />
            <Input placeholder="Provider" />
            <Input type="file" accept="application/pdf,image/*" />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* TODO: Integrate backend API for fetch/create/update/delete/search, automate reminders, and export */}
    </div>
  );
};

export default ComplianceTraining; 