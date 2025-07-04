
-- Insert sample clients
INSERT INTO public.clients (id, client_code, first_name, last_name, email, phone, kyc_status, risk_profile, created_by, user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'CL000001', 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', 'approved', 'moderate', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440002', 'CL000002', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+1-555-0102', 'approved', 'conservative', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440003', 'CL000003', 'Michael', 'Chen', 'michael.chen@email.com', '+1-555-0103', 'pending', 'aggressive', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440004', 'CL000004', 'Emily', 'Davis', 'emily.davis@email.com', '+1-555-0104', 'approved', 'moderate', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440005', 'CL000005', 'David', 'Wilson', 'david.wilson@email.com', '+1-555-0105', 'approved', 'conservative', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440006', 'CL000006', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '+1-555-0106', 'expired', 'moderate', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440007', 'CL000007', 'Robert', 'Taylor', 'robert.taylor@email.com', '+1-555-0107', 'approved', 'aggressive', auth.uid(), auth.uid()),
  ('550e8400-e29b-41d4-a716-446655440008', 'CL000008', 'Jennifer', 'Brown', 'jennifer.brown@email.com', '+1-555-0108', 'approved', 'moderate', auth.uid(), auth.uid());

-- Insert sample accounts
INSERT INTO public.accounts (id, account_number, account_name, client_id, account_type, account_status, base_currency, opening_date, risk_tolerance, investment_objective, created_by) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'ACC00000001', 'John Smith Personal Account', '550e8400-e29b-41d4-a716-446655440001', 'individual', 'active', 'USD', '2023-01-15', 'moderate', 'Growth', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440002', 'ACC00000002', 'John Smith Retirement', '550e8400-e29b-41d4-a716-446655440001', 'retirement', 'active', 'USD', '2023-02-01', 'conservative', 'Income', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440003', 'ACC00000003', 'Sarah Johnson Investment', '550e8400-e29b-41d4-a716-446655440002', 'individual', 'active', 'EUR', '2023-03-10', 'conservative', 'Balanced', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440004', 'ACC00000004', 'Michael Chen Trading', '550e8400-e29b-41d4-a716-446655440003', 'individual', 'active', 'SGD', '2023-04-05', 'aggressive', 'Growth', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440005', 'ACC00000005', 'Emily Davis Family Trust', '550e8400-e29b-41d4-a716-446655440004', 'trust', 'active', 'USD', '2023-05-20', 'moderate', 'Preservation', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440006', 'ACC00000006', 'Wilson & Associates Corp', '550e8400-e29b-41d4-a716-446655440005', 'corporate', 'active', 'USD', '2023-06-15', 'conservative', 'Income', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440007', 'ACC00000007', 'Lisa Anderson Portfolio', '550e8400-e29b-41d4-a716-446655440006', 'individual', 'suspended', 'HKD', '2023-07-01', 'moderate', 'Growth', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440008', 'ACC00000008', 'Taylor Investment Fund', '550e8400-e29b-41d4-a716-446655440007', 'individual', 'active', 'USD', '2023-08-12', 'aggressive', 'Growth', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440009', 'ACC00000009', 'Jennifer Brown Joint Account', '550e8400-e29b-41d4-a716-446655440008', 'joint', 'active', 'EUR', '2023-09-05', 'moderate', 'Balanced', auth.uid()),
  ('660e8400-e29b-41d4-a716-446655440010', 'ACC00000010', 'Brown Family Savings', '550e8400-e29b-41d4-a716-446655440008', 'individual', 'inactive', 'USD', '2023-10-18', 'conservative', 'Preservation', auth.uid());

-- Insert sample securities
INSERT INTO public.securities (id, symbol, name, security_type, currency, exchange, sector, industry) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'AAPL', 'Apple Inc.', 'equity', 'USD', 'NASDAQ', 'Technology', 'Consumer Electronics'),
  ('770e8400-e29b-41d4-a716-446655440002', 'MSFT', 'Microsoft Corporation', 'equity', 'USD', 'NASDAQ', 'Technology', 'Software'),
  ('770e8400-e29b-41d4-a716-446655440003', 'GOOGL', 'Alphabet Inc.', 'equity', 'USD', 'NASDAQ', 'Technology', 'Internet Services'),
  ('770e8400-e29b-41d4-a716-446655440004', 'TSLA', 'Tesla Inc.', 'equity', 'USD', 'NASDAQ', 'Consumer Cyclical', 'Auto Manufacturers'),
  ('770e8400-e29b-41d4-a716-446655440005', 'AMZN', 'Amazon.com Inc.', 'equity', 'USD', 'NASDAQ', 'Consumer Cyclical', 'Internet Retail'),
  ('770e8400-e29b-41d4-a716-446655440006', 'SPY', 'SPDR S&P 500 ETF', 'etf', 'USD', 'NYSE', 'Diversified', 'Index Fund'),
  ('770e8400-e29b-41d4-a716-446655440007', 'BND', 'Vanguard Total Bond Market ETF', 'etf', 'USD', 'NASDAQ', 'Fixed Income', 'Bond Fund'),
  ('770e8400-e29b-41d4-a716-446655440008', 'VTI', 'Vanguard Total Stock Market ETF', 'etf', 'USD', 'NYSE', 'Diversified', 'Index Fund');

-- Insert sample positions with realistic values
INSERT INTO public.positions (id, account_id, security_id, quantity, average_cost, market_value, unrealized_pnl) VALUES
  -- John Smith Personal Account positions
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 100, 150.00, 18500.00, 3500.00),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 50, 280.00, 16500.00, 2500.00),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440006', 200, 420.00, 88000.00, 4000.00),
  -- Sarah Johnson Investment positions
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440007', 500, 85.00, 43000.00, 500.00),
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440008', 300, 220.00, 69000.00, 3000.00),
  -- Michael Chen Trading positions
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 25, 800.00, 20500.00, 500.00),
  ('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', 15, 3200.00, 48750.00, 750.00),
  -- Emily Davis Family Trust positions
  ('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', 200, 145.00, 37000.00, 8000.00),
  ('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440007', 800, 84.00, 68000.00, 800.00),
  -- More positions for other accounts
  ('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 100, 275.00, 33000.00, 5500.00),
  ('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 75, 2400.00, 195000.00, 15000.00),
  ('880e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440006', 150, 415.00, 66000.00, 3750.00);

-- Update accounts with calculated total AUM and holdings count based on positions
UPDATE public.accounts SET 
  -- Mock total AUM calculation (in a real system this would be calculated from positions)
  total_aum = CASE 
    WHEN id = '660e8400-e29b-41d4-a716-446655440001' THEN 123000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440002' THEN 85000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440003' THEN 112000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440004' THEN 69250.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440005' THEN 105000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440006' THEN 33000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440007' THEN 45000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440008' THEN 195000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440009' THEN 66000.00
    WHEN id = '660e8400-e29b-41d4-a716-446655440010' THEN 25000.00
    ELSE 0
  END,
  holdings_count = CASE 
    WHEN id = '660e8400-e29b-41d4-a716-446655440001' THEN 3
    WHEN id = '660e8400-e29b-41d4-a716-446655440002' THEN 0
    WHEN id = '660e8400-e29b-41d4-a716-446655440003' THEN 2
    WHEN id = '660e8400-e29b-41d4-a716-446655440004' THEN 2
    WHEN id = '660e8400-e29b-41d4-a716-446655440005' THEN 2
    WHEN id = '660e8400-e29b-41d4-a716-446655440006' THEN 1
    WHEN id = '660e8400-e29b-41d4-a716-446655440007' THEN 0
    WHEN id = '660e8400-e29b-41d4-a716-446655440008' THEN 1
    WHEN id = '660e8400-e29b-41d4-a716-446655440009' THEN 1
    WHEN id = '660e8400-e29b-41d4-a716-446655440010' THEN 0
    ELSE 0
  END;
