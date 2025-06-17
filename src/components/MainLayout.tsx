import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings, User, ChevronLeft, ChevronRight, Users, FileText, Shield, FolderOpen, DollarSign, Home, Building2, TrendingUp, Receipt, Newspaper, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { searchSchema } from '@/lib/validation';
import { validateAndSanitize, generateCSRFToken } from '@/lib/security';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Building2, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Trades', path: '/trades' },
    { icon: Receipt, label: 'Fee Reports', path: '/fees' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Shield, label: 'Compliance', path: '/compliance' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  // Security headers and CSRF token setup
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
    
    // Set security headers via meta tags
    const setSecurityHeaders = () => {
      // Enhanced Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://ufjzxhohsvuxxyajvzma.supabase.co; frame-ancestors 'none';";
      
      // Remove existing CSP if present
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingCSP) {
        document.head.removeChild(existingCSP);
      }
      document.head.appendChild(cspMeta);

      // X-Frame-Options
      let frameMeta = document.querySelector('meta[http-equiv="X-Frame-Options"]');
      if (!frameMeta) {
        frameMeta = document.createElement('meta');
        frameMeta.setAttribute('http-equiv', 'X-Frame-Options');
        frameMeta.setAttribute('content', 'DENY');
        document.head.appendChild(frameMeta);
      }

      // X-Content-Type-Options
      let typeMeta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
      if (!typeMeta) {
        typeMeta = document.createElement('meta');
        typeMeta.setAttribute('http-equiv', 'X-Content-Type-Options');
        typeMeta.setAttribute('content', 'nosniff');
        document.head.appendChild(typeMeta);
      }

      // Referrer Policy
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
      
      // Log search without sensitive data
      console.log('Search performed');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex">
      {/* Hidden CSRF token for forms */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Sidebar with vibrant styling */}
      <div className={cn(
        "bg-white border-r border-orange-200 flex flex-col transition-all duration-300 shadow-lg",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header with logo */}
        <div className="p-4 border-b border-orange-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg logo-pulse relative overflow-hidden">
                <img 
                  src="/lovable-uploads/4e7c829c-3064-46fd-82e5-5e44ed5b6be6.png" 
                  alt="One Stone Capital Logo" 
                  className="w-8 h-8 object-contain filter brightness-0 invert"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform rotate-45 translate-x-full hover:translate-x-[-100%] transition-transform duration-1000"></div>
              </div>
              <div>
                <span className="font-bold text-gray-800 text-lg">One Stone</span>
                <div className="text-sm text-orange-600 font-medium">Capital</div>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center shadow-md logo-pulse">
              <img 
                src="/lovable-uploads/4e7c829c-3064-46fd-82e5-5e44ed5b6be6.png" 
                alt="One Stone Capital Logo" 
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-orange-500 hover:text-orange-700 hover:bg-orange-100"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation with enhanced styling */}
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
                        ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-r-2 border-orange-500 shadow-sm"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-orange-600" : "text-gray-500 group-hover:text-orange-600"
                    )} />
                    {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile with enhanced styling */}
        <div className="p-4 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <Link to="/profile" className="flex items-center space-x-3 mb-3 p-2 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                <p className="text-xs text-orange-600">{user?.position || 'Team Member'}</p>
              </div>
            )}
          </Link>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-orange-700 hover:bg-orange-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with enhanced styling */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-orange-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Global Search with enhanced styling */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search clients, accounts, ISIN, trades..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 pr-4 w-96 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50 border-orange-200 ${
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
              
              {/* Notifications with vibrant styling */}
              <Button variant="ghost" size="sm" className="relative hover:bg-orange-100">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-md">
                  3
                </span>
              </Button>
              
              {/* Settings */}
              <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                <Settings className="w-5 h-5 text-orange-600" />
              </Button>
              
              {/* Profile */}
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                  <User className="w-5 h-5 text-orange-600" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
