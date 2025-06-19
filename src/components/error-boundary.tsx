import React from "react";
import { Button } from "./ui/button";
import ErrorPage from "../pages/error/ErrorPage";
import { NotificationService } from "@/services/NotificationService";
import { useAuth } from "@/contexts/SimpleAuthContext";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  reportSent?: boolean;
}

class ErrorBoundaryInner extends React.Component<Props & { user: any }, State> {
  constructor(props: Props & { user: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
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
