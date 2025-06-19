import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useClientOperations } from "@/hooks/useClientOperations";

export interface Client {
  id: string;
  client_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  tax_residence?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  risk_profile?: string;
  kyc_status?: "pending" | "approved" | "rejected" | "expired";
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  user_id?: string;
}

export interface ClientFilters {
  status?: string;
  kyc_status?: string;
  country?: string;
  search?: string;
}

interface ClientsContextType {
  clients: Client[];
  isLoading: boolean;
  refetch: () => void;
  createClient: ReturnType<typeof useClientOperations>["createClient"];
  updateClient: ReturnType<typeof useClientOperations>["updateClient"];
  deleteClient: ReturnType<typeof useClientOperations>["deleteClient"];
  bulkUpdateClients: ReturnType<
    typeof useClientOperations
  >["bulkUpdateClients"];
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createClient, updateClient, deleteClient, bulkUpdateClients } =
    useClientOperations();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const query = supabase.from("clients").select("*");
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // Set up real-time subscription
    const channel = supabase
      .channel("clients-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        fetchClients,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        isLoading,
        refetch: fetchClients,
        createClient,
        updateClient,
        deleteClient,
        bulkUpdateClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context)
    throw new Error("useClientsContext must be used within a ClientsProvider");
  return context;
};
