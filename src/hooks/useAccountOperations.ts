import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Account, CreateAccountData, UpdateAccountData } from "@/types/account";

export const useAccountOperations = () => {
  const { toast } = useToast();

  const createAccount = async (accountData: CreateAccountData) => {
    try {
      const requiredData = {
        account_name: accountData.account_name,
        client_id: accountData.client_id,
        account_type: accountData.account_type,
        base_currency: accountData.base_currency,
        opening_date: accountData.opening_date,
        account_status: "active" as const,
        account_number: `ACC-${Date.now()}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        risk_tolerance: accountData.risk_tolerance,
        investment_objective: accountData.investment_objective,
        benchmark: accountData.benchmark,
      };

      const { data, error } = await supabase
        .from("accounts")
        .insert([requiredData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateAccount = async (id: string, updates: UpdateAccountData) => {
    try {
      const updateData: any = {
        account_name: updates.account_name,
        account_type: updates.account_type,
        account_status: updates.account_status,
        base_currency: updates.base_currency,
        risk_tolerance: updates.risk_tolerance,
        investment_objective: updates.investment_objective,
        benchmark: updates.benchmark,
        closing_date: updates.closing_date,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data, error } = await supabase
        .from("accounts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account updated successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase.from("accounts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const bulkUpdateAccounts = async (
    accountIds: string[],
    updates: Pick<UpdateAccountData, "account_status">,
  ) => {
    try {
      const updateData: any = {
        account_status: updates.account_status,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { error } = await supabase
        .from("accounts")
        .update(updateData)
        .in("id", accountIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${accountIds.length} account(s) updated successfully`,
      });

      return { success: true };
    } catch (error) {
      console.error("Error bulk updating accounts:", error);
      toast({
        title: "Error",
        description: "Failed to update accounts",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    bulkUpdateAccounts,
  };
};
