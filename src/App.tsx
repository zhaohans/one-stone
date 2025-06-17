
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
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
import News from "./pages/News";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle login page redirect logic
const LoginWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LoginForm />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
