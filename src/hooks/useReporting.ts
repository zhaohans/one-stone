
import { useState } from 'react';
import { ReportingService, ReportParams, ReportResult } from '@/services/ReportingService';
import { useToast } from '@/hooks/use-toast';

export const useReporting = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<ReportResult[]>([]);
  const { toast } = useToast();

  const generateReport = async (params: ReportParams) => {
    setIsGenerating(true);
    
    try {
      let result;
      
      switch (params.reportType) {
        case 'portfolio':
          result = await ReportingService.generatePortfolioReport(params);
          break;
        case 'performance':
          result = await ReportingService.generatePerformanceReport(params);
          break;
        case 'tax':
          result = await ReportingService.generateTaxReport(params);
          break;
        case 'compliance':
          result = await ReportingService.generateComplianceReport(params);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      if (result.success && result.report) {
        setReports(prev => [...prev, result.report!]);
        toast({
          title: "Report Generated",
          description: `${params.reportType} report has been generated successfully`,
        });
        return { success: true, report: result.report };
      } else {
        throw new Error(result.error || 'Failed to generate report');
      }

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      });
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      setIsGenerating(false);
    }
  };

  const checkReportStatus = async (reportId: string) => {
    try {
      const result = await ReportingService.getReportStatus(reportId);
      
      if (result.success) {
        return { 
          success: true, 
          status: result.status,
          downloadUrl: result.downloadUrl 
        };
      } else {
        throw new Error(result.error || 'Failed to check report status');
      }

    } catch (error) {
      console.error('Error checking report status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  };

  const scheduleReport = async (params: ReportParams & { 
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
  }) => {
    try {
      const result = await ReportingService.scheduleRecurringReport(params);
      
      if (result.success) {
        toast({
          title: "Report Scheduled",
          description: `${params.reportType} report scheduled for ${params.frequency} delivery`,
        });
        return { success: true, scheduleId: result.scheduleId };
      } else {
        throw new Error(result.error || 'Failed to schedule report');
      }

    } catch (error) {
      console.error('Error scheduling report:', error);
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Failed to schedule report",
        variant: "destructive",
      });
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  };

  return {
    generateReport,
    checkReportStatus,
    scheduleReport,
    isGenerating,
    reports
  };
};
