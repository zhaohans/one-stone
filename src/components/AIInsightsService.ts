import { supabase } from "@/integrations/supabase/client";

export interface AIInsight {
  id: string;
  type:
    | "portfolio_analysis"
    | "market_trend"
    | "risk_assessment"
    | "recommendation";
  title: string;
  description: string;
  confidence: number;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface AIAnalysisRequest {
  type: "portfolio" | "market" | "risk" | "performance";
  accountId?: string;
  timeframe?: string;
  parameters?: Record<string, any>;
}

export class AIInsightsService {
  static async generateInsights(request: AIAnalysisRequest): Promise<{
    success: boolean;
    insights?: AIInsight[];
    error?: string;
  }> {
    try {
      console.log("Generating AI insights for request:", request);

      // In a real implementation, this would call an AI service
      // For now, we'll generate mock insights based on the request type
      const insights = this.generateMockInsights(request);

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error("Error generating insights:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async getChatResponse(
    message: string,
    context?: Record<string, any>,
  ): Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }> {
    try {
      console.log("Getting AI chat response for:", message);

      // Mock implementation - replace with actual AI service
      const response = this.generateChatResponse(message, context);

      return {
        success: true,
        response,
      };
    } catch (error) {
      console.error("Error getting chat response:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private static generateMockInsights(request: AIAnalysisRequest): AIInsight[] {
    const baseInsights: Partial<AIInsight>[] = [];

    if (request.type === "portfolio") {
      baseInsights.push(
        {
          type: "portfolio_analysis",
          title: "Sector Concentration Risk",
          description:
            "Your portfolio has 32% concentration in technology stocks, which may increase volatility during tech sector downturns.",
          confidence: 0.85,
          priority: "medium",
          actionable: true,
          metadata: { sector: "technology", concentration: 0.32 },
        },
        {
          type: "recommendation",
          title: "Diversification Opportunity",
          description:
            "Consider adding healthcare and consumer staples to improve portfolio balance and reduce correlation.",
          confidence: 0.78,
          priority: "low",
          actionable: true,
          metadata: { suggestedSectors: ["healthcare", "consumer_staples"] },
        },
      );
    }

    if (request.type === "risk") {
      baseInsights.push({
        type: "risk_assessment",
        title: "High Volatility Warning",
        description:
          "Portfolio beta is 1.24, indicating higher volatility than market average. Consider defensive positions.",
        confidence: 0.92,
        priority: "high",
        actionable: true,
        metadata: { beta: 1.24, volatility: "high" },
      });
    }

    if (request.type === "market") {
      baseInsights.push({
        type: "market_trend",
        title: "Interest Rate Impact",
        description:
          "Rising interest rates may negatively impact growth stocks in your portfolio over the next quarter.",
        confidence: 0.72,
        priority: "medium",
        actionable: true,
        metadata: { trend: "rising_rates", impact: "negative_growth" },
      });
    }

    return baseInsights.map(
      (insight, index) =>
        ({
          id: `insight_${Date.now()}_${index}`,
          created_at: new Date().toISOString(),
          ...insight,
        }) as AIInsight,
    );
  }

  private static generateChatResponse(
    message: string,
    context?: Record<string, any>,
  ): string {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("portfolio") &&
      lowerMessage.includes("performance")
    ) {
      return "Your portfolio has performed well this quarter with a 7.2% return, outperforming the S&P 500 by 1.8%. The main contributors were your technology holdings (AAPL +12%, MSFT +9%) and your healthcare position in JNJ (+6%). Your defensive allocation helped during the recent market volatility.";
    }

    if (lowerMessage.includes("risk")) {
      return "Based on my analysis, your portfolio risk level is moderate-high with a beta of 1.24. Your main risk factors are: 32% tech concentration, 15% in emerging markets, and limited defensive positions. I recommend adding some utilities or consumer staples to reduce volatility.";
    }

    if (
      lowerMessage.includes("recommendation") ||
      lowerMessage.includes("suggest")
    ) {
      return "Here are my current recommendations: 1) Reduce tech exposure from 32% to 25%, 2) Add 5-7% in healthcare (consider JNJ, PFE), 3) Increase cash position to 8% given market uncertainty, 4) Consider adding international developed markets for better diversification.";
    }

    if (lowerMessage.includes("market") || lowerMessage.includes("outlook")) {
      return "Current market conditions show increased volatility due to inflation concerns and geopolitical tensions. I expect continued rotation from growth to value stocks. Key factors to watch: Fed policy decisions, earnings season results, and commodity prices. Consider maintaining higher cash levels for opportunities.";
    }

    return "I can help you with portfolio analysis, risk assessment, market insights, and investment recommendations. What specific aspect of your investments would you like to discuss?";
  }
}
