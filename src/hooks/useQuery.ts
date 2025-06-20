import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useSupabaseQuery<T>(
  queryKey: string[],
  table: string,
  options?: UseQueryOptions<T[], Error>,
) {
  return useQuery<T[], Error>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;
      return data as T[];
    },
    ...options,
  });
}

export function useSupabaseQueryById<T>(
  queryKey: string[],
  table: string,
  id: string,
  options?: UseQueryOptions<T, Error>,
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return data as T;
    },
    ...options,
  });
}
