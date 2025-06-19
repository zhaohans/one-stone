import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
}

const AuditLogTable = () => {
  const auditLogs: AuditLogEntry[] = [
    {
      id: "1",
      action: "Profile Updated",
      timestamp: "2024-01-15 14:30:22",
      ipAddress: "203.116.43.77",
      userAgent: "Chrome 120.0.0.0",
      status: "success",
    },
    {
      id: "2",
      action: "Password Changed",
      timestamp: "2024-01-13 09:15:10",
      ipAddress: "203.116.43.77",
      userAgent: "Chrome 120.0.0.0",
      status: "success",
    },
    {
      id: "3",
      action: "Failed Login Attempt",
      timestamp: "2024-01-12 16:45:33",
      ipAddress: "192.168.1.100",
      userAgent: "Safari 17.1.2",
      status: "failed",
    },
    {
      id: "4",
      action: "2FA Enabled",
      timestamp: "2024-01-08 11:20:05",
      ipAddress: "203.116.43.77",
      userAgent: "Chrome 120.0.0.0",
      status: "success",
    },
    {
      id: "5",
      action: "Email Verification",
      timestamp: "2024-01-08 11:18:42",
      ipAddress: "203.116.43.77",
      userAgent: "Chrome 120.0.0.0",
      status: "warning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity & Audit Log</CardTitle>
            <CardDescription>
              Complete history of account activities and security events
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{log.action}</span>
                  <Badge
                    variant={getStatusColor(log.status)}
                    className="text-xs"
                  >
                    {log.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Time: {log.timestamp}</div>
                  <div>
                    IP: {log.ipAddress} | {log.userAgent}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Load More Activities</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTable;
