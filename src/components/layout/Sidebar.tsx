
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  FileText,
  Shield,
  MessageSquare,
  CheckSquare,
  Newspaper,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole?: string;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: Users,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Accounts',
    href: '/accounts',
    icon: Building2,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Trades',
    href: '/trades',
    icon: TrendingUp,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Fees',
    href: '/fees',
    icon: FileText,
    roles: ['admin', 'rm']
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'News',
    href: '/news',
    icon: Newspaper,
    roles: ['admin', 'rm', 'user']
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
    roles: ['admin']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin']
  }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole = 'user' }: SidebarProps) => {
  const location = useLocation();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">OS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EAM</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActivePath(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
