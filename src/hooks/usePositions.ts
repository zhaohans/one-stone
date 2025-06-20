import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Position {
  id: string;
  account_id: string;
  security_id: string;
  quantity: number;
  average_cost?: number;
  market_value?: number;
  unrealized_pnl?: number;
  last_updated: string;
  // Joined data
  security?: {
    id: string;
    symbol: string;
    name: string;
    currency: string;
    security_type: string;
  };
}

export const usePositions = (accountId?: string) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPositions = async () => {
    if (!accountId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("positions")
        .select(
          `
          *,
          security:securities(id, symbol, name, currency, security_type)
        `,
        )
        .eq("account_id", accountId)
        .gt("quantity", 0) // Only show positions with quantity > 0
        .order("market_value", { ascending: false });

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch holdings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [accountId]);

  return {
    positions,
    isLoading,
    refetch: fetchPositions,
  };
};
