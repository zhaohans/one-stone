import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Bell, Search, User, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useTheme } from '@/contexts/SettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { NotificationService } from '@/services/NotificationService';
import { Badge } from './ui/badge';

interface TopBarProps {
  onSearch?: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifs = await NotificationService.getNotifications();
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: any) => !n.read).length);
    };
    if (notifOpen) fetchNotifications();
  }, [notifOpen]);

  const markAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications((prev: any) => prev.map((n: any) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
  };

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
    <div className="flex items-center justify-between px-4 py-2 bg-background border-b">
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <Search size={18} />
        </Button>
      </form>
      <div className="flex items-center gap-4">
        <DropdownMenu onOpenChange={setNotifOpen} open={notifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative p-2">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : notifications.map((notif: any) => (
              <DropdownMenuItem key={notif.id} className={`flex flex-col items-start gap-1 ${notif.read ? '' : 'bg-blue-50'}`}
                onClick={() => markAsRead(notif.id)}>
                <div className="font-medium text-sm">{notif.title}</div>
                <div className="text-xs text-gray-500">{notif.body}</div>
                <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                {!notif.read && <Badge className="ml-auto mt-1" variant="secondary">New</Badge>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />
                ) : null}
                <AvatarFallback className="text-xs sm:text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-sm font-medium text-gray-900 max-w-24 truncate">
                {getUserDisplayName()}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
