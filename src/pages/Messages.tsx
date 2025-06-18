
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, MessageSquare, FileText } from 'lucide-react';
import StatusBadge from '@/components/messages/StatusBadge';
import PriorityBadge from '@/components/messages/PriorityBadge';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified mock data
  const messages = [
    {
      id: '1',
      subject: 'Authorization Update Required - BOS Account',
      from: 'Sarah Chen',
      content: 'Please review and update the authorization matrix for John Matthews account.',
      status: 'unread',
      priority: 'high',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      subject: 'Monthly AUM Report Discussion',
      from: 'Tech Solutions Pte Ltd',
      content: 'We would like to schedule a meeting to discuss the latest AUM performance.',
      status: 'read',
      priority: 'medium',
      timestamp: '2024-01-14T15:45:00Z',
    }
  ];

  const tasks = [
    {
      id: '1',
      title: 'Update Authorization Matrix - BOS',
      description: 'Review and update signatory information for LI Jianmin',
      status: 'pending',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-01-20T00:00:00Z',
    },
    {
      id: '2',
      title: 'Prepare Monthly AUM Report',
      description: 'Generate comprehensive AUM report for Tech Solutions Pte Ltd',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Michael Wong',
      dueDate: '2024-01-25T00:00:00Z',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Tasks</h1>
          <p className="text-gray-600">Communicate with clients, banks, team members and manage tasks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Compose Message
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages and tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox ({messages.filter(m => m.status === 'unread').length})</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${message.status === 'unread' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{message.from}</span>
                      <PriorityBadge priority={message.priority} />
                      <StatusBadge status={message.status} type="message" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
                    <p className="text-gray-600 text-sm">{message.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{task.assignee}</span>
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} type="task" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sent Messages</h3>
              <p className="text-gray-500">Your sent messages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Archived Messages</h3>
              <p className="text-gray-500">Archived messages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
