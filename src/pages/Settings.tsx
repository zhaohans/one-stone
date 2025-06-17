
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Building2, 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  Settings as SettingsIcon, 
  Shield, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

// Mock data
const users = [
  { id: 1, name: 'K. Shen', email: 'k.shen@onestone.com', role: 'Relationship Manager', status: 'Active', lastLogin: '2024-06-16 09:15' },
  { id: 2, name: 'M. Johnson', email: 'm.johnson@onestone.com', role: 'Compliance Officer', status: 'Active', lastLogin: '2024-06-16 08:30' },
  { id: 3, name: 'S. Williams', email: 's.williams@onestone.com', role: 'Portfolio Manager', status: 'Inactive', lastLogin: '2024-06-10 14:22' },
];

const roles = [
  { id: 1, name: 'Relationship Manager', permissions: 12, users: 8 },
  { id: 2, name: 'Compliance Officer', permissions: 15, users: 3 },
  { id: 3, name: 'Portfolio Manager', permissions: 10, users: 5 },
  { id: 4, name: 'Administrator', permissions: 20, users: 2 },
];

const banks = [
  { id: 1, name: 'UBS Switzerland AG', type: 'Custodian', code: 'UBSW', status: 'Active', contact: 'ops@ubs.ch' },
  { id: 2, name: 'Credit Suisse', type: 'Bank', code: 'CSGN', status: 'Active', contact: 'support@credit-suisse.com' },
  { id: 3, name: 'Julius Baer', type: 'Custodian', code: 'JUUS', status: 'Inactive', contact: 'custody@juliusbaer.com' },
];

const feeTemplates = [
  { id: 1, name: 'Standard Management Fee', type: 'Management', formula: '1.5% p.a.', rate: '1.50%', status: 'Active', lastUpdated: '2024-05-15' },
  { id: 2, name: 'Retrocession Basic', type: 'Retrocession', formula: '0.75% trailing', rate: '0.75%', status: 'Active', lastUpdated: '2024-06-01' },
  { id: 3, name: 'Performance Fee Tier', type: 'Performance', formula: '20% above HWM', rate: '20.00%', status: 'Draft', lastUpdated: '2024-06-10' },
];

const auditLogs = [
  { id: 1, timestamp: '2024-06-16 10:30:15', user: 'K. Shen', action: 'User Created', module: 'User Management', detail: 'Created user: M. Johnson', status: 'Success', ip: '192.168.1.15' },
  { id: 2, timestamp: '2024-06-16 09:45:20', user: 'Admin', action: 'Role Modified', module: 'Role Management', detail: 'Updated permissions for: Compliance Officer', status: 'Success', ip: '192.168.1.10' },
  { id: 3, timestamp: '2024-06-16 08:15:10', user: 'S. Williams', action: 'Login Failed', module: 'Authentication', detail: 'Invalid password attempt', status: 'Failure', ip: '192.168.1.25' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const companyForm = useForm({
    defaultValues: {
      companyName: 'One Stone Capital',
      legalAddress: 'Bahnhofstrasse 12, 8001 Zurich, Switzerland',
      registrationNumber: 'CHE-123.456.789',
      primaryEmail: 'info@onestone.com',
      primaryPhone: '+41 44 123 4567',
      website: 'www.onestone.com',
      disclaimer: 'This document is confidential and proprietary...'
    }
  });

  const userForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '',
      tempPassword: '',
      expiryDate: ''
    }
  });

  const handleCompanyInfoSave = (data: any) => {
    console.log('Company info updated:', data);
    toast({
      title: "Success",
      description: "Company information updated successfully.",
    });
  };

  const handleAddUser = (data: any) => {
    console.log('Adding user:', data);
    setShowAddUserModal(false);
    toast({
      title: "User Added",
      description: `Invitation sent to ${data.email}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage company settings, users, and system configuration</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="banks" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Banks
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Fee Templates
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company details and regulatory information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(handleCompanyInfoSave)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={companyForm.control}
                    name="legalAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={companyForm.control}
                      name="primaryEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="primaryPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={companyForm.control}
                    name="disclaimer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Disclaimer</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormDescription>This text will appear on exported documents</FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-4">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users">
          <div className="space-y-6">
            {/* User Management Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and access levels</CardDescription>
                  </div>
                  <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Send an invitation to a new user</DialogDescription>
                      </DialogHeader>
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(handleAddUser)} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={userForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={userForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Select role..." />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowAddUserModal(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Send Invitation</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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

            {/* Role Management Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>Configure roles and permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Assigned Users</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.permissions} permissions</TableCell>
                        <TableCell>{role.users} users</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banks & Custodians Tab */}
        <TabsContent value="banks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Banks & Custodians</CardTitle>
                  <CardDescription>Manage master data for banks and custodians</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank/Custodian
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Main Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell className="font-medium">{bank.name}</TableCell>
                      <TableCell>{bank.type}</TableCell>
                      <TableCell>{bank.code}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bank.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {bank.status}
                        </span>
                      </TableCell>
                      <TableCell>{bank.contact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
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

        {/* Fee Templates Tab */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fee Templates & Rate Plans</CardTitle>
                  <CardDescription>Configure fee calculation templates and rate structures</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Formula</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.type}</TableCell>
                      <TableCell>{template.formula}</TableCell>
                      <TableCell>{template.rate}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          template.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {template.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{template.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
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

        {/* Print & Export Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Print & Export Templates</CardTitle>
                  <CardDescription>Manage document templates for reports and exports</CardDescription>
                </div>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No templates uploaded</h3>
                <p className="text-sm">Upload custom templates for fee reports, client statements, and other documents.</p>
                <Button className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure date, time, and currency formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Input defaultValue="DD/MM/YYYY" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Format</label>
                  <Input defaultValue="24-hour" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Currency</label>
                  <Input defaultValue="CHF" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Input defaultValue="English" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Notifications</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In-App Notifications</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMS Notifications</span>
                  <Button variant="outline" size="sm">Disable</Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-logout after</label>
                  <Input defaultValue="4 hours" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password strength requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Length</label>
                  <Input defaultValue="8" type="number" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Require Uppercase</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Require Numbers</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Require Special Characters</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Enhance security with 2FA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enforce 2FA for all users</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Allow SMS 2FA</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Allow App-based 2FA</span>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Emergency Lockout</span>
                  <Button variant="destructive" size="sm">Activate</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Audit Log</CardTitle>
                  <CardDescription>Complete audit trail of all system activities</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-mono">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.module}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.detail}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'Success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-sm text-gray-500 text-center">
                All critical changes are logged for compliance and audit purposes.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
