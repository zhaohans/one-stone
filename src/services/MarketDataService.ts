
import { supabase } from '@/integrations/supabase/client';

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  currency: string;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class MarketDataService {
  
  // Get real-time quotes for securities
  static async getQuotes(symbols: string[]): Promise<{ success: boolean; quotes?: MarketQuote[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { action: 'quotes', symbols }
      });

      if (error) throw error;
      
      return { success: true, quotes: data.quotes };

    } catch (error) {
      console.error('Error fetching market quotes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get historical price data
  static async getHistoricalPrices(
    symbol: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ success: boolean; prices?: HistoricalPrice[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { 
          action: 'historical', 
          symbol, 
          startDate, 
          endDate 
        }
      });

      if (error) throw error;
      
      return { success: true, prices: data.prices };

    } catch (error) {
      console.error('Error fetching historical prices:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Update security prices in database
  static async updateSecurityPrices(quotes: MarketQuote[]): Promise<{ success: boolean; error?: string }> {
    try {
      const updates = quotes.map(quote => ({
        symbol: quote.symbol,
        current_price: quote.price,
        price_change: quote.change,
        price_change_percent: quote.changePercent,
        last_updated: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('securities')
        .upsert(updates, { 
          onConflict: 'symbol',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('Error updating security prices:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Update portfolio positions with current market values
  static async updatePortfolioValues(accountId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('update-portfolio-values', {
        body: { accountId }
      });

      if (error) throw error;
      
      return { success: true };

    } catch (error) {
      console.error('Error updating portfolio values:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
