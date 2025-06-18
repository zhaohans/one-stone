import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Camera, 
  Shield, 
  Key, 
  Download, 
  Eye, 
  EyeOff,
  LogOut,
  Info,
  Save,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import PasswordChangeModal from '@/components/PasswordChangeModal';
import TwoFactorSetup from '@/components/TwoFactorSetup';
import AuditLogTable from '@/components/AuditLogTable';

const UserProfile = () => {
  const { user, profile } = useAuth();
  
  // Form states
  const [profileData, setProfileData] = useState({
    avatar: '',
    gender: 'prefer-not-to-say',
    memberName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 'User',
    officeNo: profile?.office_number || 'OSC-001',
    officeAddress: '1 Raffles Place, #40-61, Singapore 048616',
    workEmail: user?.email || '',
    personalPhone: profile?.phone || '+65 9123 4567',
    department: profile?.department || 'management',
    position: profile?.position || 'director',
    supervisor: '',
    team: ['investment-team'],
    loginEmail: user?.email || '',
    linkedPhone: profile?.phone || '+65 9123 4567',
    accountStatus: profile?.status || 'active',
    loginDuration: '24',
    language: 'en',
    timezone: 'Asia/Singapore',
    emailNotifications: true,
    inAppNotifications: true,
    smsNotifications: false,
    theme: 'light',
    signature: ''
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [has2FA, setHas2FA] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile changes saved successfully');
      setIsEditing(false);
    }, 500);
  };

  const handleLogoutAllSessions = () => {
    toast.info('All sessions logged out successfully');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload
      toast.success('Profile photo updated');
    }
  };

  const downloadAuditLog = () => {
    toast.info('Audit log download started');
  };

  const maskEmail = (email: string) => {
    if (showEmail) return email;
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (showPhone) return phone;
    return phone.replace(/\d(?=\d{4})/g, '*');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile) return 'U';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          {isEditing && (
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Organization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="memberName">Member Name *</Label>
                    <Input
                      id="memberName"
                      value={profileData.memberName}
                      onChange={(e) => handleInputChange('memberName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="officeNo">Office No.</Label>
                    <Input
                      id="officeNo"
                      value={profileData.officeNo}
                      onChange={(e) => handleInputChange('officeNo', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="workEmail">Work Email *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="workEmail"
                        type="email"
                        value={showEmail ? profileData.workEmail : maskEmail(profileData.workEmail)}
                        onChange={(e) => handleInputChange('workEmail', e.target.value)}
                        required
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmail(!showEmail)}
                      >
                        {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="personalPhone">Personal Phone</Label>
                    <div className="flex gap-2">
                      <Input
                        id="personalPhone"
                        value={showPhone ? profileData.personalPhone : maskPhone(profileData.personalPhone)}
                        onChange={(e) => handleInputChange('personalPhone', e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPhone(!showPhone)}
                      >
                        {showPhone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <Textarea
                    id="officeAddress"
                    value={profileData.officeAddress}
                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Your role and department within One Stone Capital</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={profileData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="relationship-management">Relationship Management</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="position">Main Position</Label>
                    <Select value={profileData.position} onValueChange={(value) => handleInputChange('position', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="relationship-manager">Relationship Manager</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Select value={profileData.supervisor} onValueChange={(value) => handleInputChange('supervisor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe (Director)</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith (Manager)</SelectItem>
                        <SelectItem value="mike-chen">Mike Chen (Head of Operations)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="team">Team/Group</Label>
                    <Select value={profileData.team[0]} onValueChange={(value) => handleInputChange('team', [value])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investment-team">Investment Team</SelectItem>
                        <SelectItem value="client-services">Client Services</SelectItem>
                        <SelectItem value="operations-team">Operations Team</SelectItem>
                        <SelectItem value="compliance-team">Compliance Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account & Security
                </CardTitle>
                <CardDescription>Manage your login credentials and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loginEmail">Login Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="loginEmail"
                        type="email"
                        value={profileData.loginEmail}
                        onChange={(e) => handleInputChange('loginEmail', e.target.value)}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Changing login email requires email verification</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedPhone">Linked Phone</Label>
                    <Input
                      id="linkedPhone"
                      value={profileData.linkedPhone}
                      onChange={(e) => handleInputChange('linkedPhone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Account Status</Label>
                    <div className="mt-1">
                      <Badge variant={profileData.accountStatus === 'active' ? 'default' : 'secondary'}>
                        {profileData.accountStatus.charAt(0).toUpperCase() + profileData.accountStatus.slice(1)}
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Only admin can change account status</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="loginDuration">Login Duration (hours)</Label>
                    <div className="flex gap-2">
                      <Select value={profileData.loginDuration} onValueChange={(value) => handleInputChange('loginDuration', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="72">72 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Session auto-expires after selected time for security</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">
                        {has2FA ? 'Enabled - Your account is secured' : 'Disabled - Enable for stronger security'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={has2FA ? 'default' : 'destructive'}>
                        {has2FA ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button variant="outline" onClick={() => setShow2FAModal(true)}>
                        {has2FA ? 'Manage' : 'Setup'} 2FA
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-gray-600">You are logged in on 2 devices</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogoutAllSessions}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out All Sessions
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Last Login:</strong> Today at 2:30 PM from Singapore (IP: 203.116.43.77)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preferences & Activity */}
          <div className="space-y-6">
            {/* Personal Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={profileData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ms">Bahasa Melayu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Hong_Kong">Hong Kong (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">UI Theme</Label>
                  <Select value={profileData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Notifications</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch
                      id="emailNotifications"
                      checked={profileData.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                    <Switch
                      id="inAppNotifications"
                      checked={profileData.inAppNotifications}
                      onCheckedChange={(checked) => handleInputChange('inAppNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <Switch
                      id="smsNotifications"
                      checked={profileData.smsNotifications}
                      onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="signature">Custom Signature</Label>
                  <Textarea
                    id="signature"
                    placeholder="Your custom signature for messages..."
                    value={profileData.signature}
                    onChange={(e) => handleInputChange('signature', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Your current role permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Management View</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Client Management</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trade Execution</span>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Access</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Profile updated</span>
                    <span className="text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password changed</span>
                    <span className="text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Login from Singapore</span>
                    <span className="text-gray-500">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2FA enabled</span>
                    <span className="text-gray-500">1 week ago</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4" onClick={downloadAuditLog}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Audit Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <PasswordChangeModal 
          open={showPasswordModal} 
          onOpenChange={setShowPasswordModal} 
        />
        
        <TwoFactorSetup 
          open={show2FAModal} 
          onOpenChange={setShow2FAModal}
          isEnabled={has2FA}
          onToggle={setHas2FA}
        />
      </div>
    </TooltipProvider>
  );
};

export default UserProfile;
