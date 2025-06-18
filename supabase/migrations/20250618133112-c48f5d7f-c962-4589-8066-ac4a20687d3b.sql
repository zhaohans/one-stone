
-- Create RLS policies for secure data access

-- Clients table policies
CREATE POLICY "Users can view clients they manage" ON public.clients
  FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() = updated_by OR
    auth.uid() = user_id OR
    public.is_admin()
  );

CREATE POLICY "Users can create clients" ON public.clients
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    (public.is_admin() OR public.get_current_user_role() = 'user')
  );

CREATE POLICY "Users can update clients they manage" ON public.clients
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    auth.uid() = updated_by OR
    public.is_admin()
  );

-- Accounts table policies
CREATE POLICY "Users can view accounts for their clients" ON public.accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients c 
      WHERE c.id = accounts.client_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "Users can create accounts for their clients" ON public.accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients c 
      WHERE c.id = accounts.client_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
    ) AND auth.uid() = created_by
  );

CREATE POLICY "Users can update accounts they manage" ON public.accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.clients c 
      WHERE c.id = accounts.client_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
    ) OR public.is_admin()
  );

-- Securities table policies (global reference data)
CREATE POLICY "All authenticated users can view securities" ON public.securities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage securities" ON public.securities
  FOR ALL USING (public.is_admin());

-- Trades table policies
CREATE POLICY "Users can view trades for their accounts" ON public.trades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = trades.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "Users can create trades for their accounts" ON public.trades
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = trades.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
    ) AND auth.uid() = created_by
  );

CREATE POLICY "Users can update trades they created" ON public.trades
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    auth.uid() = updated_by OR
    public.is_admin()
  );

-- Positions table policies
CREATE POLICY "Users can view positions for their accounts" ON public.positions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = positions.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "System can manage all positions" ON public.positions
  FOR ALL USING (public.is_admin());

-- Documents table policies
CREATE POLICY "Users can view documents for their clients/accounts" ON public.documents
  FOR SELECT USING (
    (client_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.clients c 
      WHERE c.id = documents.client_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    )) OR
    (account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = documents.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    )) OR
    auth.uid() = uploaded_by OR
    public.is_admin()
  );

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update documents they uploaded" ON public.documents
  FOR UPDATE USING (
    auth.uid() = uploaded_by OR 
    auth.uid() = approved_by OR 
    public.is_admin()
  );

-- Compliance tasks policies
CREATE POLICY "Users can view assigned compliance tasks" ON public.compliance_tasks
  FOR SELECT USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR
    public.is_admin()
  );

CREATE POLICY "Users can create compliance tasks" ON public.compliance_tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update compliance tasks they're involved with" ON public.compliance_tasks
  FOR UPDATE USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR 
    public.is_admin()
  );

-- Messages table policies
CREATE POLICY "Users can view relevant messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    (client_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.clients c 
      WHERE c.id = messages.client_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    )) OR
    public.is_admin()
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update messages they created or are assigned" ON public.messages
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR 
    public.is_admin()
  );

-- Fees table policies
CREATE POLICY "Users can view fees for their accounts" ON public.fees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = fees.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "Users can create fees for their accounts" ON public.fees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      JOIN public.clients c ON a.client_id = c.id
      WHERE a.id = fees.account_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
    ) AND auth.uid() = created_by
  );

CREATE POLICY "Users can update fees they created" ON public.fees
  FOR UPDATE USING (
    auth.uid() = created_by OR public.is_admin()
  );

-- Retrocessions table policies
CREATE POLICY "Users can view retrocessions for fees they manage" ON public.retrocessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fees f
      JOIN public.accounts a ON f.account_id = a.id
      JOIN public.clients c ON a.client_id = c.id
      WHERE f.id = retrocessions.fee_id 
      AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR f.created_by = auth.uid())
    ) OR public.is_admin()
  );

CREATE POLICY "Only admins can manage retrocessions" ON public.retrocessions
  FOR ALL USING (public.is_admin());

-- Audit logs policies
CREATE POLICY "Users can view audit logs for their data" ON public.audit_logs
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
  );

CREATE POLICY "System can create audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create database functions for common operations

-- Function to calculate management fees
CREATE OR REPLACE FUNCTION public.calculate_management_fee(
  account_id_param UUID,
  start_date DATE,
  end_date DATE,
  fee_rate DECIMAL(8,6)
) RETURNS DECIMAL(18,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_balance DECIMAL(18,2);
  days_in_period INTEGER;
  annual_fee DECIMAL(18,2);
BEGIN
  -- Calculate average balance over the period (simplified)
  SELECT COALESCE(AVG(market_value), 0) INTO avg_balance
  FROM public.positions 
  WHERE account_id = account_id_param;
  
  -- Calculate days in period
  days_in_period := end_date - start_date;
  
  -- Calculate pro-rated annual fee
  annual_fee := (avg_balance * fee_rate / 100) * (days_in_period / 365.0);
  
  RETURN annual_fee;
END;
$$;

-- Function to update position after trade
CREATE OR REPLACE FUNCTION public.update_position_after_trade()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_quantity DECIMAL(18,6) := 0;
  current_cost DECIMAL(18,6) := 0;
  new_quantity DECIMAL(18,6);
  new_avg_cost DECIMAL(18,6);
BEGIN
  -- Get current position
  SELECT COALESCE(quantity, 0), COALESCE(average_cost, 0)
  INTO current_quantity, current_cost
  FROM public.positions 
  WHERE account_id = NEW.account_id AND security_id = NEW.security_id;
  
  -- Calculate new position based on trade type
  IF NEW.trade_type IN ('buy', 'transfer_in') THEN
    new_quantity := current_quantity + NEW.quantity;
    IF current_quantity = 0 THEN
      new_avg_cost := NEW.price;
    ELSE
      new_avg_cost := ((current_quantity * current_cost) + (NEW.quantity * NEW.price)) / new_quantity;
    END IF;
  ELSIF NEW.trade_type IN ('sell', 'transfer_out') THEN
    new_quantity := current_quantity - NEW.quantity;
    new_avg_cost := current_cost; -- Keep same average cost for sales
  ELSE
    -- For other trade types, don't change position
    RETURN NEW;
  END IF;
  
  -- Update or insert position
  INSERT INTO public.positions (account_id, security_id, quantity, average_cost, last_updated)
  VALUES (NEW.account_id, NEW.security_id, new_quantity, new_avg_cost, NOW())
  ON CONFLICT (account_id, security_id)
  DO UPDATE SET 
    quantity = new_quantity,
    average_cost = new_avg_cost,
    last_updated = NOW();
    
  RETURN NEW;
END;
$$;

-- Create trigger for position updates
CREATE TRIGGER trigger_update_position_after_trade
  AFTER INSERT OR UPDATE ON public.trades
  FOR EACH ROW 
  WHEN (NEW.trade_status = 'settled')
  EXECUTE FUNCTION public.update_position_after_trade();

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  changed_fields TEXT[] := '{}';
  field_name TEXT;
BEGIN
  -- Determine changed fields for UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    -- This is a simplified version - in production you'd want more sophisticated field tracking
    IF OLD.* IS DISTINCT FROM NEW.* THEN
      changed_fields := array_append(changed_fields, 'data_changed');
    END IF;
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    table_name, record_id, action, old_values, new_values, 
    changed_fields, user_id, created_at
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    changed_fields,
    auth.uid(),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for key tables
CREATE TRIGGER audit_clients AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_accounts AFTER INSERT OR UPDATE OR DELETE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_trades AFTER INSERT OR UPDATE OR DELETE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_fees AFTER INSERT OR UPDATE OR DELETE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Function to generate next client code
CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number INTEGER;
  client_code TEXT;
BEGIN
  -- Get the next sequence number
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_code FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.clients
  WHERE client_code LIKE 'CL%';
  
  -- Format as CL + padded number
  client_code := 'CL' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN client_code;
END;
$$;

-- Function to generate next account number
CREATE OR REPLACE FUNCTION public.generate_account_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number INTEGER;
  account_number TEXT;
BEGIN
  -- Get the next sequence number
  SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.accounts
  WHERE account_number LIKE 'ACC%';
  
  -- Format as ACC + padded number
  account_number := 'ACC' || LPAD(next_number::TEXT, 8, '0');
  
  RETURN account_number;
END;
$$;

-- Function to check compliance requirements
CREATE OR REPLACE FUNCTION public.check_compliance_requirements(client_id_param UUID)
RETURNS TABLE(
  requirement TEXT,
  status TEXT,
  due_date DATE,
  description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'KYC Documentation' as requirement,
    CASE 
      WHEN c.kyc_status = 'approved' THEN 'Compliant'
      WHEN c.kyc_status = 'pending' THEN 'Pending'
      ELSE 'Non-Compliant'
    END as status,
    (CURRENT_DATE + INTERVAL '30 days')::DATE as due_date,
    'Know Your Customer documentation must be current and approved' as description
  FROM public.clients c
  WHERE c.id = client_id_param
  
  UNION ALL
  
  SELECT 
    'Annual Review' as requirement,
    CASE 
      WHEN EXTRACT(YEAR FROM c.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE) THEN 'Compliant'
      ELSE 'Due'
    END as status,
    (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year')::DATE as due_date,
    'Annual client review and risk assessment required' as description
  FROM public.clients c
  WHERE c.id = client_id_param;
END;
$$;
