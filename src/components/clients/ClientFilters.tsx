
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, List, Grid3X3 } from 'lucide-react';

interface ClientFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
}

const ClientFilters = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  viewMode,
  setViewMode
}: ClientFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name, email, RM, tag, or KYC status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">RM</label>
                <select className="w-full mt-1 p-2 border rounded-md text-sm">
                  <option>All RMs</option>
                  <option>K. Shen</option>
                  <option>A. Wong</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select className="w-full mt-1 p-2 border rounded-md text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Prospect</option>
                  <option>Archived</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">KYC Status</label>
                <select className="w-full mt-1 p-2 border rounded-md text-sm">
                  <option>All KYC</option>
                  <option>Approved</option>
                  <option>In Progress</option>
                  <option>Not Started</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <select className="w-full mt-1 p-2 border rounded-md text-sm">
                  <option>All Countries</option>
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>Hong Kong</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">From Date</label>
                <Input type="date" className="text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To Date</label>
                <Input type="date" className="text-sm" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFilters;
