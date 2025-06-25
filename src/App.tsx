
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AccountsProvider } from "@/contexts/AccountsContext";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import MainLayout from "@/components/MainLayout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import AccountsRedesigned from "@/pages/AccountsRedesigned";
import AccountDetails from "@/pages/AccountDetails";
import ClientManagement from "@/pages/ClientManagement";
import Trades from "@/pages/Trades";
import DocumentVault from "@/pages/DocumentVault";
import FeeReports from "@/pages/FeeReports";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import Messages from "@/pages/Messages";
import Training from "@/pages/Training";
import ComplianceDashboard from "@/pages/ComplianceDashboard";
import SimpleAuthPage from "@/pages/SimpleAuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimpleAuthProvider>
        <SettingsProvider>
          <AccountsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<SimpleAuthPage />} />
                <Route
                  path="/*"
                  element={
                    <SimpleProtectedRoute>
                      <MainLayout>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/accounts" element={<Accounts />} />
                          <Route path="/accounts-redesigned" element={<AccountsRedesigned />} />
                          <Route path="/accounts/:accountId" element={<AccountDetails />} />
                          <Route path="/clients" element={<ClientManagement />} />
                          <Route path="/trades" element={<Trades />} />
                          <Route path="/documents" element={<DocumentVault />} />
                          <Route path="/fees" element={<FeeReports />} />
                          <Route path="/messages" element={<Messages />} />
                          <Route path="/training" element={<Training />} />
                          <Route path="/compliance" element={<ComplianceDashboard />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/profile" element={<UserProfile />} />
                        </Routes>
                      </MainLayout>
                    </SimpleProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </AccountsProvider>
        </SettingsProvider>
      </SimpleAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
