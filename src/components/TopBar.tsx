
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const TopBar = ({ searchQuery, onSearchChange, onSearchSubmit }: TopBarProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Empty space for future additions */}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <form onSubmit={onSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search clients, accounts, ISIN, trades..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 w-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 border-gray-200"
              maxLength={200}
              autoComplete="off"
            />
          </form>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              3
            </span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
          
          {/* Profile */}
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <User className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>

          {/* User Dropdown */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
