
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import SimpleProtectedRoute from '@/components/SimpleProtectedRoute';
import SimpleAuthPage from '@/pages/SimpleAuthPage';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import UserProfile from '@/pages/UserProfile';
import UserManagement from '@/components/UserManagement';
import ClientManagement from '@/pages/ClientManagement';
import Accounts from '@/pages/Accounts';
import Trades from '@/pages/Trades';
import Messages from '@/pages/Messages';
import Tasks from '@/pages/Tasks';
import News from '@/pages/News';
import DocumentVault from '@/pages/DocumentVault';
import FeeReports from '@/pages/FeeReports';
import FeeRetrocession from '@/pages/FeeRetrocession';
import ComplianceDashboard from '@/pages/ComplianceDashboard';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Auth routes */}
              <Route path="/auth/*" element={<SimpleAuthPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <SimpleProtectedRoute>
                    <Dashboard />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <SimpleProtectedRoute>
                    <Settings />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <SimpleProtectedRoute>
                    <UserProfile />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/user-management"
                element={
                  <SimpleProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <SimpleProtectedRoute>
                    <ClientManagement />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <SimpleProtectedRoute>
                    <Accounts />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/trades"
                element={
                  <SimpleProtectedRoute>
                    <Trades />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <SimpleProtectedRoute>
                    <Messages />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <SimpleProtectedRoute>
                    <Tasks />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <SimpleProtectedRoute>
                    <News />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <SimpleProtectedRoute>
                    <DocumentVault />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/fee-reports"
                element={
                  <SimpleProtectedRoute>
                    <FeeReports />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/fee-retrocession"
                element={
                  <SimpleProtectedRoute>
                    <FeeRetrocession />
                  </SimpleProtectedRoute>
                }
              />
              <Route
                path="/compliance"
                element={
                  <SimpleProtectedRoute requiredRole="admin">
                    <ComplianceDashboard />
                  </SimpleProtectedRoute>
                }
              />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
