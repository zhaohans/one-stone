
-- Create storage bucket for documents (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents they have access to" ON storage.objects;
DROP POLICY IF EXISTS "Users can update documents they uploaded" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete documents they uploaded" ON storage.objects;

-- Create RLS policies for document storage
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view documents they have access to" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid() IS NOT NULL AND
  (
    -- Users can see documents they uploaded
    owner = auth.uid() OR
    -- Or documents for accounts/clients they have access to
    name LIKE '%' || auth.uid()::text || '%'
  )
);

CREATE POLICY "Users can update documents they uploaded" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND owner = auth.uid());

CREATE POLICY "Users can delete documents they uploaded" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND owner = auth.uid());

-- Enable RLS on documents table if not already enabled
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents they uploaded" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents they uploaded" ON public.documents;

CREATE POLICY "Users can view documents" ON public.documents
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create documents" ON public.documents
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND uploaded_by = auth.uid());

CREATE POLICY "Users can update documents they uploaded" ON public.documents
FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete documents they uploaded" ON public.documents
FOR DELETE USING (uploaded_by = auth.uid());
