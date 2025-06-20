import { supabase } from "@/integrations/supabase/client";

export interface MarketQuote {
  symbol: string;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  volume?: number;
  market_cap?: number;
  last_updated: string;
}

export interface MarketDataResponse {
  success: boolean;
  quotes?: MarketQuote[];
  error?: string;
}

export interface PortfolioUpdateResponse {
  success: boolean;
  updatedPositions?: number;
  error?: string;
}

export class MarketDataService {
  static async getQuotes(symbols: string[]): Promise<MarketDataResponse> {
    try {
      console.log("Fetching market data for symbols:", symbols);

      const { data, error } = await supabase.functions.invoke("market-data", {
        body: { symbols },
      });

      if (error) {
        console.error("Market data function error:", error);
        return { success: false, error: error.message };
      }

      console.log("Market data response:", data);
      return data;
    } catch (error) {
      console.error("Market data service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async getHistoricalPrices(
    symbol: string,
    period: string = "1M",
  ): Promise<MarketDataResponse> {
    try {
      console.log("Fetching historical data for:", symbol, period);

      const { data, error } = await supabase.functions.invoke("market-data", {
        body: {
          symbol,
          period,
          type: "historical",
        },
      });

      if (error) {
        console.error("Historical data function error:", error);
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error("Historical data service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async updatePortfolioValues(
    accountId?: string,
  ): Promise<PortfolioUpdateResponse> {
    try {
      console.log("Updating portfolio values for account:", accountId);

      const { data, error } = await supabase.functions.invoke(
        "update-portfolio-values",
        {
          body: { accountId },
        },
      );

      if (error) {
        console.error("Portfolio update function error:", error);
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error("Portfolio update service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async updateSecurityPrices(
    quotes: MarketQuote[],
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(
        "Updating security prices in database:",
        quotes.length,
        "securities",
      );

      // Update each security's current price
      for (const quote of quotes) {
        const { error } = await supabase
          .from("securities")
          .update({
            current_price: quote.current_price,
            updated_at: new Date().toISOString(),
          })
          .eq("symbol", quote.symbol);

        if (error) {
          console.error(
            "Error updating security price for",
            quote.symbol,
            ":",
            error,
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating security prices:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
