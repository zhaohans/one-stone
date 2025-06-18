import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SimpleAuthContext';
import {
  Home, Users, Building2, TrendingUp, MessageSquare, Receipt, 
  FolderOpen, Newspaper, Shield, Settings,
  LogOut, User,
  GraduationCap, FileText
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const { userStatus, profile, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Building2, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Trades', path: '/trades' },
    { icon: MessageSquare, label: 'Messages & Tasks', path: '/messages' },
    { icon: Receipt, label: 'Fee Reports', path: '/fees', requireRole: 'admin' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
    { icon: Receipt, label: 'Invoice System', path: '/invoice-system' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Shield, label: 'Compliance', path: '/compliance', requireRole: 'admin',
      children: [
        { icon: GraduationCap, label: 'Training', path: '/compliance-training' },
        { icon: FileText, label: 'Policy Management', path: '/policy-management' }
      ]
    },
    { icon: Settings, label: 'Settings', path: '/settings', requireRole: 'admin' }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requireRole) {
      return userStatus?.role === item.requireRole;
    }
    return true;
  });

  const getUserDisplayName = () => {
    if (!profile) return 'User';
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (!profile) return 'U';
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
    }
    return profile.email?.[0]?.toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header - Logo only, no toggle button */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-center h-16">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">OSC</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-xl whitespace-nowrap">One Stone Capital</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">OSC</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            // Render sub-menu for Compliance
            if (item.label === 'Compliance' && item.children) {
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
                      "w-5 h-5 transition-colors shrink-0",
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                    {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                  {/* Sub-menu for Compliance */}
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <li key={sub.path}>
                          <Link
                            to={sub.path}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                              isSubActive
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <sub.icon className={cn(
                              "w-4 h-4 transition-colors shrink-0",
                              isSubActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                            )} />
                            {!collapsed && <span className="font-medium text-sm">{sub.label}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }
            // Render normal menu item
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
                    "w-5 h-5 transition-colors shrink-0",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                  )} />
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with Profile and Logout */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed ? (
          <div className="space-y-2">
            <Link 
              to="/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-medium">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link 
              to="/profile"
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {getUserInitials()}
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 p-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
