const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function saveDocumentMetadata(doc) {
  if (!doc.document_type) {
    doc.document_type = 'UNKNOWN';
  }
  const { data, error } = await supabase
    .from('documents')
    .insert([doc]);
  if (error) throw error;
  return data;
}

async function getAllDocumentsMetadata() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data;
}

module.exports = { saveDocumentMetadata, getAllDocumentsMetadata }; 