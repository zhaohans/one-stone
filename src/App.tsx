import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "./components/error-boundary";
import { ToastProvider } from "./components/ui/toast-manager";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { AccountsProvider } from "./contexts/AccountsContext";
import MainLayout from "./components/MainLayout";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import Dashboard from "./pages/Dashboard";
import DocumentsTable from "./components/DocumentsTable";
import ClientManagement from "./pages/ClientManagement";
import Accounts from "./pages/Accounts";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import ComplianceDashboard from "./pages/ComplianceDashboard";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import InvoiceSystem from "./pages/InvoiceSystem";
import FeeReports from "./pages/FeeReports";
import ErrorPage from "./pages/error/ErrorPage";
import "./App.css";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="xl" text="Loading application..." />
  </div>
);

const PageErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error?: Error;
  resetErrorBoundary?: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Error</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || "Something went wrong loading this page"}
      </p>
      <div className="space-x-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Example sendErrorReport function
const sendErrorReport = (error: any) => {
  // TODO: Integrate with backend or email service
  alert("Error report sent to admin!");
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SimpleAuthProvider>
          <SettingsProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<SimpleAuthPage />} />
                    <Route
                      path="/onboarding"
                      element={<div>Onboarding Page</div>}
                    />
                    {/* Redirect /dashboard to / for robustness */}
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/" replace />}
                    />
                    {/* Protected routes */}
                    <Route
                      path="/"
                      element={
                        <ClientsProvider>
                          <AccountsProvider>
                            <MainLayout />
                          </AccountsProvider>
                        </ClientsProvider>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="documents" element={<DocumentsTable />} />
                      <Route path="clients" element={<ClientManagement />} />
                      <Route path="accounts" element={<Accounts />} />
                      <Route path="trades" element={<Trades />} />
                      <Route path="messages" element={<Messages />} />
                      <Route
                        path="invoice-system"
                        element={<InvoiceSystem />}
                      />
                      <Route
                        path="compliance"
                        element={<ComplianceDashboard />}
                      />
                      <Route path="news" element={<News />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="fee-reports" element={<FeeReports />} />
                    </Route>
                    {/* 404 Route */}
                    <Route
                      path="*"
                      element={
                        <ErrorPage
                          code="404"
                          message="Page not found."
                          onSendReport={() =>
                            sendErrorReport("404 - Page not found")
                          }
                        />
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </SettingsProvider>
        </SimpleAuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
