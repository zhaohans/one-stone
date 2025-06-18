
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings, User, ChevronLeft, ChevronRight, Users, FileText, Shield, FolderOpen, DollarSign, Home, Building2, TrendingUp, Receipt, Newspaper, LogOut, MessageSquare, Clipboard, CheckSquare } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { searchSchema } from '@/lib/validation';
import { validateAndSanitize, generateCSRFToken } from '@/lib/security';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Enhanced menu items with all requested pages
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Building2, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Trades', path: '/trades' },
    { icon: Receipt, label: 'Fee Reports', path: '/fees' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Shield, label: 'Compliance', path: '/compliance' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Security headers and CSRF token setup
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
    
    const setSecurityHeaders = () => {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://ufjzxhohsvuxxyajvzma.supabase.co; frame-ancestors 'none';";
      
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingCSP) {
        document.head.removeChild(existingCSP);
      }
      document.head.appendChild(cspMeta);

      let frameMeta = document.querySelector('meta[http-equiv="X-Frame-Options"]');
      if (!frameMeta) {
        frameMeta = document.createElement('meta');
        frameMeta.setAttribute('http-equiv', 'X-Frame-Options');
        frameMeta.setAttribute('content', 'DENY');
        document.head.appendChild(frameMeta);
      }

      let typeMeta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
      if (!typeMeta) {
        typeMeta = document.createElement('meta');
        typeMeta.setAttribute('http-equiv', 'X-Content-Type-Options');
        typeMeta.setAttribute('content', 'nosniff');
        document.head.appendChild(typeMeta);
      }

      let referrerMeta = document.querySelector('meta[name="referrer"]');
      if (!referrerMeta) {
        referrerMeta = document.createElement('meta');
        referrerMeta.setAttribute('name', 'referrer');
        referrerMeta.setAttribute('content', 'strict-origin-when-cross-origin');
        document.head.appendChild(referrerMeta);
      }
    };
    
    setSecurityHeaders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csrfToken) {
      toast.error('Security error. Please refresh the page.');
      return;
    }
    
    try {
      const sanitizedQuery = validateAndSanitize.text(searchQuery, 200);
      const validated = searchSchema.parse({ query: sanitizedQuery });
      setSearchError('');
      
      // Enhanced search with entity-specific navigation
      if (validated.query.toLowerCase().includes('client')) {
        window.location.href = `/clients?search=${encodeURIComponent(validated.query)}`;
      } else if (validated.query.toLowerCase().includes('account')) {
        window.location.href = `/accounts?search=${encodeURIComponent(validated.query)}`;
      } else if (validated.query.toLowerCase().includes('trade')) {
        window.location.href = `/trades?search=${encodeURIComponent(validated.query)}`;
      } else {
        // Global search across all entities
        window.location.href = `/search?q=${encodeURIComponent(validated.query)}`;
      }
      
      toast.info(`Searching for: ${validated.query}`);
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || error.message || 'Invalid search query';
      setSearchError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.first_name || user.last_name) {
      return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchError) setSearchError('');
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    // Navigate to messages/notifications page
    window.location.href = '/messages?filter=unread';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Enhanced Sidebar with all navigation items */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">OSC</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">One Stone</span>
                <div className="text-xs text-gray-500 font-medium">Capital</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Enhanced Navigation with all requested pages */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                    {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Enhanced User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/profile" className="flex items-center space-x-3 mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500">{user?.position || 'Team Member'}</p>
              </div>
            )}
          </Link>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Enhanced Global Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search clients, accounts, ISIN, trades..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 pr-4 w-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 border-gray-200 ${
                    searchError ? 'border-red-500' : ''
                  }`}
                  maxLength={200}
                  autoComplete="off"
                />
                {searchError && (
                  <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-white px-2 py-1 rounded shadow border z-10">
                    {searchError}
                  </div>
                )}
              </form>
              
              {/* Enhanced Notifications with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Notifications</h4>
                    <div className="space-y-2">
                      <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <p className="text-sm font-medium">New client onboarding</p>
                        <p className="text-xs text-gray-500">John Matthews submitted KYC documents</p>
                      </div>
                      <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <p className="text-sm font-medium">Trade approval needed</p>
                        <p className="text-xs text-gray-500">$2.5M equity purchase pending</p>
                      </div>
                      <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <p className="text-sm font-medium">Compliance review due</p>
                        <p className="text-xs text-gray-500">Annual review for client C-1247</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-center"
                      onClick={handleNotificationClick}
                    >
                      View All Messages
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Settings */}
              <Button variant="ghost" size="sm" className="hover:bg-gray-100" asChild>
                <Link to="/settings">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Link>
              </Button>
              
              {/* Enhanced Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <User className="w-5 h-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
