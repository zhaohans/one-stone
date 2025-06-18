import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  MessageSquare,
  Building2,
  Users,
  Shield,
  FileText,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    relatedAccount: '',
    category: 'general'
  });

  // Mock tasks data
  const tasksData = [
    {
      id: '1',
      title: 'Update Signatory Authorization - John Matthews',
      description: 'Review and update the authorization matrix for BOS account. Verify relationship documentation for LI Jianmin.',
      assignee: 'Sarah Chen',
      assigneeId: 'sarah.chen',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15',
      category: 'authorization',
      relatedAccount: 'ACC-2024-001',
      comments: [
        {
          id: '1-1',
          author: 'Michael Wong',
          content: 'Contacted client for additional documentation',
          timestamp: '2024-01-16T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Prepare Monthly AUM Report',
      description: 'Generate comprehensive AUM performance report for Tech Solutions Pte Ltd including rebalancing recommendations.',
      assignee: 'David Tan',
      assigneeId: 'david.tan',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-25',
      createdDate: '2024-01-14',
      category: 'reporting',
      relatedAccount: 'ACC-2024-002',
      comments: []
    },
    {
      id: '3',
      title: 'Process Document Upload - LGT Bank',
      description: 'Verify and process retirement portfolio documents for Maria Rodriguez received from LGT Bank.',
      assignee: 'Lisa Wang',
      assigneeId: 'lisa.wang',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-18',
      createdDate: '2024-01-13',
      category: 'documentation',
      relatedAccount: 'ACC-2024-003',
      comments: [
        {
          id: '3-1',
          author: 'Lisa Wang',
          content: 'Documents verified and uploaded to system',
          timestamp: '2024-01-17T14:20:00Z'
        }
      ]
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authorization': return <Shield className="w-4 h-4" />;
      case 'reporting': return <FileText className="w-4 h-4" />;
      case 'documentation': return <FolderOpen className="w-4 h-4" />;
      case 'client': return <User className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || task.category === filterBy;
    
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'my-tasks' && task.assigneeId === 'current-user') ||
                       (activeTab === 'pending' && task.status === 'pending') ||
                       (activeTab === 'completed' && task.status === 'completed');
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    toast.success("Task created successfully");
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: '',
      relatedAccount: '',
      category: 'general'
    });
    setShowCreateModal(false);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasksData.find(t => t.dueDate === dueDate)?.status.includes('completed');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage to-do items and track progress</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authorization">Authorization</SelectItem>
                <SelectItem value="reporting">Reporting</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="client">Client Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tasks ({tasksData.length})</TabsTrigger>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tasksData.filter(t => t.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tasksData.filter(t => t.status === 'completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className={`hover:shadow-md transition-shadow ${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(task.status)}
                              <span>{task.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                          {isOverdue(task.dueDate) && task.status !== 'completed' && (
                            <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{task.assignee}</span>
                          </div>
                          
                          {task.relatedAccount && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Building2 className="w-3 h-3" />
                              <Badge variant="outline" className="text-xs">{task.relatedAccount}</Badge>
                            </div>
                          )}
                          
                          {task.comments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <MessageSquare className="w-3 h-3" />
                              <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                          {task.status !== 'completed' && (
                            <Button size="sm" variant="outline">
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the task..."
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assignee</label>
                <Select
                  value={newTask.assignee}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assignee: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah.chen">Sarah Chen</SelectItem>
                    <SelectItem value="michael.wong">Michael Wong</SelectItem>
                    <SelectItem value="david.tan">David Tan</SelectItem>
                    <SelectItem value="lisa.wang">Lisa Wang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="client">Client Task</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Related Account</label>
              <Select
                value={newTask.relatedAccount}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, relatedAccount: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select related account (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACC-2024-001">ACC-2024-001 (John Matthews)</SelectItem>
                  <SelectItem value="ACC-2024-002">ACC-2024-002 (Tech Solutions)</SelectItem>
                  <SelectItem value="ACC-2024-003">ACC-2024-003 (Maria Rodriguez)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
