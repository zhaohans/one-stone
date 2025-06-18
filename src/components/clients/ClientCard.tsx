
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Edit,
  Archive,
  Trash,
  MoreHorizontal,
  Mail,
  User,
  Building2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  rm: string;
  status: string;
  kycStatus: string;
  onboardedDate: string;
  country: string;
  countryFlag: string;
  tags: string[];
  accountsCount: number;
  aum: string;
  avatar: string;
  riskProfile: string;
  sourceOfWealth: string;
  address: string;
}

interface ClientCardProps {
  client: Client;
  isSelected: boolean;
  onSelect: (clientId: string) => void;
  onViewDetails: (client: Client) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Prospect': return 'bg-blue-100 text-blue-800';
    case 'Archived': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getKycStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Not Started': return 'bg-red-100 text-red-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ClientCard = ({ client, isSelected, onSelect, onViewDetails }: ClientCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(client.id)}
            className="rounded mt-1"
          />
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {client.type === 'Individual' ? 
                  <User className="w-4 h-4 text-gray-500" /> : 
                  <Building2 className="w-4 h-4 text-gray-500" />
                }
                <button 
                  className="font-medium text-blue-600 hover:text-blue-800"
                  onClick={() => onViewDetails(client)}
                >
                  {client.name}
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {format(new Date(client.onboardedDate), 'MMM d')}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">{client.email}</div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
              <Badge className={getKycStatusColor(client.kycStatus)}>{client.kycStatus}</Badge>
              <span className="text-sm">{client.countryFlag} {client.country}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {client.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{client.tags.length - 2}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                RM: {client.rm} • {client.accountsCount} accounts
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">${client.aum}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onViewDetails(client)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send KYC Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
