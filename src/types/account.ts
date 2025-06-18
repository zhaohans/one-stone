
export interface Account {
  id: string;
  account_name: string;
  account_number: string;
  client_id: string;
  account_type: 'individual' | 'joint' | 'corporate' | 'trust' | 'retirement';
  account_status: 'active' | 'inactive' | 'suspended' | 'closed';
  base_currency: string;
  opening_date: string;
  closing_date?: string;
  risk_tolerance?: string;
  investment_objective?: string;
  benchmark?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  // Joined data
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    client_code: string;
    email: string;
  };
  positions?: any[];
  total_aum?: number;
  holdings_count?: number;
}

export interface AccountFilters {
  account_type?: string;
  account_status?: string;
  base_currency?: string;
  client_search?: string;
}

export interface CreateAccountData {
  account_name: string;
  client_id: string;
  account_type: Account['account_type'];
  base_currency: string;
  opening_date: string;
  risk_tolerance?: string;
  investment_objective?: string;
  benchmark?: string;
}

export interface UpdateAccountData {
  account_name?: string;
  account_type?: Account['account_type'];
  account_status?: Account['account_status'];
  base_currency?: string;
  risk_tolerance?: string;
  investment_objective?: string;
  benchmark?: string;
  closing_date?: string;
}
