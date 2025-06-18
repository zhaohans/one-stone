
import { useState, useEffect } from 'react';
import { MarketDataService, MarketQuote } from '@/services/MarketDataService';
import { useToast } from '@/hooks/use-toast';

export const useMarketData = (symbols: string[] = []) => {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchQuotes = async (symbolsToFetch: string[] = symbols) => {
    if (symbolsToFetch.length === 0) return;

    setIsLoading(true);
    
    try {
      const result = await MarketDataService.getQuotes(symbolsToFetch);
      
      if (result.success && result.quotes) {
        setQuotes(result.quotes);
      } else {
        throw new Error(result.error || 'Failed to fetch quotes');
      }

    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Market Data Error",
        description: error instanceof Error ? error.message : "Failed to fetch market data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePortfolioValues = async (accountI?: string) => {
    try {
      const result = await MarketDataService.updatePortfolioValues(accountId);
      
      if (result.success) {
        toast({
          title: "Portfolio Updated",
          description: "Portfolio values have been updated with current market prices",
        });
      } else {
        throw new Error(result.error || 'Failed to update portfolio');
      }

    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update portfolio",
        variant: "destructive",
      });
    }
  };

  // Auto-fetch quotes when symbols change
  useEffect(() => {
    if (symbols.length > 0) {
      fetchQuotes(symbols);
    }
  }, [symbols.join(',')]);

  return {
    quotes,
    isLoading,
    fetchQuotes,
    updatePortfolioValues
  };
};
