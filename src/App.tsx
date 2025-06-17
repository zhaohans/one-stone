
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
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

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm onLogin={() => setIsAuthenticated(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/fees" element={<FeeRetrocession />} />
              <Route path="/documents" element={<DocumentVault />} />
              <Route path="/news" element={<News />} />
              <Route path="/compliance" element={<ComplianceDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
