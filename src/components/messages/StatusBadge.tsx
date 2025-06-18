
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'message' | 'task';
}

const StatusBadge = ({ status, type = 'message' }: StatusBadgeProps) => {
  const getStatusConfig = (status: string, type: string) => {
    if (type === 'task') {
      switch (status) {
        case 'completed': 
          return { 
            className: 'bg-green-100 text-green-800', 
            icon: <CheckCircle2 className="w-3 h-3" /> 
          };
        case 'in-progress': 
          return { 
            className: 'bg-blue-100 text-blue-800', 
            icon: <Clock className="w-3 h-3" /> 
          };
        case 'pending': 
          return { 
            className: 'bg-yellow-100 text-yellow-800', 
            icon: <Clock className="w-3 h-3" /> 
          };
        case 'overdue': 
          return { 
            className: 'bg-red-100 text-red-800', 
            icon: <AlertCircle className="w-3 h-3" /> 
          };
        default: 
          return { 
            className: 'bg-gray-100 text-gray-800', 
            icon: <Clock className="w-3 h-3" /> 
          };
      }
    } else {
      // Message status
      switch (status) {
        case 'unread': 
          return { 
            className: 'bg-blue-100 text-blue-800', 
            icon: null 
          };
        case 'read': 
          return { 
            className: 'bg-gray-100 text-gray-800', 
            icon: null 
          };
        default: 
          return { 
            className: 'bg-gray-100 text-gray-800', 
            icon: null 
          };
      }
    }
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge className={config.className}>
      <div className="flex items-center space-x-1">
        {config.icon}
        <span>{status}</span>
      </div>
    </Badge>
  );
};

export default StatusBadge;
