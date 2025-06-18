
import { supabase } from '@/integrations/supabase/client';

export class BusinessLogicService {
  
  // Client management
  static async createClient(clientData: any) {
    try {
      // Generate client code
      const { data: clientCode } = await supabase.rpc('generate_client_code');
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          client_code: clientCode,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, client: data };

    } catch (error) {
      console.error('Error creating client:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Account management
  static async createAccount(accountData: any) {
    try {
      // Generate account number
      const { data: accountNumber } = await supabase.rpc('generate_account_number');
      
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          ...accountData,
          account_number: accountNumber,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, account: data };

    } catch (error) {
      console.error('Error creating account:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Portfolio calculations
  static async calculatePortfolioValue(accountId: string) {
    try {
      const { data: positions, error } = await supabase
        .from('positions')
        .select(`
          quantity,
          average_cost,
          market_value,
          securities(symbol, name, currency)
        `)
        .eq('account_id', accountId)
        .gt('quantity', 0);

      if (error) throw error;

      const portfolio = {
        totalValue: 0,
        totalCost: 0,
        unrealizedPnL: 0,
        positions: positions || []
      };

      if (positions) {
        portfolio.totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0);
        portfolio.totalCost = positions.reduce((sum, pos) => sum + (pos.quantity * (pos.average_cost || 0)), 0);
        portfolio.unrealizedPnL = portfolio.totalValue - portfolio.totalCost;
      }

      return { success: true, portfolio };

    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Risk analysis
  static async analyzePortfolioRisk(accountId: string) {
    try {
      const { data: positions, error } = await supabase
        .from('positions')
        .select(`
          quantity,
          market_value,
          securities(symbol, name, sector, industry, country)
        `)
        .eq('account_id', accountId)
        .gt('quantity', 0);

      if (error) throw error;

      if (!positions || positions.length === 0) {
        return { 
          success: true, 
          riskAnalysis: {
            totalValue: 0,
            concentrationRisk: [],
            sectorAllocation: {},
            countryAllocation: {}
          }
        };
      }

      const totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0);
      
      // Concentration risk (positions > 5% of portfolio)
      const concentrationRisk = positions
        .filter(pos => (pos.market_value || 0) / totalValue > 0.05)
        .map(pos => ({
          symbol: pos.securities?.symbol,
          name: pos.securities?.name,
          value: pos.market_value,
          percentage: ((pos.market_value || 0) / totalValue * 100).toFixed(2)
        }));

      // Sector allocation
      const sectorAllocation: Record<string, number> = {};
      positions.forEach(pos => {
        const sector = pos.securities?.sector || 'Unknown';
        sectorAllocation[sector] = (sectorAllocation[sector] || 0) + (pos.market_value || 0);
      });

      // Country allocation
      const countryAllocation: Record<string, number> = {};
      positions.forEach(pos => {
        const country = pos.securities?.country || 'Unknown';
        countryAllocation[country] = (countryAllocation[country] || 0) + (pos.market_value || 0);
      });

      return { 
        success: true, 
        riskAnalysis: {
          totalValue,
          concentrationRisk,
          sectorAllocation,
          countryAllocation
        }
      };

    } catch (error) {
      console.error('Error analyzing portfolio risk:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Document workflow
  static async uploadDocument(documentData: any, file: File) {
    try {
      // Upload file to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: uploadData.path,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, document: data };

    } catch (error) {
      console.error('Error uploading document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Compliance requirements check
  static async checkClientCompliance(clientId: string) {
    try {
      const { data, error } = await supabase
        .rpc('check_compliance_requirements', { client_id_param: clientId });

      if (error) throw error;
      return { success: true, requirements: data || [] };

    } catch (error) {
      console.error('Error checking compliance:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
