
export interface Signatory {
  id: string;
  account_id: string;
  user_id?: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  role: 'primary' | 'secondary' | 'authorized_user' | 'view_only';
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SignatoryAuthorization {
  id: string;
  signatory_id: string;
  transaction_type: 'wire_transfer' | 'ach_transfer' | 'check_payment' | 'investment_trade' | 'account_closure' | 'account_modification' | 'fee_payment' | 'dividend_payment' | 'margin_call' | 'loan_advance';
  authorization_level: 'view' | 'authorize_single' | 'authorize_dual' | 'approve_final';
  amount_limit?: number;
  currency?: string;
  requires_dual_approval: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SigningMandate {
  type: 'singly' | 'jointly' | 'custom';
  description?: string;
  required_signatories?: number;
  co_signatories?: string[];
}

export interface SignatoryAuditLog {
  id: string;
  signatory_id: string;
  action: 'created' | 'updated' | 'removed' | 'activated' | 'deactivated';
  field_changed?: string;
  old_value?: any;
  new_value?: any;
  changed_by: string;
  changed_at: string;
  reason?: string;
  ip_address?: string;
}
