
import React, { useState } from 'react';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    console.log('Search performed:', searchQuery);
    toast.info(`Searching for: ${searchQuery}`);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={handleToggleSidebar} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`md:hidden fixed inset-0 z-50 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarCollapsed(true)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white">
          <Sidebar 
            collapsed={false} 
            onToggleCollapse={() => setSidebarCollapsed(true)} 
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <TopBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
