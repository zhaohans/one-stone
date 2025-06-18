
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SimpleAuthContext';
import {
  Home, Users, Building2, TrendingUp, MessageSquare, Receipt, 
  FolderOpen, Newspaper, Shield, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const { userStatus } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Building2, label: 'Accounts', path: '/accounts' },
    { icon: TrendingUp, label: 'Trades', path: '/trades' },
    { icon: MessageSquare, label: 'Messages & Tasks', path: '/messages' },
    { icon: Receipt, label: 'Fee Reports', path: '/fees', requireRole: 'admin' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Shield, label: 'Compliance', path: '/compliance', requireRole: 'admin' },
    { icon: Settings, label: 'Settings', path: '/settings', requireRole: 'admin' }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requireRole) {
      return userStatus?.role === item.requireRole;
    }
    return true;
  });

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
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
          onClick={onToggleCollapse}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
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
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
