
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Plus,
  MessageSquare,
  Send,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Clock,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for messages
const messages = [
  {
    id: 'MSG-001',
    subject: 'KYC Review Completed - Acme Corp',
    content: 'The KYC review for Acme Corp has been completed and approved. All documents are in order.',
    sender: 'Sarah Johnson',
    recipient: 'Mike Chen',
    messageType: 'internal',
    priority: 'normal',
    status: 'unread',
    createdAt: '2024-07-15T10:30:00Z',
    clientId: 'CLIENT-001'
  },
  {
    id: 'MSG-002',
    subject: 'Urgent: Document Missing for Tech Solutions',
    content: 'We are missing a signed compliance document for Tech Solutions. Please follow up with the client.',
    sender: 'David Wilson',
    recipient: 'Sarah Johnson',
    messageType: 'internal',
    priority: 'high',
    status: 'read',
    createdAt: '2024-07-14T14:20:00Z',
    clientId: 'CLIENT-002'
  },
  {
    id: 'MSG-003',
    subject: 'Client Meeting Follow-up',
    content: 'Following up on our meeting with Global Investments. They have agreed to the new fee structure.',
    sender: 'Mike Chen',
    recipient: 'All Team',
    messageType: 'internal',
    priority: 'normal',
    status: 'read',
    createdAt: '2024-07-12T09:15:00Z',
    clientId: 'CLIENT-003'
  }
];

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'normal',
    messageType: 'internal'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-gray-100 text-gray-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || message.messageType === typeFilter;
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSendMessage = () => {
    console.log('Sending message:', newMessage);
    setShowComposeDialog(false);
    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      priority: 'normal',
      messageType: 'internal'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Internal messaging and communication</p>
        </div>
        <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
              <DialogDescription>
                Send a message to team members or create client communications.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient
                  </label>
                  <Input
                    placeholder="Enter recipient name or email"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <Select value={newMessage.priority} onValueChange={(value) => setNewMessage({ ...newMessage, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  placeholder="Enter message subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={6}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Badge variant="outline">{filteredMessages.length}</Badge>
              </div>
              <CardDescription>
                Your conversations and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50",
                      selectedMessage?.id === message.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
                      message.status === 'unread' ? "font-medium" : ""
                    )}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(message.createdAt), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge className={cn("text-xs", getStatusColor(message.status))}>
                          {message.status}
                        </Badge>
                        {message.priority === 'high' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">{message.subject}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{message.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      From {selectedMessage.sender} • {format(new Date(selectedMessage.createdAt), 'MMMM dd, yyyy at HH:mm')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs", getPriorityColor(selectedMessage.priority))}>
                      {selectedMessage.priority} priority
                    </Badge>
                    <Badge className={cn("text-xs", getStatusColor(selectedMessage.status))}>
                      {selectedMessage.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Message Content */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <Button size="sm">
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Button size="sm" variant="outline">
                      <Star className="w-4 h-4 mr-2" />
                      Star
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  {/* Quick Reply */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Quick Reply
                    </label>
                    <Textarea placeholder="Type your reply..." rows={4} />
                    <div className="flex items-center justify-between">
                      <Select defaultValue="normal">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a message to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
