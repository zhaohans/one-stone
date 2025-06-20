import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  code: string | number;
  message: string;
  onSendReport?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  message,
  onSendReport,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-6xl font-bold text-red-500">{code}</div>
      <div className="text-xl font-semibold">{message}</div>
      <div className="text-gray-500">
        If you believe this is a mistake, please contact support or send a
        report to the admin.
      </div>
      {onSendReport && (
        <Button onClick={onSendReport} variant="destructive">
          Send Error Report to Admin
        </Button>
      )}
    </div>
  );
};

export default ErrorPage;
