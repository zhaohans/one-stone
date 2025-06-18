
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Send,
  Reply,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar as CalendarIcon,
  Shield,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  // Mock messages data
  const messagesData = [
    {
      id: '1',
      subject: 'Authorization Update Required - BOS Account',
      from: 'Sarah Chen',
      fromType: 'team',
      to: ['Current User'],
      content: 'Please review and update the authorization matrix for John Matthews\' BOS account. The current signatory LI Jianmin requires formal relationship documentation.',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'unread',
      priority: 'high',
      category: 'authorization',
      relatedAccount: 'ACC-2024-001',
      replies: []
    },
    {
      id: '2',
      subject: 'Monthly AUM Report Discussion',
      from: 'Tech Solutions Pte Ltd',
      fromType: 'client',
      to: ['Michael Wong', 'Current User'],
      content: 'We would like to schedule a meeting to discuss the latest AUM performance and potential rebalancing strategies.',
      timestamp: '2024-01-14T15:45:00Z',
      status: 'read',
      priority: 'medium',
      category: 'client',
      relatedAccount: 'ACC-2024-002',
      replies: [
        {
          id: '2-1',
          from: 'Michael Wong',
          content: 'I can arrange a meeting for next Wednesday. Please let me know your preferred time.',
          timestamp: '2024-01-14T16:00:00Z'
        }
      ]
    },
    {
      id: '3',
      subject: 'Document Upload Confirmation - LGT Bank',
      from: 'LGT Bank',
      fromType: 'bank',
      to: ['David Tan', 'Current User'],
      content: 'We have received and processed the updated signatory documents for Maria Rodriguez\'s retirement portfolio.',
      timestamp: '2024-01-13T09:15:00Z',
      status: 'read',
      priority: 'low',
      category: 'documentation',
      relatedAccount: 'ACC-2024-003',
      replies: []
    }
  ];

  // Mock tasks data
  const tasksData = [
    {
      id: '1',
      title: 'Update Authorization Matrix - BOS',
      description: 'Review and update signatory information for LI Jianmin requiring formal relationship documentation',
      status: 'pending',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-01-20T00:00:00Z',
      createdDate: '2024-01-15T10:30:00Z',
      relatedAccount: 'ACC-2024-001',
      relatedClient: 'John Matthews',
      category: 'authorization',
      tags: ['signatory', 'compliance']
    },
    {
      id: '2',
      title: 'Prepare Monthly AUM Report',
      description: 'Generate comprehensive AUM report for Tech Solutions Pte Ltd including performance analysis',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Michael Wong',
      dueDate: '2024-01-25T00:00:00Z',
      createdDate: '2024-01-14T15:45:00Z',
      relatedAccount: 'ACC-2024-002',
      relatedClient: 'Tech Solutions Pte Ltd',
      category: 'reporting',
      tags: ['aum', 'report']
    },
    {
      id: '3',
      title: 'Upload KYC Documents - LGT Bank',
      description: 'Submit updated KYC documentation for Maria Rodriguez retirement portfolio',
      status: 'completed',
      priority: 'medium',
      assignee: 'David Tan',
      dueDate: '2024-01-18T00:00:00Z',
      createdDate: '2024-01-13T09:15:00Z',
      relatedAccount: 'ACC-2024-003',
      relatedClient: 'Maria Rodriguez',
      category: 'documentation',
      tags: ['kyc', 'compliance']
    },
    {
      id: '4',
      title: 'Client Meeting Follow-up',
      description: 'Schedule follow-up meeting with client to discuss investment strategy adjustments',
      status: 'pending',
      priority: 'low',
      assignee: 'Lisa Kumar',
      dueDate: '2024-01-30T00:00:00Z',
      createdDate: '2024-01-16T11:20:00Z',
      relatedAccount: 'ACC-2024-001',
      relatedClient: 'John Matthews',
      category: 'client',
      tags: ['meeting', 'strategy']
    }
  ];

  const teamMembers = ['Sarah Chen', 'Michael Wong', 'David Tan', 'Lisa Kumar', 'James Park'];
  const categories = ['authorization', 'reporting', 'documentation', 'client', 'compliance'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'in-progress', 'completed', 'overdue'];

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
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authorization': return <Shield className="w-4 h-4" />;
      case 'reporting': return <FileText className="w-4 h-4" />;
      case 'client': return <User className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFromTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return <User className="w-4 h-4" />;
      case 'bank': return <Building2 className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredMessages = messagesData.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || message.category === filterBy;
    return matchesSearch && matchesFilter;
  });

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.relatedClient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    toast.success("Reply sent successfully");
    setReplyText('');
    setShowReplyModal(false);
  };

  const handleCompose = () => {
    setShowComposeModal(false);
    toast.success("Message sent successfully");
  };

  const handleCreateTask = () => {
    setShowCreateTaskModal(false);
    toast.success("Task created successfully");
  };

  const handleToggleComplete = (taskId: string) => {
    toast.success("Task status updated");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Tasks</h1>
          <p className="text-gray-600">Communicate with clients, banks, team members and manage tasks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateTaskModal(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
          <Button onClick={() => setShowComposeModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Compose Message
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages and tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {activeTab === 'tasks' && (
              <>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {teamMembers.map(member => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {activeTab !== 'tasks' && (
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="client">Client Messages</SelectItem>
                  <SelectItem value="bank">Bank Messages</SelectItem>
                  <SelectItem value="authorization">Authorization</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox ({messagesData.filter(m => m.status === 'unread').length})</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasksData.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        {/* Messages Inbox */}
        <TabsContent value="inbox" className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${message.status === 'unread' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(message.from)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getFromTypeIcon(message.fromType)}
                          <span className="font-medium">{message.from}</span>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          {message.status === 'unread' && (
                            <Badge className="bg-blue-100 text-blue-800">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {format(new Date(message.timestamp), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{message.content}</p>
                      {message.relatedAccount && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Related Account:</span>
                          <Badge variant="outline">{message.relatedAccount}</Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {message.replies.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowReplyModal(true);
                            }}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{tasksData.filter(t => t.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold">{tasksData.filter(t => t.status === 'in-progress').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{tasksData.filter(t => t.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold">{tasksData.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Table */}
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Related Account</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={task.status === 'completed'}
                            onCheckedChange={() => handleToggleComplete(task.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(task.category)}
                              <span className="font-medium">{task.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                            <div className="flex items-center space-x-2">
                              {task.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">{task.relatedAccount}</Badge>
                            <div className="text-xs text-gray-500">{task.relatedClient}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sent Messages Tab */}
        <TabsContent value="sent">
          <Card>
            <CardContent className="text-center py-12">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sent Messages</h3>
              <p className="text-gray-500">Your sent messages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archived Tab */}
        <TabsContent value="archived">
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Archived Messages</h3>
              <p className="text-gray-500">Archived messages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to: {selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Replying to {selectedMessage?.from}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply}>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compose Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Send a new message to clients, banks, or team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">John Matthews (Client)</SelectItem>
                  <SelectItem value="bank1">BOS (Bank of Singapore)</SelectItem>
                  <SelectItem value="team1">Sarah Chen (Team)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Enter subject" />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Type your message..." rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompose}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a task and assign it to a team member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter task title" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter task description" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assign To</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
            </div>
            <div>
              <label className="text-sm font-medium">Related Account (Optional)</label>
              <Input placeholder="Account number or search" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTaskModal(false)}>
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

export default Messages;
