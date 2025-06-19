import { supabase } from "@/integrations/supabase/client";

export interface ReportParams {
  clientId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  reportType: "portfolio" | "performance" | "tax" | "compliance" | "fee";
  format?: "pdf" | "excel" | "csv";
}

export interface ReportResult {
  reportId: string;
  downloadUrl: string;
  expiresAt: string;
}

export class ReportingService {
  // Generate portfolio report
  static async generatePortfolioReport(
    params: ReportParams,
  ): Promise<{ success: boolean; report?: ReportResult; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-report",
        {
          body: { ...params, reportType: "portfolio" },
        },
      );

      if (error) throw error;

      return { success: true, report: data.report };
    } catch (error) {
      console.error("Error generating portfolio report:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Generate performance report
  static async generatePerformanceReport(
    params: ReportParams,
  ): Promise<{ success: boolean; report?: ReportResult; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-report",
        {
          body: { ...params, reportType: "performance" },
        },
      );

      if (error) throw error;

      return { success: true, report: data.report };
    } catch (error) {
      console.error("Error generating performance report:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Generate tax report
  static async generateTaxReport(
    params: ReportParams,
  ): Promise<{ success: boolean; report?: ReportResult; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-report",
        {
          body: { ...params, reportType: "tax" },
        },
      );

      if (error) throw error;

      return { success: true, report: data.report };
    } catch (error) {
      console.error("Error generating tax report:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Generate compliance report
  static async generateComplianceReport(
    params: ReportParams,
  ): Promise<{ success: boolean; report?: ReportResult; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-report",
        {
          body: { ...params, reportType: "compliance" },
        },
      );

      if (error) throw error;

      return { success: true, report: data.report };
    } catch (error) {
      console.error("Error generating compliance report:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get report status
  static async getReportStatus(reportId: string): Promise<{
    success: boolean;
    status?: string;
    downloadUrl?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-report-status",
        {
          body: { reportId },
        },
      );

      if (error) throw error;

      return {
        success: true,
        status: data.status,
        downloadUrl: data.downloadUrl,
      };
    } catch (error) {
      console.error("Error getting report status:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Schedule recurring report
  static async scheduleRecurringReport(
    params: ReportParams & {
      frequency: "daily" | "weekly" | "monthly" | "quarterly";
      recipients: string[];
    },
  ): Promise<{ success: boolean; scheduleId?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "schedule-report",
        {
          body: params,
        },
      );

      if (error) throw error;

      return { success: true, scheduleId: data.scheduleId };
    } catch (error) {
      console.error("Error scheduling report:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
