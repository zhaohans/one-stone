
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
  User
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  subject: string;
  from: string;
  fromType: 'client' | 'bank' | 'team';
  to: string[];
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  priority: 'high' | 'medium' | 'low';
  category: string;
  relatedAccount?: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  from: string;
  content: string;
  timestamp: string;
}

const Messages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });

  // Mock messages data
  const messagesData: Message[] = [
    {
      id: '1',
      subject: 'Authorization Update Required - BOS Account',
      from: 'Sarah Chen',
      fromType: 'team',
      to: ['Current User'],
      content: 'Please review and update the authorization matrix for John Matthews\' BOS account. The current signatory requires formal relationship documentation.',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'unread',
      priority: 'high',
      category: 'authorization',
      relatedAccount: 'ACC-2024-001',
      replies: [
        {
          id: '1-1',
          from: 'Current User',
          content: 'I\'ll review the documentation and update the matrix by end of day.',
          timestamp: '2024-01-15T11:00:00Z'
        }
      ]
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
        },
        {
          id: '2-2',
          from: 'Tech Solutions Pte Ltd',
          content: 'Wednesday 2 PM SGT works perfectly. Looking forward to the discussion.',
          timestamp: '2024-01-14T16:30:00Z'
        }
      ]
    },
    {
      id: '3',
      subject: 'Document Upload Confirmation - LGT Bank',
      from: 'LGT Bank',
      fromType: 'bank',
      to: ['David Tan', 'Current User'],
      content: 'We have received and processed the updated signatory documents for the retirement portfolio.',
      timestamp: '2024-01-13T09:15:00Z',
      status: 'read',
      priority: 'low',
      category: 'documentation',
      relatedAccount: 'ACC-2024-003',
      replies: []
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

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Reply Sent",
      description: "Your message has been sent successfully",
    });
    setReplyText('');
    setShowReplyModal(false);
  };

  const handleCompose = () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setShowComposeModal(false);
    setComposeForm({ to: '', subject: '', message: '', priority: 'medium', category: 'general' });
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });
  };

  const openThreadView = (message: Message) => {
    setSelectedMessage(message);
    setShowThreadModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with clients, banks, and team members</p>
        </div>
        <Button onClick={() => setShowComposeModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Compose Message
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
                  placeholder="Search messages..."
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
                <SelectItem value="client">Client Messages</SelectItem>
                <SelectItem value="bank">Bank Messages</SelectItem>
                <SelectItem value="authorization">Authorization</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox">
            Inbox ({messagesData.filter(m => m.status === 'unread').length})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

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
              <Card 
                key={message.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  message.status === 'unread' ? 'border-blue-200 bg-blue-50/30' : ''
                }`}
                onClick={() => openThreadView(message)}
              >
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
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                          <span>Related Account:</span>
                          <Badge variant="outline">{message.relatedAccount}</Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {message.replies.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
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
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardContent className="text-center py-12">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sent Messages</h3>
              <p className="text-gray-500">Your sent messages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

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

      {/* Thread View Modal */}
      <Dialog open={showThreadModal} onOpenChange={setShowThreadModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{selectedMessage?.subject}</span>
            </DialogTitle>
            <DialogDescription>
              Conversation thread with {selectedMessage?.from}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Original message */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(selectedMessage.from)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-sm">{selectedMessage.from}</span>
                    <div className="text-xs text-gray-500">
                      {format(new Date(selectedMessage.timestamp), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
                <p className="text-sm">{selectedMessage.content}</p>
              </div>
              
              {/* Replies */}
              {selectedMessage.replies.map((reply) => (
                <div key={reply.id} className="border rounded-lg p-4 ml-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(reply.from)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-sm">{reply.from}</span>
                      <div className="text-xs text-gray-500">
                        {format(new Date(reply.timestamp), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{reply.content}</p>
                </div>
              ))}
              
              {/* Quick reply */}
              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSendReply} size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <label className="text-sm font-medium">To *</label>
              <Select value={composeForm.to} onValueChange={(value) => setComposeForm(prev => ({ ...prev, to: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">John Matthews (Client)</SelectItem>
                  <SelectItem value="bank1">BOS (Bank of Singapore)</SelectItem>
                  <SelectItem value="bank2">LGT Bank</SelectItem>
                  <SelectItem value="team1">Sarah Chen (Team)</SelectItem>
                  <SelectItem value="team2">Michael Wong (Team)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={composeForm.priority} onValueChange={(value) => setComposeForm(prev => ({ ...prev, priority: value }))}>
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
                <Select value={composeForm.category} onValueChange={(value) => setComposeForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Subject *</label>
              <Input 
                placeholder="Enter subject" 
                value={composeForm.subject}
                onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message *</label>
              <Textarea 
                placeholder="Type your message..." 
                rows={6} 
                value={composeForm.message}
                onChange={(e) => setComposeForm(prev => ({ ...prev, message: e.target.value }))}
              />
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
    </div>
  );
};

export default Messages;
