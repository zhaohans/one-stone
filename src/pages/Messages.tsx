
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  CheckSquare, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import StatusBadge from '@/components/messages/StatusBadge';
import PriorityBadge from '@/components/messages/PriorityBadge';

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('messages');

  // Mock data for messages
  const messages = [
    {
      id: 1,
      type: 'client_inquiry',
      subject: 'Portfolio Performance Review',
      from: 'John Smith',
      preview: 'Could you please provide an update on my portfolio performance for Q4?',
      timestamp: '2 hours ago',
      status: 'unread',
      priority: 'medium',
      client: 'SMITH001',
      account: 'ACC-789'
    },
    {
      id: 2,
      type: 'internal',
      subject: 'Trade Settlement Issue',
      from: 'Sarah Chen',
      preview: 'There seems to be a delay in the settlement for trade TRD-12345...',
      timestamp: '4 hours ago',
      status: 'read',
      priority: 'high',
      client: null,
      account: null
    },
    {
      id: 3,
      type: 'system',
      subject: 'Daily Risk Report',
      from: 'System',
      preview: 'Daily risk metrics report is now available for review.',
      timestamp: '1 day ago',
      status: 'read',
      priority: 'low',
      client: null,
      account: null
    }
  ];

  // Mock data for tasks
  const tasks = [
    {
      id: 1,
      title: 'Complete KYC Review for New Client',
      description: 'Review and approve KYC documentation for client WILSON001',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      client: 'WILSON001',
      tags: ['KYC', 'Onboarding']
    },
    {
      id: 2,
      title: 'Quarterly Portfolio Rebalancing',
      description: 'Rebalance portfolios according to new allocation targets',
      assignee: 'Sarah Chen',
      dueDate: '2024-01-20',
      status: 'in-progress',
      priority: 'medium',
      client: 'SMITH001',
      tags: ['Portfolio', 'Rebalancing']
    },
    {
      id: 3,
      title: 'Compliance Documentation Update',
      description: 'Update compliance procedures documentation for new regulations',
      assignee: 'David Lee',
      dueDate: '2024-01-10',
      status: 'overdue',
      priority: 'high',
      client: null,
      tags: ['Compliance', 'Documentation']
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages & Tasks</h1>
          <p className="text-gray-600 mt-1">Manage communications and workflow tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search messages and tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks ({tasks.length})
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {message.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{message.subject}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {message.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">From: {message.from}</span>
                        {message.client && (
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="w-3 h-3 mr-1" />
                            {message.client}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {message.preview}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <StatusBadge status={message.status} type="message" />
                        <PriorityBadge priority={message.priority} />
                        <Badge variant="secondary" className="text-xs">
                          {message.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={task.status} type="task" />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {task.dueDate}
                        </div>
                        {task.client && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {task.client}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
