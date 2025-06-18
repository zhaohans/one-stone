
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import SimpleProtectedRoute from "./components/SimpleProtectedRoute";
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
          <SimpleAuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Authentication routes */}
                <Route path="/auth/*" element={<SimpleAuthPage />} />
                
                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected application routes */}
                <Route path="/dashboard" element={
                  <SimpleProtectedRoute>
                    <MainLayout>
                      <Dashboard />
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
                      <AccountsPage />
                    </MainLayout>
                  </SimpleProtectedRoute>
                } />
                
                <Route path="/trades" element={
                  <SimpleProtectedRoute>
                    <MainLayout>
                      <TradesPage />
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

                <Route path="/tasks" element={
                  <SimpleProtectedRoute>
                    <MainLayout>
                      <Tasks />
                    </MainLayout>
                  </SimpleProtectedRoute>
                } />
                
                <Route path="/fees" element={
                  <SimpleProtectedRoute>
                    <MainLayout>
                      <FeeRetrocession />
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
                
                {/* Admin-only routes */}
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
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SimpleAuthProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
