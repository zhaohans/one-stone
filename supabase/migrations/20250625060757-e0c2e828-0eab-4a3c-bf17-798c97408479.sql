
-- Create signatories table (referenced in existing code)
CREATE TABLE IF NOT EXISTS public.signatories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('primary', 'secondary', 'authorized_user', 'view_only')),
  phone VARCHAR(50),
  address TEXT,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to signatories
ALTER TABLE public.signatories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the signatories table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signatories' 
    AND policyname = 'Users can view signatories for their accounts'
  ) THEN
    CREATE POLICY "Users can view signatories for their accounts" ON public.signatories
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.accounts a
          JOIN public.clients c ON a.client_id = c.id
          WHERE a.id = signatories.account_id 
          AND (c.created_by = auth.uid() OR c.updated_by = auth.uid() OR c.user_id = auth.uid())
        ) OR public.is_admin()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signatories' 
    AND policyname = 'Users can create signatories for their accounts'
  ) THEN
    CREATE POLICY "Users can create signatories for their accounts" ON public.signatories
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.accounts a
          JOIN public.clients c ON a.client_id = c.id
          WHERE a.id = signatories.account_id 
          AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signatories' 
    AND policyname = 'Users can update signatories for their accounts'
  ) THEN
    CREATE POLICY "Users can update signatories for their accounts" ON public.signatories
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.accounts a
          JOIN public.clients c ON a.client_id = c.id
          WHERE a.id = signatories.account_id 
          AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
        ) OR public.is_admin()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signatories' 
    AND policyname = 'Users can delete signatories for their accounts'
  ) THEN
    CREATE POLICY "Users can delete signatories for their accounts" ON public.signatories
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM public.accounts a
          JOIN public.clients c ON a.client_id = c.id
          WHERE a.id = signatories.account_id 
          AND (c.created_by = auth.uid() OR c.updated_by = auth.uid())
        ) OR public.is_admin()
      );
  END IF;
END $$;

-- Add some sample signatories data only if table is empty
INSERT INTO public.signatories (account_id, name, email, role, phone, address)
SELECT 
  a.id,
  c.first_name || ' ' || c.last_name,
  c.email,
  'primary',
  c.phone,
  COALESCE(c.address_line1, '') || CASE WHEN c.city IS NOT NULL THEN ', ' || c.city ELSE '' END
FROM public.accounts a
JOIN public.clients c ON a.client_id = c.id
WHERE NOT EXISTS (SELECT 1 FROM public.signatories LIMIT 1)
LIMIT 5;
