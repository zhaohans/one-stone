
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import ClientManagement from "./pages/ClientManagement";
import FeeRetrocession from "./pages/FeeRetrocession";
import DocumentVault from "./pages/DocumentVault";
import ComplianceDashboard from "./pages/ComplianceDashboard";
import NotFound from "./pages/NotFound";
import AccountsPage from "./pages/AccountsPage";
import TradesPage from "./pages/TradesPage";
import Messages from "./pages/Messages";
import Tasks from "./pages/Tasks";
import News from "./pages/News";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Authentication routes */}
                <Route path="/auth/*" element={<AuthPage />} />
                
                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected application routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserProfile />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/clients" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ClientManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/accounts" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AccountsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/trades" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TradesPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Tasks />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/fees" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <FeeRetrocession />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DocumentVault />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/news" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <News />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin-only routes */}
                <Route path="/compliance" element={
                  <ProtectedRoute requiredRole="admin">
                    <MainLayout>
                      <ComplianceDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
