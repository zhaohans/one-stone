import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
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
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ErrorPage from "@/pages/error/ErrorPage";
import { NotificationService } from "@/services/NotificationService";
import { useAuth } from "@/contexts/SimpleAuthContext";

// Mock data for the compliance dashboard
const kpiData = {
  pendingOnboardings: 12,
  overdueKYC: 7,
  complianceApprovals: 23,
  retrocessionReviews: 8,
  policyAcknowledgments: 15,
  tasksProgress: 73,
};

const kycStatusData = [
  { name: "Approved", value: 145, color: "#10B981" },
  { name: "In Progress", value: 23, color: "#F59E0B" },
  { name: "Overdue", value: 7, color: "#EF4444" },
  { name: "Not Started", value: 12, color: "#6B7280" },
  { name: "Rejected", value: 3, color: "#F97316" },
];

const monthlyTasksData = [
  { month: "Jan", resolved: 45, created: 52 },
  { month: "Feb", resolved: 38, created: 41 },
  { month: "Mar", resolved: 67, created: 58 },
  { month: "Apr", resolved: 52, created: 49 },
  { month: "May", resolved: 61, created: 63 },
  { month: "Jun", resolved: 48, created: 44 },
];

const retrocessionData = [
  { period: "Q1 2024", pending: 8, approved: 45, rejected: 2 },
  { period: "Q2 2024", pending: 12, approved: 38, rejected: 1 },
  { period: "Q3 2024", pending: 6, approved: 42, rejected: 3 },
  { period: "Q4 2024", pending: 9, approved: 51, rejected: 1 },
];

const complianceTasks = [
  {
    id: "CMP-001",
    taskName: "Annual KYC Review",
    type: "KYC",
    client: "Acme Corp",
    account: "ACC-2024-001",
    dueDate: "2024-07-15",
    status: "Pending",
    assignedTo: "Sarah Johnson",
    lastAction: "Created by System",
    urgency: "High",
    hasDocs: true,
    overdue: true,
  },
  {
    id: "CMP-002",
    taskName: "Client Onboarding Review",
    type: "Onboarding",
    client: "Tech Solutions Ltd",
    account: "ACC-2024-002",
    dueDate: "2024-07-20",
    status: "In Progress",
    assignedTo: "Mike Chen",
    lastAction: "Updated by Mike Chen",
    urgency: "Normal",
    hasDocs: true,
    overdue: false,
  },
  {
    id: "CMP-003",
    taskName: "Retrocession Rate Approval",
    type: "Fee/Retro",
    client: "Global Investments",
    account: "ACC-2024-003",
    dueDate: "2024-07-25",
    status: "Approved",
    assignedTo: "Sarah Johnson",
    lastAction: "Approved by Sarah Johnson",
    urgency: "Normal",
    hasDocs: true,
    overdue: false,
  },
  {
    id: "CMP-004",
    taskName: "Trade Review - High Value",
    type: "Trade Review",
    client: "Wealth Partners",
    account: "ACC-2024-004",
    dueDate: "2024-07-18",
    status: "Pending",
    assignedTo: "David Wilson",
    lastAction: "Flagged by System",
    urgency: "High",
    hasDocs: false,
    overdue: false,
  },
  {
    id: "CMP-005",
    taskName: "AML Policy Acknowledgment",
    type: "Policy",
    client: "Internal Staff",
    account: "N/A",
    dueDate: "2024-07-30",
    status: "Overdue",
    assignedTo: "All Staff",
    lastAction: "Reminder sent",
    urgency: "Normal",
    hasDocs: true,
    overdue: true,
  },
];

// Dummy data for training section (from ComplianceTraining.tsx)
const EMPLOYEES = [
  {
    id: 1,
    name: "Alice Smith",
    department: "Compliance",
    role: "Officer",
    status: "up_to_date",
    last: "2024-01-10",
    next: "2025-01-10",
    provider: "ACME Training",
  },
  {
    id: 2,
    name: "Bob Lee",
    department: "Finance",
    role: "Analyst",
    status: "expiring",
    last: "2023-08-01",
    next: "2024-08-01",
    provider: "SafeCert",
  },
  {
    id: 3,
    name: "Carol Jones",
    department: "Compliance",
    role: "Manager",
    status: "expired",
    last: "2022-06-15",
    next: "2023-06-15",
    provider: "ACME Training",
  },
];
const STATUS_COLORS = {
  up_to_date: "bg-green-500",
  expiring: "bg-yellow-500",
  expired: "bg-red-500",
};
const STATUS_LABELS = {
  up_to_date: "Up to Date",
  expiring: "Expiring",
  expired: "Expired",
};

const ComplianceDashboard = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [reportSent, setReportSent] = useState(false);

  const [filterDept, setFilterDept] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filteredEmployees = EMPLOYEES.filter(
    (e) =>
      (filterDept === "all" || e.department === filterDept) &&
      (filterRole === "all" || e.role === filterRole) &&
      (filterType === "all" || filterType === "all") &&
      (!search || e.name.toLowerCase().includes(search.toLowerCase())),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Normal":
        return "bg-gray-100 text-gray-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDueDateColor = (dueDate: string, overdue: boolean) => {
    if (overdue) return "text-red-600 font-medium";
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const filteredTasks = complianceTasks.filter((task) => {
    const matchesType = filterType === "All" || task.type === filterType;
    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.account.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map((task) => task.id));
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

    if (action === "approve") {
      setSelectedTask(task);
      setShowApprovalModal(true);
    } else if (action === "reject") {
      setSelectedTask(task);
      setShowRejectionModal(true);
    } else if (action === "view") {
      setSelectedTask(task);
      setShowTaskDetail(true);
    }
  };

  const handleApproval = () => {
    console.log("Approving task:", selectedTask?.id);
    setShowApprovalModal(false);
    setSelectedTask(null);
  };

  const handleRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    console.log(
      "Rejecting task:",
      selectedTask?.id,
      "Reason:",
      rejectionReason,
    );
    setShowRejectionModal(false);
    setSelectedTask(null);
    setRejectionReason("");
  };

  const overdueTasksCount = complianceTasks.filter(
    (task) => task.overdue,
  ).length;

  const sendErrorReport = async () => {
    if (!error) return;
    const context = [
      `User: ${user?.email || "Unknown"} (ID: ${user?.id || "N/A"})`,
      `Error: ${error.toString()}`,
      `Time: ${new Date().toISOString()}`,
      `Location: ${window.location.href}`,
    ].join("\n");
    await NotificationService.sendEmail({
      to: ["admin@yourdomain.com"],
      subject: `Compliance Dashboard Error: ${error.message}`,
      htmlContent: `<pre>${context}</pre>`,
      textContent: context,
    });
    setReportSent(true);
  };

  const handleRefresh = async () => {
    try {
      // Simulate async fetch or real API call
      throw new Error("Failed to fetch compliance data!");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  if (error) {
    return (
      <ErrorPage
        code={500}
        message={error.message}
        onSendReport={reportSent ? undefined : sendErrorReport}
      />
    );
  }

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      {/* Policy Docs Section */}
      <section>
        <h1 className="text-2xl font-bold mb-2">Compliance Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Monitor and manage all compliance tasks and reviews
        </p>
        {/* Overdue Tasks Banner */}
        {overdueTasksCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">
                Warning: {overdueTasksCount} task
                {overdueTasksCount > 1 ? "s are" : " is"} overdue.
              </p>
              <p className="text-red-600 text-sm">
                Click to review and take action.
              </p>
            </div>
          </div>
        )}
        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.pendingOnboardings}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.overdueKYC}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.complianceApprovals}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.retrocessionReviews}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.policyAcknowledgments}
                  </p>
                  <p className="text-xs text-gray-600">
                    Policy Acknowledgments
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.tasksProgress}%
                  </p>
                  <p className="text-xs text-gray-600">Tasks Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Client KYC Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={kycStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {kycStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
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
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={monthlyTasksData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Retrocession Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={retrocessionData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
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
        {/* Compliance Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Tasks</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedTasks.length === filteredTasks.length &&
                        filteredTasks.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-400"
                    >
                      No tasks found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) =>
                            handleTaskSelection(task.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{task.taskName}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>{task.client}</TableCell>
                      <TableCell>{task.account}</TableCell>
                      <TableCell
                        className={getDueDateColor(task.dueDate, task.overdue)}
                      >
                        {format(new Date(task.dueDate), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded ${getUrgencyColor(task.urgency)}`}
                        >
                          {task.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction("view", task)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          className="ml-2"
                          onClick={() => handleTaskAction("approve", task)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                          onClick={() => handleTaskAction("reject", task)}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Acknowledgments Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Acknowledgments</h2>
        <Card>
          <CardHeader>
            <CardTitle>Policy Acknowledgments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This is a placeholder for listing users who have acknowledged
              policies.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Training Section (from ComplianceTraining.tsx) */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Training</h2>
        {/* Filter/search bar */}
        <Card className="mb-4">
          <CardContent className="flex flex-wrap gap-4 items-center py-4">
            <Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Officer">Officer</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
            {/* Training type filter placeholder */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Training Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AML">AML</SelectItem>
                <SelectItem value="KYC">KYC</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto" size="sm">
              Export CSV
            </Button>
            <Button onClick={() => setShowModal(true)} size="sm">
              Add Training Record
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
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b last:border-0">
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2">{emp.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold ${STATUS_COLORS[emp.status]}`}
                        >
                          {STATUS_LABELS[emp.status]}
                        </span>
                      </td>
                      <td className="px-4 py-2">{emp.last}</td>
                      <td className="px-4 py-2">{emp.next}</td>
                      <td className="px-4 py-2">{emp.provider}</td>
                      <td className="px-4 py-2">
                        <Button variant="outline" size="icon" title="Edit">
                          <span className="sr-only">Edit</span>✏️
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          title="Delete"
                          className="ml-2"
                        >
                          <span className="sr-only">Delete</span>🗑️
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ComplianceDashboard;
