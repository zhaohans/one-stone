
export interface Signatory {
  id: string;
  account_id: string;
  name: string;
  title?: string; // Not in DB schema but kept for UI compatibility
  email: string;
  phone?: string;
  role: 'primary' | 'secondary' | 'authorized_user' | 'view_only';
  is_active: boolean;
  start_date: string; // Maps to date_added in DB
  end_date?: string | null; // Not in DB schema but kept for UI compatibility
  created_at: string;
  updated_at: string;
}

export interface SignatoryAuditLog {
  id: string;
  signatory_id: string;
  action: string;
  field_changed?: string;
  old_value?: any;
  new_value?: any;
  changed_by: string;
  changed_at: string;
  reason?: string;
}
