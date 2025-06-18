
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import SimpleProtectedRoute from '@/components/SimpleProtectedRoute';
import MainLayout from '@/components/MainLayout';
import SimpleAuthPage from '@/pages/SimpleAuthPage';
import Dashboard from '@/pages/Dashboard';
import ClientManagement from '@/pages/ClientManagement';
import Accounts from '@/pages/Accounts';
import Trades from '@/pages/Trades';
import Messages from '@/pages/Messages';
import FeeReports from '@/pages/FeeReports';
import DocumentVault from '@/pages/DocumentVault';
import News from '@/pages/News';
import ComplianceDashboard from '@/pages/ComplianceDashboard';
import Settings from '@/pages/Settings';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';

function App() {
  return (
    <SimpleAuthProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<SimpleAuthPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/clients" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <ClientManagement />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/accounts" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <Accounts />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/trades" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <Trades />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <Messages />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              {/* Redirect /tasks to /messages since tasks are now integrated */}
              <Route path="/tasks" element={<Navigate to="/messages" replace />} />
              
              <Route path="/fees" element={
                <SimpleProtectedRoute requiredRole="admin">
                  <MainLayout>
                    <FeeReports />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/documents" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <DocumentVault />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/news" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <News />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/compliance" element={
                <SimpleProtectedRoute requiredRole="admin">
                  <MainLayout>
                    <ComplianceDashboard />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <SimpleProtectedRoute requiredRole="admin">
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <SimpleProtectedRoute>
                  <MainLayout>
                    <UserProfile />
                  </MainLayout>
                </SimpleProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </SettingsProvider>
    </SimpleAuthProvider>
  );
}

export default App;
