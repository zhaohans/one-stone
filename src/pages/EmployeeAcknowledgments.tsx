
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  Calendar as CalendarIcon,
  Bell,
  Mail,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

const EmployeeAcknowledgments = () => {
  const [activeTab, setActiveTab] = useState('acknowledgments');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all',
    type: 'all',
    priority: 'all'
  });

  // Mock data for acknowledgments
  const acknowledgments = [
    {
      id: '1',
      title: 'Q4 2024 Compliance Training Completion',
      description: 'All employees must complete mandatory compliance training modules',
      type: 'Training',
      priority: 'High',
      department: 'All',
      dueDate: '2024-12-31',
      createdDate: '2024-11-01',
      status: 'Active',
      requiredAcks: 85,
      receivedAcks: 62,
      completionRate: 73
    },
    {
      id: '2',
      title: 'Updated Code of Conduct Policy',
      description: 'Acknowledgment of revised code of conduct and ethics policy',
      type: 'Policy',
      priority: 'Critical',
      department: 'All',
      dueDate: '2024-11-15',
      createdDate: '2024-10-15',
      status: 'Overdue',
      requiredAcks: 85,
      receivedAcks: 78,
      completionRate: 92
    },
    {
      id: '3',
      title: 'Investment Committee Meeting Minutes - November',
      description: 'Review and acknowledge November investment committee decisions',
      type: 'Meeting Minutes',
      priority: 'Medium',
      department: 'Investment',
      dueDate: '2024-12-01',
      createdDate: '2024-11-10',
      status: 'Active',
      requiredAcks: 12,
      receivedAcks: 8,
      completionRate: 67
    }
  ];

  // Mock data for employee responses
  const employeeResponses = [
    {
      id: '1',
      employeeName: 'John Smith',
      department: 'Investment',
      role: 'Portfolio Manager',
      acknowledgmentTitle: 'Q4 2024 Compliance Training',
      status: 'Completed',
      completedDate: '2024-11-15',
      comments: 'Training completed successfully',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Windows 10 - Chrome'
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      department: 'Operations',
      role: 'Operations Manager',
      acknowledgmentTitle: 'Updated Code of Conduct Policy',
      status: 'Pending',
      completedDate: null,
      comments: null,
      ipAddress: null,
      deviceInfo: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Acknowledgments</h1>
          <p className="text-gray-600 mt-1">Manage policy acknowledgments, training confirmations, and compliance tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Acknowledgment
          </Button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Acknowledgments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requiring responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77%</div>
            <Progress value={77} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">148 of 192 responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
          <TabsTrigger value="responses">Employee Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates & Settings</TabsTrigger>
        </TabsList>

        {/* Acknowledgments Tab */}
        <TabsContent value="acknowledgments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search acknowledgments..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="meeting">Meeting Minutes</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title & Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acknowledgments.map((ack) => (
                    <TableRow key={ack.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ack.title}</div>
                          <div className="text-sm text-gray-500">{ack.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ack.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ack.priority)}>
                          {ack.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ack.department}</TableCell>
                      <TableCell>
                        <div className="text-sm">{format(new Date(ack.dueDate), 'MMM dd, yyyy')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{ack.receivedAcks}/{ack.requiredAcks}</span>
                            <span>{ack.completionRate}%</span>
                          </div>
                          <Progress value={ack.completionRate} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ack.status)}>
                          {ack.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Responses Tab */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Response Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department & Role</TableHead>
                    <TableHead>Acknowledgment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Audit Trail</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell>
                        <div className="font-medium">{response.employeeName}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{response.department}</div>
                          <div className="text-sm text-gray-500">{response.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>{response.acknowledgmentTitle}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(response.status)}>
                          {response.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {response.completedDate ? format(new Date(response.completedDate), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {response.comments || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {response.ipAddress && (
                          <div className="text-sm">
                            <div>IP: {response.ipAddress}</div>
                            <div className="text-gray-500">{response.deviceInfo}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rates by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Investment</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Operations</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-24" />
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Compliance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fastest Response</span>
                    <span className="font-medium">2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slowest Response</span>
                    <span className="font-medium">14 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acknowledgment Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Template
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Policy Acknowledgment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Standard template for policy acknowledgments</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Use</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Training Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Template for training completion confirmations</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Use</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Meeting Minutes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Template for meeting minutes acknowledgments</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Use</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeAcknowledgments;
