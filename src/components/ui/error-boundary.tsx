import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import ErrorPage from "../../pages/error/ErrorPage";
import { NotificationService } from "@/services/NotificationService";
import { useAuth } from "@/contexts/SimpleAuthContext";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  reportSent?: boolean;
}

class ErrorBoundaryInner extends Component<Props & { user: any }, State> {
  constructor(props: Props & { user: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  sendErrorReport = async () => {
    const { user } = this.props;
    const { error, errorInfo } = this.state;
    const context = [
      `User: ${user?.email || "Unknown"} (ID: ${user?.id || "N/A"})`,
      `Error: ${error?.toString()}`,
      `Stack: ${errorInfo?.componentStack || "N/A"}`,
      `Time: ${new Date().toISOString()}`,
      `Location: ${window.location.href}`,
    ].join("\n");
    await NotificationService.sendEmail({
      to: ["admin@yourdomain.com"],
      subject: `App Error Report: ${error?.message || "Unknown Error"}`,
      htmlContent: `<pre>${context}</pre>`,
      textContent: context,
    });
    this.setState({ reportSent: true });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorPage
          code={500}
          message={this.state.error?.message || "An unexpected error occurred"}
          onSendReport={
            this.state.reportSent ? undefined : this.sendErrorReport
          }
        />
      );
    }
    return this.props.children;
  }
}

export function ErrorBoundary(props: Props) {
  const { user } = useAuth();
  return <ErrorBoundaryInner {...props} user={user} />;
}

export const ErrorFallback: React.FC<{
  error?: Error;
  resetErrorBoundary?: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
    <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 text-center mb-4">
      {error?.message || "An unexpected error occurred"}
    </p>
    {resetErrorBoundary && (
      <Button onClick={resetErrorBoundary} size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
);
