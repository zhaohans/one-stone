
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const TopBar = ({ searchQuery, onSearchChange, onSearchSubmit }: TopBarProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm h-16">
      <div className="flex items-center justify-between h-full">
        {/* Left side - Branding - Match sidebar header exactly */}
        <div className="flex items-center">
          <div className="hidden sm:block">
            <h1 className="font-bold text-gray-900 text-xl whitespace-nowrap">One Stone Capital</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Global Search */}
          <form onSubmit={onSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search clients, accounts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 w-48 sm:w-80 lg:w-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 border-gray-200"
              maxLength={200}
              autoComplete="off"
            />
          </form>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 hidden sm:flex">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              3
            </span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100 hidden sm:flex">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Dropdown */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
