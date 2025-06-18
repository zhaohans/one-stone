import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  Shield,
  TrendingUp,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Calendar,
  Building2,
  Paperclip,
  MessageSquare,
  CheckSquare,
  UserCheck,
  AlertCircle,
  Mail,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for the compliance dashboard
const kpiData = {
  pendingOnboardings: 12,
  overdueKYC: 7,
  complianceApprovals: 23,
  retrocessionReviews: 8,
  policyAcknowledgments: 15,
  tasksProgress: 73
};

const kycStatusData = [
  { name: 'Approved', value: 145, color: '#10B981' },
  { name: 'In Progress', value: 23, color: '#F59E0B' },
  { name: 'Overdue', value: 7, color: '#EF4444' },
  { name: 'Not Started', value: 12, color: '#6B7280' },
  { name: 'Rejected', value: 3, color: '#F97316' }
];

const monthlyTasksData = [
  { month: 'Jan', resolved: 45, created: 52 },
  { month: 'Feb', resolved: 38, created: 41 },
  { month: 'Mar', resolved: 67, created: 58 },
  { month: 'Apr', resolved: 52, created: 49 },
  { month: 'May', resolved: 61, created: 63 },
  { month: 'Jun', resolved: 48, created: 44 }
];

const retrocessionData = [
  { period: 'Q1 2024', pending: 8, approved: 45, rejected: 2 },
  { period: 'Q2 2024', pending: 12, approved: 38, rejected: 1 },
  { period: 'Q3 2024', pending: 6, approved: 42, rejected: 3 },
  { period: 'Q4 2024', pending: 9, approved: 51, rejected: 1 }
];

const complianceTasks = [
  {
    id: 'CMP-001',
    taskName: 'Annual KYC Review',
    type: 'KYC',
    client: 'Acme Corp',
    account: 'ACC-2024-001',
    dueDate: '2024-07-15',
    status: 'Pending',
    assignedTo: 'Sarah Johnson',
    lastAction: 'Created by System',
    urgency: 'High',
    hasDocs: true,
    overdue: true
  },
  {
    id: 'CMP-002',
    taskName: 'Client Onboarding Review',
    type: 'Onboarding',
    client: 'Tech Solutions Ltd',
    account: 'ACC-2024-002',
    dueDate: '2024-07-20',
    status: 'In Progress',
    assignedTo: 'Mike Chen',
    lastAction: 'Updated by Mike Chen',
    urgency: 'Normal',
    hasDocs: true,
    overdue: false
  },
  {
    id: 'CMP-003',
    taskName: 'Retrocession Rate Approval',
    type: 'Fee/Retro',
    client: 'Global Investments',
    account: 'ACC-2024-003',
    dueDate: '2024-07-25',
    status: 'Approved',
    assignedTo: 'Sarah Johnson',
    lastAction: 'Approved by Sarah Johnson',
    urgency: 'Normal',
    hasDocs: true,
    overdue: false
  },
  {
    id: 'CMP-004',
    taskName: 'Trade Review - High Value',
    type: 'Trade Review',
    client: 'Wealth Partners',
    account: 'ACC-2024-004',
    dueDate: '2024-07-18',
    status: 'Pending',
    assignedTo: 'David Wilson',
    lastAction: 'Flagged by System',
    urgency: 'High',
    hasDocs: false,
    overdue: false
  },
  {
    id: 'CMP-005',
    taskName: 'AML Policy Acknowledgment',
    type: 'Policy',
    client: 'Internal Staff',
    account: 'N/A',
    dueDate: '2024-07-30',
    status: 'Overdue',
    assignedTo: 'All Staff',
    lastAction: 'Reminder sent',
    urgency: 'Normal',
    hasDocs: true,
    overdue: true
  }
];

const ComplianceDashboard = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Rejected':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Normal':
        return 'bg-gray-100 text-gray-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateColor = (dueDate: string, overdue: boolean) => {
    if (overdue) return 'text-red-600 font-medium';
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return 'text-orange-600 font-medium';
    return 'text-gray-600';
  };

  const filteredTasks = complianceTasks.filter(task => {
    const matchesType = filterType === 'All' || task.type === filterType;
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.account.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on tasks:`, selectedTasks);
    // Implementation would handle bulk operations
    setSelectedTasks([]);
  };

  const handleTaskAction = (action: string, task: any) => {
    console.log(`Performing ${action} on task:`, task.id);
    
    if (action === 'approve') {
      setSelectedTask(task);
      setShowApprovalModal(true);
    } else if (action === 'reject') {
      setSelectedTask(task);
      setShowRejectionModal(true);
    } else if (action === 'view') {
      setSelectedTask(task);
      setShowTaskDetail(true);
    }
  };

  const handleApproval = () => {
    console.log('Approving task:', selectedTask?.id);
    setShowApprovalModal(false);
    setSelectedTask(null);
  };

  const handleRejection = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    console.log('Rejecting task:', selectedTask?.id, 'Reason:', rejectionReason);
    setShowRejectionModal(false);
    setSelectedTask(null);
    setRejectionReason('');
  };

  const overdueTasksCount = complianceTasks.filter(task => task.overdue).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all compliance tasks and reviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overdue Tasks Banner */}
      {overdueTasksCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">
              Warning: {overdueTasksCount} task{overdueTasksCount > 1 ? 's are' : ' is'} overdue.
            </p>
            <p className="text-red-600 text-sm">Click to review and take action.</p>
          </div>
        </div>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.pendingOnboardings}</p>
                <p className="text-xs text-gray-600">Pending Onboardings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.overdueKYC}</p>
                <p className="text-xs text-gray-600">Overdue KYC Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.complianceApprovals}</p>
                <p className="text-xs text-gray-600">Approvals Required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.retrocessionReviews}</p>
                <p className="text-xs text-gray-600">Retrocession Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.policyAcknowledgments}</p>
                <p className="text-xs text-gray-600">Policy Acknowledgments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpiData.tasksProgress}%</p>
                <p className="text-xs text-gray-600">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client KYC Status</CardTitle>
            <CardDescription>Current KYC review status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={kycStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {kycStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Task Resolution</CardTitle>
            <CardDescription>Tasks created vs resolved by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTasksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="created" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retrocession Approvals</CardTitle>
            <CardDescription>Approval status by quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={retrocessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#10B981" />
                <Bar dataKey="pending" fill="#F59E0B" />
                <Bar dataKey="rejected" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length === 0 
                  ? "No compliance tasks found—system is up to date."
                  : `Showing ${filteredTasks.length} of ${complianceTasks.length} compliance tasks`
                }
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {selectedTasks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                    Bulk Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('remind')}>
                    Bulk Remind
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                    Bulk Export
                  </Button>
                </div>
              )}
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by task, client, status, date, RM, reviewer, doc…"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="KYC">KYC</SelectItem>
                <SelectItem value="Trade Review">Trade Review</SelectItem>
                <SelectItem value="Fee/Retro">Fee/Retro</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Task Name/Type</TableHead>
                    <TableHead>Client/Account</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Last Action</TableHead>
                    <TableHead>Docs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => handleTaskSelection(task.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{task.taskName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs", getUrgencyColor(task.urgency))}>
                              {task.urgency}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{task.client}</p>
                          <p className="text-sm text-gray-500">{task.account}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className={getDueDateColor(task.dueDate, task.overdue)}>
                          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          {task.overdue && <span className="ml-1 text-red-600">OVERDUE</span>}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getStatusColor(task.status))}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">
                              {task.assignedTo.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{task.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{task.lastAction}</p>
                      </TableCell>
                      <TableCell>
                        {task.hasDocs && (
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleTaskAction('view', task)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {task.status === 'Pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleTaskAction('approve', task)}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleTaskAction('reject', task)}
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Compliance Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this compliance task?
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedTask.taskName}</h4>
                <p className="text-sm text-gray-600">Client: {selectedTask.client}</p>
                <p className="text-sm text-gray-600">Account: {selectedTask.account}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <Textarea placeholder="Add any notes about this approval..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproval}>
              Approve Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Compliance Task</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this compliance task.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedTask.taskName}</h4>
                <p className="text-sm text-gray-600">Client: {selectedTask.client}</p>
                <p className="text-sm text-gray-600">Account: {selectedTask.account}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <Textarea 
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejection}>
              Reject Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      <Dialog open={showTaskDetail} onOpenChange={setShowTaskDetail}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="docs">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Task Name</label>
                    <p className="text-gray-900">{selectedTask.taskName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="text-gray-900">{selectedTask.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client</label>
                    <p className="text-gray-900">{selectedTask.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account</label>
                    <p className="text-gray-900">{selectedTask.account}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-gray-900">{format(new Date(selectedTask.dueDate), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge className={cn("text-xs", getStatusColor(selectedTask.status))}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned To</label>
                    <p className="text-gray-900">{selectedTask.assignedTo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Urgency</label>
                    <Badge className={cn("text-xs", getUrgencyColor(selectedTask.urgency))}>
                      {selectedTask.urgency}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="docs">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents attached to this task</p>
                  <Button variant="outline" className="mt-4">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Task Created</p>
                      <p className="text-xs text-gray-500">System generated task automatically</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-xs text-gray-500">Changed from 'Not Started' to 'Pending'</p>
                      <p className="text-xs text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="space-y-4">
                  <Textarea placeholder="Add internal notes about this task..." />
                  <Button size="sm">Add Note</Button>
                  <Separator />
                  <div className="text-center py-4">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notes added yet</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplianceDashboard;
