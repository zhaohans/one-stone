import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TradeData {
  account_id: string;
  security_id: string;
  trade_type:
    | "buy"
    | "sell"
    | "transfer_in"
    | "transfer_out"
    | "dividend"
    | "fee";
  quantity: number;
  price?: number;
  trade_date?: string;
  settlement_date?: string;
  currency?: string;
  commission?: number;
  fees?: number;
  tax?: number;
  reference_number?: string;
  counterparty?: string;
  notes?: string;
  auto_settle?: boolean;
}

export const useTradeProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processTrade = async (tradeData: TradeData) => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("process-trade", {
        body: { trade: tradeData },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Trade Processed",
        description: data.message || "Trade has been successfully processed",
      });

      return { success: true, trade: data.trade };
    } catch (error) {
      console.error("Trade processing error:", error);

      toast({
        title: "Trade Processing Failed",
        description:
          error instanceof Error ? error.message : "Failed to process trade",
        variant: "destructive",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const settleTrade = async (tradeId: string) => {
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("trades")
        .update({
          trade_status: "settled",
          settlement_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", tradeId);

      if (error) {
        throw error;
      }

      toast({
        title: "Trade Settled",
        description: "Trade has been marked as settled and positions updated",
      });

      return { success: true };
    } catch (error) {
      console.error("Trade settlement error:", error);

      toast({
        title: "Settlement Failed",
        description:
          error instanceof Error ? error.message : "Failed to settle trade",
        variant: "destructive",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processTrade,
    settleTrade,
    isProcessing,
  };
};
