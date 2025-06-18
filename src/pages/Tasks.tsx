
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
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Users,
  Building2,
  FileText,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeId: string;
  creator: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string;
  createdAt: string;
  relatedAccount?: string;
  relatedEntity?: string;
  entityType?: 'client' | 'account' | 'authorization' | 'document';
  completedAt?: string;
  comments: TaskComment[];
}

interface TaskComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const Tasks = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [newComment, setNewComment] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
    relatedAccount: '',
    entityType: 'account'
  });

  // Mock tasks data
  const tasksData: Task[] = [
    {
      id: '1',
      title: 'Review Authorization Matrix - John Matthews',
      description: 'Update signatory authorization matrix for BOS account. Requires documentation review and approval.',
      assignee: 'Sarah Chen',
      assigneeId: 'sarah.chen',
      creator: 'Michael Wong',
      status: 'pending',
      priority: 'high',
      category: 'authorization',
      dueDate: '2024-01-20T17:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      relatedAccount: 'ACC-2024-001',
      relatedEntity: 'John Matthews',
      entityType: 'authorization',
      comments: [
        {
          id: '1-1',
          author: 'Michael Wong',
          content: 'Please prioritize this as client is waiting for approval.',
          timestamp: '2024-01-15T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Prepare Monthly AUM Report',
      description: 'Generate and review monthly AUM performance report for Tech Solutions Pte Ltd.',
      assignee: 'David Tan',
      assigneeId: 'david.tan',
      creator: 'Current User',
      status: 'in_progress',
      priority: 'medium',
      category: 'reporting',
      dueDate: '2024-01-25T12:00:00Z',
      createdAt: '2024-01-10T09:00:00Z',
      relatedAccount: 'ACC-2024-002',
      relatedEntity: 'Tech Solutions Pte Ltd',
      entityType: 'client',
      comments: []
    },
    {
      id: '3',
      title: 'Document Upload Follow-up',
      description: 'Follow up with LGT Bank on pending document submissions for retirement portfolio.',
      assignee: 'Lisa Wang',
      assigneeId: 'lisa.wang',
      creator: 'Sarah Chen',
      status: 'completed',
      priority: 'low',
      category: 'documentation',
      dueDate: '2024-01-18T15:00:00Z',
      createdAt: '2024-01-12T14:00:00Z',
      completedAt: '2024-01-17T11:30:00Z',
      relatedAccount: 'ACC-2024-003',
      relatedEntity: 'LGT Bank',
      entityType: 'document',
      comments: [
        {
          id: '3-1',
          author: 'Lisa Wang',
          content: 'Documents received and processed successfully.',
          timestamp: '2024-01-17T11:30:00Z'
        }
      ]
    },
    {
      id: '4',
      title: 'KYC Review - New Client Onboarding',
      description: 'Complete KYC documentation review for new client application.',
      assignee: 'Michael Wong',
      assigneeId: 'michael.wong',
      creator: 'Compliance Team',
      status: 'overdue',
      priority: 'high',
      category: 'compliance',
      dueDate: '2024-01-16T17:00:00Z',
      createdAt: '2024-01-14T08:00:00Z',
      relatedAccount: 'ACC-2024-004',
      relatedEntity: 'New Client Application',
      entityType: 'client',
      comments: []
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'client': return <User className="w-4 h-4" />;
      case 'account': return <Building2 className="w-4 h-4" />;
      case 'authorization': return <Users className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || task.category === filterBy;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my_tasks' && task.assigneeId === 'current.user') ||
                      (activeTab === 'created_by_me' && task.creator === 'Current User') ||
                      task.status === activeTab;
    
    return matchesSearch && matchesFilter && matchesTab;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.assignee || !taskForm.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setShowCreateModal(false);
    setTaskForm({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
      relatedAccount: '',
      entityType: 'account'
    });
    toast({
      title: "Task Created",
      description: "New task has been created and assigned successfully",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Task status changed to ${newStatus}`,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setNewComment('');
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task",
    });
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const getTabCounts = () => {
    return {
      all: tasksData.length,
      pending: tasksData.filter(t => t.status === 'pending').length,
      in_progress: tasksData.filter(t => t.status === 'in_progress').length,
      completed: tasksData.filter(t => t.status === 'completed').length,
      overdue: tasksData.filter(t => t.status === 'overdue').length,
      my_tasks: tasksData.filter(t => t.assigneeId === 'current.user').length
    };
  };

  const counts = getTabCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage tasks, assignments, and deadlines</p>
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
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({counts.in_progress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({counts.overdue})</TabsTrigger>
          <TabsTrigger value="my_tasks">My Tasks ({counts.my_tasks})</TabsTrigger>
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
              <Card 
                key={task.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openTaskDetails(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          Due: {format(new Date(task.dueDate), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                      
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
                          
                          {task.relatedEntity && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {getEntityIcon(task.entityType)}
                              <span>{task.relatedEntity}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {task.comments.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {task.comments.length} comments
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
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

      {/* Task Details Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedTask && getStatusIcon(selectedTask.status)}
              <span>{selectedTask?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Created by {selectedTask?.creator} • Assigned to {selectedTask?.assignee}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              {/* Task Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Select 
                    value={selectedTask.status} 
                    onValueChange={(value) => handleStatusChange(selectedTask.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <div className="mt-1 text-sm">
                    {format(new Date(selectedTask.dueDate), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm">{selectedTask.description}</p>
              </div>
              
              {selectedTask.relatedAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Related Account</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedTask.relatedAccount}</Badge>
                  </div>
                </div>
              )}
              
              {/* Comments */}
              <div className="space-y-4">
                <h4 className="font-medium">Comments</h4>
                <div className="space-y-3">
                  {selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.author)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.timestamp), 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleAddComment} size="sm">
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create and assign a new task to team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input 
                placeholder="Enter task title" 
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Enter task description..." 
                rows={4}
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assignee *</label>
                <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm(prev => ({ ...prev, assignee: value }))}>
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
                <label className="text-sm font-medium">Due Date *</label>
                <Input 
                  type="datetime-local" 
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={taskForm.category} onValueChange={(value) => setTaskForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Related Account (Optional)</label>
              <Select value={taskForm.relatedAccount} onValueChange={(value) => setTaskForm(prev => ({ ...prev, relatedAccount: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select related account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACC-2024-001">ACC-2024-001 - John Matthews</SelectItem>
                  <SelectItem value="ACC-2024-002">ACC-2024-002 - Tech Solutions</SelectItem>
                  <SelectItem value="ACC-2024-003">ACC-2024-003 - Retirement Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
