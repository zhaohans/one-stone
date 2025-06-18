import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SimpleAuthProvider, useAuth } from '@/contexts/SimpleAuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import SimpleProtectedRoute from '@/components/SimpleProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { AccountsProvider } from './contexts/AccountsContext';
import { ClientsProvider } from './contexts/ClientsContext';

const SimpleAuthPage = React.lazy(() => import('@/pages/SimpleAuthPage'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const ClientManagement = React.lazy(() => import('@/pages/ClientManagement'));
const Accounts = React.lazy(() => import('@/pages/Accounts'));
const Trades = React.lazy(() => import('@/pages/Trades'));
const Messages = React.lazy(() => import('@/pages/Messages'));
const FeeReports = React.lazy(() => import('@/pages/FeeReports'));
const DocumentVault = React.lazy(() => import('@/pages/DocumentVault'));
const News = React.lazy(() => import('@/pages/News'));
const ComplianceDashboard = React.lazy(() => import('@/pages/ComplianceDashboard'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const UserProfile = React.lazy(() => import('@/pages/UserProfile'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Index = React.lazy(() => import('@/pages/Index'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const ComplianceTraining = React.lazy(() => import('@/pages/ComplianceTraining'));
const PolicyManagement = React.lazy(() => import('@/pages/PolicyManagement'));
const InvoiceSystem = React.lazy(() => import('@/pages/InvoiceSystem'));

function App() {
  const { isOnboarded } = useAuth();

  return (
    <AccountsProvider>
      <ClientsProvider>
        <SimpleAuthProvider>
          <SettingsProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-lg">Loading...</div>}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/*" element={<SimpleAuthPage />} />
                    
                    {/* Onboarding route - must be accessible if not onboarded */}
                    <Route path="/onboarding" element={<Onboarding />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <Dashboard />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/clients" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <ClientManagement />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/accounts" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <Accounts />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/trades" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <Trades />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/messages" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <Messages />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    {/* Redirect /tasks to /messages since tasks are now integrated */}
                    <Route path="/tasks" element={<Navigate to="/messages" replace />} />
                    
                    <Route path="/fees" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute requiredRole="admin">
                          <MainLayout>
                            <FeeReports />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/documents" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <DocumentVault />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/news" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <News />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/compliance" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute requiredRole="admin">
                          <MainLayout>
                            <ComplianceDashboard />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/settings" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute requiredRole="admin">
                          <MainLayout>
                            <Settings />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/profile" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <UserProfile />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/compliance-training" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <ComplianceTraining />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/policy-management" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <PolicyManagement />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    <Route path="/invoice-system" element={
                      !isOnboarded ? (
                        <Navigate to="/onboarding" replace />
                      ) : (
                        <SimpleProtectedRoute>
                          <MainLayout>
                            <InvoiceSystem />
                          </MainLayout>
                        </SimpleProtectedRoute>
                      )
                    } />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </Router>
          </SettingsProvider>
        </SimpleAuthProvider>
      </ClientsProvider>
    </AccountsProvider>
  );
}

export default App;
