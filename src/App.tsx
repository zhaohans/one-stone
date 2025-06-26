
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AccountsProvider } from "@/contexts/AccountsContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { ErrorBoundary } from "@/components/error-boundary";
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
import FeeManagement from "@/pages/FeeManagement";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import Messages from "@/pages/Messages";
import Training from "@/pages/Training";
import ComplianceDashboard from "@/pages/ComplianceDashboard";
import ComplianceTraining from "@/pages/ComplianceTraining";
import PolicyManagement from "@/pages/PolicyManagement";
import SimpleAuthPage from "@/pages/SimpleAuthPage";
import InvoiceSystem from "@/pages/InvoiceSystem";
import News from "@/pages/News";
import RFQOverview from "@/pages/trades/RFQOverview";
import RFQProcessing from "@/pages/trades/RFQProcessing";
import Lifecycle from "@/pages/trades/Lifecycle";
import NewOrder from "@/pages/trades/NewOrder";
import OrderOverview from "@/pages/trades/OrderOverview";
import OrderProcessing from "@/pages/trades/OrderProcessing";
import Flows from "@/pages/trades/Flows";
import ProductList from "@/pages/trades/ProductList";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleAuthProvider>
          <SettingsProvider>
            <AccountsProvider>
              <ClientsProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/auth/*" element={<SimpleAuthPage />} />
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
                              <Route path="/trades/products" element={<ProductList />} />
                              <Route path="/trades/rfq-overview" element={<RFQOverview />} />
                              <Route path="/trades/rfq-processing" element={<RFQProcessing />} />
                              <Route path="/trades/lifecycle" element={<Lifecycle />} />
                              <Route path="/trades/new-order" element={<NewOrder />} />
                              <Route path="/trades/order-overview" element={<OrderOverview />} />
                              <Route path="/trades/order-processing" element={<OrderProcessing />} />
                              <Route path="/trades/flows" element={<Flows />} />
                              <Route path="/documents" element={<DocumentVault />} />
                              <Route path="/fees" element={<FeeReports />} />
                              <Route path="/fee-management" element={<FeeManagement />} />
                              <Route path="/messages" element={<Messages />} />
                              <Route path="/training" element={<Training />} />
                              <Route path="/compliance" element={<ComplianceDashboard />} />
                              <Route path="/compliance-training" element={<ComplianceTraining />} />
                              <Route path="/policy-management" element={<PolicyManagement />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/profile" element={<UserProfile />} />
                              <Route path="/invoice-system" element={<InvoiceSystem />} />
                              <Route path="/invoices" element={<InvoiceSystem />} />
                              <Route path="/news" element={<News />} />
                            </Routes>
                          </MainLayout>
                        </SimpleProtectedRoute>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </ClientsProvider>
            </AccountsProvider>
          </SettingsProvider>
        </SimpleAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
