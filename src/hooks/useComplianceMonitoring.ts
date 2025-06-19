import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ComplianceTaskStatus =
  Database["public"]["Enums"]["compliance_task_status"];

interface ComplianceCheckParams {
  client_id?: string;
  account_id?: string;
  check_type?: "all" | "kyc" | "concentration" | "documents" | "tasks";
}

export const useComplianceMonitoring = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const runComplianceCheck = async (params: ComplianceCheckParams = {}) => {
    setIsChecking(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "compliance-monitor",
        {
          body: params,
        },
      );

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const { summary } = data;
      const issueCount = summary.total_issues;
      const taskCount = data.tasks_created.length;

      if (issueCount > 0) {
        toast({
          title: "Compliance Issues Found",
          description: `Found ${issueCount} compliance issues${taskCount > 0 ? ` and created ${taskCount} tasks` : ""}`,
          variant: summary.high_severity > 0 ? "destructive" : "default",
        });
      } else {
        toast({
          title: "Compliance Check Complete",
          description: "No compliance issues found",
        });
      }

      return {
        success: true,
        issues: data.compliance_issues,
        tasks: data.tasks_created,
        summary: summary,
      };
    } catch (error) {
      console.error("Compliance check error:", error);

      toast({
        title: "Compliance Check Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to run compliance check",
        variant: "destructive",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsChecking(false);
    }
  };

  const getComplianceTasks = async (
    assignedTo?: string,
    status?: ComplianceTaskStatus,
  ) => {
    try {
      let query = supabase
        .from("compliance_tasks")
        .select(
          `
          *,
          clients(first_name, last_name, client_code),
          accounts(account_name, account_number)
        `,
        )
        .order("due_date", { ascending: true });

      if (assignedTo) {
        query = query.eq("assigned_to", assignedTo);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return { success: true, tasks: data || [] };
    } catch (error) {
      console.error("Error fetching compliance tasks:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        tasks: [],
      };
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    status: ComplianceTaskStatus,
    notes?: string,
  ) => {
    try {
      const updateData: any = { status };

      if (status === "completed") {
        updateData.completed_date = new Date().toISOString();
        updateData.completion_notes = notes;
      }

      const { error } = await supabase
        .from("compliance_tasks")
        .update(updateData)
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      toast({
        title: "Task Updated",
        description: `Task status updated to ${status}`,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating task:", error);

      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    runComplianceCheck,
    getComplianceTasks,
    updateTaskStatus,
    isChecking,
  };
};
