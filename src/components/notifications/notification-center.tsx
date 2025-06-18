import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { notificationService } from '../../services/notifications';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeToNotifications((notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleDelete = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleDeleteAll = async () => {
    await notificationService.deleteAllNotifications();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h4 className="text-sm font-medium">Notifications</h4>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <DropdownMenuItem className="flex flex-col items-start p-4">
      <div className="flex w-full items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.body}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex space-x-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DropdownMenuItem>
  );
} 