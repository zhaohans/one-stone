
-- Create enums for various status types
CREATE TYPE public.account_type AS ENUM ('individual', 'joint', 'corporate', 'trust', 'retirement');
CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'suspended', 'closed');
CREATE TYPE public.trade_status AS ENUM ('pending', 'executed', 'settled', 'cancelled', 'failed');
CREATE TYPE public.trade_type AS ENUM ('buy', 'sell', 'transfer_in', 'transfer_out', 'dividend', 'fee');
CREATE TYPE public.document_type AS ENUM ('kyc', 'account_opening', 'trade_confirmation', 'statement', 'tax_document', 'compliance', 'other');
CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE public.compliance_task_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue', 'escalated');
CREATE TYPE public.compliance_task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.message_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.message_status AS ENUM ('unread', 'read', 'archived', 'deleted');
CREATE TYPE public.fee_type AS ENUM ('management', 'performance', 'transaction', 'custody', 'retrocession', 'other');

-- Create clients table
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(3), -- ISO country code
    tax_residence VARCHAR(3), -- ISO country code
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(3), -- ISO country code
    kyc_status document_status DEFAULT 'pending',
    risk_profile VARCHAR(20) DEFAULT 'moderate',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create accounts table
CREATE TABLE public.accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type public.account_type NOT NULL,
    account_status public.account_status DEFAULT 'active',
    base_currency VARCHAR(3) DEFAULT 'USD', -- ISO currency code
    opening_date DATE NOT NULL DEFAULT CURRENT_DATE,
    closing_date DATE,
    investment_objective TEXT,
    risk_tolerance VARCHAR(20) DEFAULT 'moderate',
    benchmark VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create securities/instruments table
CREATE TABLE public.securities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    isin VARCHAR(12) UNIQUE,
    cusip VARCHAR(9),
    name VARCHAR(255) NOT NULL,
    security_type VARCHAR(50) NOT NULL, -- equity, bond, fund, etc.
    sector VARCHAR(100),
    industry VARCHAR(100),
    country VARCHAR(3), -- ISO country code
    currency VARCHAR(3) NOT NULL, -- ISO currency code
    exchange VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table
CREATE TABLE public.trades (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    security_id UUID REFERENCES public.securities(id) NOT NULL,
    trade_date DATE NOT NULL,
    settlement_date DATE,
    trade_type public.trade_type NOT NULL,
    quantity DECIMAL(18,6) NOT NULL,
    price DECIMAL(18,6),
    gross_amount DECIMAL(18,2),
    commission DECIMAL(18,2) DEFAULT 0,
    fees DECIMAL(18,2) DEFAULT 0,
    tax DECIMAL(18,2) DEFAULT 0,
    net_amount DECIMAL(18,2),
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(18,6) DEFAULT 1,
    trade_status public.trade_status DEFAULT 'pending',
    reference_number VARCHAR(100),
    counterparty VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create positions table (current holdings)
CREATE TABLE public.positions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    security_id UUID REFERENCES public.securities(id) NOT NULL,
    quantity DECIMAL(18,6) NOT NULL DEFAULT 0,
    average_cost DECIMAL(18,6),
    market_value DECIMAL(18,2),
    unrealized_pnl DECIMAL(18,2),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(account_id, security_id)
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
    document_type public.document_type NOT NULL,
    document_status public.document_status DEFAULT 'pending',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    storage_path VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expiry_date DATE,
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
    approved_by UUID REFERENCES auth.users(id)
);

-- Create compliance tasks table
CREATE TABLE public.compliance_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(100) NOT NULL,
    priority public.compliance_task_priority DEFAULT 'medium',
    status public.compliance_task_status DEFAULT 'pending',
    due_date DATE,
    assigned_to UUID REFERENCES auth.users(id),
    completed_date TIMESTAMP WITH TIME ZONE,
    completion_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
    compliance_task_id UUID REFERENCES public.compliance_tasks(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general',
    priority public.message_priority DEFAULT 'medium',
    status public.message_status DEFAULT 'unread',
    is_internal BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES public.messages(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_to UUID REFERENCES auth.users(id)
);

-- Create fees table
CREATE TABLE public.fees (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    fee_type public.fee_type NOT NULL,
    fee_description VARCHAR(255) NOT NULL,
    calculation_period_start DATE NOT NULL,
    calculation_period_end DATE NOT NULL,
    fee_rate DECIMAL(8,6), -- percentage rate
    calculated_amount DECIMAL(18,2) NOT NULL,
    billed_amount DECIMAL(18,2),
    currency VARCHAR(3) NOT NULL,
    billing_date DATE,
    payment_date DATE,
    is_paid BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create retrocession table for fee sharing
CREATE TABLE public.retrocessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fee_id UUID REFERENCES public.fees(id) ON DELETE CASCADE NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL, -- 'advisor', 'bank', 'platform', etc.
    retrocession_rate DECIMAL(8,6) NOT NULL, -- percentage of fee
    amount DECIMAL(18,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_date DATE,
    is_paid BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit log table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_client_code ON public.clients(client_code);
CREATE INDEX idx_accounts_client_id ON public.accounts(client_id);
CREATE INDEX idx_accounts_account_number ON public.accounts(account_number);
CREATE INDEX idx_trades_account_id ON public.trades(account_id);
CREATE INDEX idx_trades_trade_date ON public.trades(trade_date);
CREATE INDEX idx_trades_security_id ON public.trades(security_id);
CREATE INDEX idx_positions_account_id ON public.positions(account_id);
CREATE INDEX idx_documents_client_id ON public.documents(client_id);
CREATE INDEX idx_documents_account_id ON public.documents(account_id);
CREATE INDEX idx_compliance_tasks_assigned_to ON public.compliance_tasks(assigned_to);
CREATE INDEX idx_compliance_tasks_due_date ON public.compliance_tasks(due_date);
CREATE INDEX idx_messages_client_id ON public.messages(client_id);
CREATE INDEX idx_messages_assigned_to ON public.messages(assigned_to);
CREATE INDEX idx_fees_account_id ON public.fees(account_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retrocessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
