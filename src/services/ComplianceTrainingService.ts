// ComplianceTrainingService: API integration for compliance training management
// Replace fetch/axios URLs with your backend endpoints

import { supabase } from "@/integrations/supabase/client";

const TABLE = "compliance_training";
const BUCKET = "trainingproofs";

/**
 * Fetch all training records (optionally filtered)
 * @param {object} filters
 */
export async function fetchAllTrainingRecords(filters = {}) {
  let query = supabase.from(TABLE).select("*");
  // Add filters if needed
  if (filters.department && filters.department !== "all") {
    query = query.eq("department", filters.department);
  }
  if (filters.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }
  if (filters.type && filters.type !== "all") {
    query = query.eq("training_type", filters.type);
  }
  if (filters.search) {
    query = query.ilike("employee_name", `%${filters.search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Create a new training record
 * @param {object} data
 */
export async function createTrainingRecord(data) {
  const { data: record, error } = await supabase.from(TABLE).insert([data]).select().single();
  if (error) throw error;
  return record;
}

/**
 * Update a training record
 * @param {string|number} id
 * @param {object} data
 */
export async function updateTrainingRecord(id, data) {
  const { data: record, error } = await supabase.from(TABLE).update(data).eq("id", id).select().single();
  if (error) throw error;
  return record;
}

/**
 * Delete a training record
 * @param {string|number} id
 */
export async function deleteTrainingRecord(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

/**
 * Search training records
 * @param {string} query
 */
export async function searchTrainingRecords(query) {
  return fetchAllTrainingRecords({ search: query });
}

/**
 * Export training records (CSV/PDF)
 * @param {object} filters
 */
export async function exportTrainingRecords(filters = {}) {
  // Fetch all records and convert to CSV
  const records = await fetchAllTrainingRecords(filters);
  const header = 'employee_name,department,role,status,last_training_date,next_due_date,provider,proof_url\n';
  const rows = records.map(r => `${r.employee_name},${r.department},${r.role},${r.status},${r.last_training_date},${r.next_due_date},${r.provider},${r.proof_url || ''}`).join('\n');
  const csv = header + rows;
  // Create a Blob and return a download URL
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  return { url };
}

/**
 * Trigger reminders for expiring/expired training
 */
export async function triggerTrainingReminders() {
  // Placeholder: implement reminder logic if needed
  return { success: true };
}

export async function uploadProof(id, file) {
  const filePath = `${id}/${file.name}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(filePath, file, { upsert: true });
  if (error) throw error;
  // Update record with proof URL
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
  await updateTrainingRecord(id, { proof_url: publicUrl });
  return { url: publicUrl };
}
