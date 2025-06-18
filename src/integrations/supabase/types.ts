export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          account_number: string
          account_status: Database["public"]["Enums"]["account_status"] | null
          account_type: Database["public"]["Enums"]["account_type"]
          base_currency: string | null
          benchmark: string | null
          client_id: string
          closing_date: string | null
          created_at: string
          created_by: string | null
          id: string
          investment_objective: string | null
          opening_date: string
          risk_tolerance: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          account_status?: Database["public"]["Enums"]["account_status"] | null
          account_type: Database["public"]["Enums"]["account_type"]
          base_currency?: string | null
          benchmark?: string | null
          client_id: string
          closing_date?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          investment_objective?: string | null
          opening_date?: string
          risk_tolerance?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          account_status?: Database["public"]["Enums"]["account_status"] | null
          account_type?: Database["public"]["Enums"]["account_type"]
          base_currency?: string | null
          benchmark?: string | null
          client_id?: string
          closing_date?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          investment_objective?: string | null
          opening_date?: string
          risk_tolerance?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          client_code: string
          country: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          kyc_status: Database["public"]["Enums"]["document_status"] | null
          last_name: string
          nationality: string | null
          phone: string | null
          postal_code: string | null
          risk_profile: string | null
          state: string | null
          tax_residence: string | null
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_code: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email: string
          first_name: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["document_status"] | null
          last_name: string
          nationality?: string | null
          phone?: string | null
          postal_code?: string | null
          risk_profile?: string | null
          state?: string | null
          tax_residence?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_code?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["document_status"] | null
          last_name?: string
          nationality?: string | null
          phone?: string | null
          postal_code?: string | null
          risk_profile?: string | null
          state?: string | null
          tax_residence?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_tasks: {
        Row: {
          account_id: string | null
          assigned_to: string | null
          client_id: string | null
          completed_date: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority:
            | Database["public"]["Enums"]["compliance_task_priority"]
            | null
          status: Database["public"]["Enums"]["compliance_task_status"] | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?:
            | Database["public"]["Enums"]["compliance_task_priority"]
            | null
          status?: Database["public"]["Enums"]["compliance_task_status"] | null
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?:
            | Database["public"]["Enums"]["compliance_task_priority"]
            | null
          status?: Database["public"]["Enums"]["compliance_task_status"] | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          account_id: string | null
          approved_by: string | null
          client_id: string | null
          created_at: string
          description: string | null
          document_status: Database["public"]["Enums"]["document_status"] | null
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date: string | null
          file_name: string
          file_size: number | null
          id: string
          is_confidential: boolean | null
          mime_type: string | null
          storage_path: string
          title: string
          trade_id: string | null
          updated_at: string
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          account_id?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          document_status?:
            | Database["public"]["Enums"]["document_status"]
            | null
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          storage_path: string
          title: string
          trade_id?: string | null
          updated_at?: string
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          account_id?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          document_status?:
            | Database["public"]["Enums"]["document_status"]
            | null
          document_type?: Database["public"]["Enums"]["document_type"]
          expiry_date?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          storage_path?: string
          title?: string
          trade_id?: string | null
          updated_at?: string
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          account_id: string
          billed_amount: number | null
          billing_date: string | null
          calculated_amount: number
          calculation_period_end: string
          calculation_period_start: string
          created_at: string
          created_by: string
          currency: string
          fee_description: string
          fee_rate: number | null
          fee_type: Database["public"]["Enums"]["fee_type"]
          id: string
          is_paid: boolean | null
          notes: string | null
          payment_date: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          billed_amount?: number | null
          billing_date?: string | null
          calculated_amount: number
          calculation_period_end: string
          calculation_period_start: string
          created_at?: string
          created_by: string
          currency: string
          fee_description: string
          fee_rate?: number | null
          fee_type: Database["public"]["Enums"]["fee_type"]
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_date?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          billed_amount?: number | null
          billing_date?: string | null
          calculated_amount?: number
          calculation_period_end?: string
          calculation_period_start?: string
          created_at?: string
          created_by?: string
          currency?: string
          fee_description?: string
          fee_rate?: number | null
          fee_type?: Database["public"]["Enums"]["fee_type"]
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          account_id: string | null
          assigned_to: string | null
          client_id: string | null
          compliance_task_id: string | null
          content: string
          created_at: string
          created_by: string
          id: string
          is_internal: boolean | null
          message_type: string | null
          parent_message_id: string | null
          priority: Database["public"]["Enums"]["message_priority"] | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string
          trade_id: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          compliance_task_id?: string | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_internal?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          priority?: Database["public"]["Enums"]["message_priority"] | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject: string
          trade_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          compliance_task_id?: string | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_internal?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          priority?: Database["public"]["Enums"]["message_priority"] | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string
          trade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_compliance_task_id_fkey"
            columns: ["compliance_task_id"]
            isOneToOne: false
            referencedRelation: "compliance_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          account_id: string
          average_cost: number | null
          id: string
          last_updated: string
          market_value: number | null
          quantity: number
          security_id: string
          unrealized_pnl: number | null
        }
        Insert: {
          account_id: string
          average_cost?: number | null
          id?: string
          last_updated?: string
          market_value?: number | null
          quantity?: number
          security_id: string
          unrealized_pnl?: number | null
        }
        Update: {
          account_id?: string
          average_cost?: number | null
          id?: string
          last_updated?: string
          market_value?: number | null
          quantity?: number
          security_id?: string
          unrealized_pnl?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_security_id_fkey"
            columns: ["security_id"]
            isOneToOne: false
            referencedRelation: "securities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          email_confirmed_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          office_number: string | null
          phone: string | null
          position: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          email_confirmed_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          office_number?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          email_confirmed_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          office_number?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      retrocessions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          fee_id: string
          id: string
          is_paid: boolean | null
          notes: string | null
          payment_date: string | null
          recipient_name: string
          recipient_type: string
          retrocession_rate: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          fee_id: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_date?: string | null
          recipient_name: string
          recipient_type: string
          retrocession_rate: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          fee_id?: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_date?: string | null
          recipient_name?: string
          recipient_type?: string
          retrocession_rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retrocessions_fee_id_fkey"
            columns: ["fee_id"]
            isOneToOne: false
            referencedRelation: "fees"
            referencedColumns: ["id"]
          },
        ]
      }
      securities: {
        Row: {
          country: string | null
          created_at: string
          currency: string
          cusip: string | null
          exchange: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          isin: string | null
          name: string
          sector: string | null
          security_type: string
          symbol: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          currency: string
          cusip?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          isin?: string | null
          name: string
          sector?: string | null
          security_type: string
          symbol: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          currency?: string
          cusip?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          isin?: string | null
          name?: string
          sector?: string | null
          security_type?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_id: string
          commission: number | null
          counterparty: string | null
          created_at: string
          created_by: string | null
          currency: string
          exchange_rate: number | null
          fees: number | null
          gross_amount: number | null
          id: string
          net_amount: number | null
          notes: string | null
          price: number | null
          quantity: number
          reference_number: string | null
          security_id: string
          settlement_date: string | null
          tax: number | null
          trade_date: string
          trade_status: Database["public"]["Enums"]["trade_status"] | null
          trade_type: Database["public"]["Enums"]["trade_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_id: string
          commission?: number | null
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          currency: string
          exchange_rate?: number | null
          fees?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          price?: number | null
          quantity: number
          reference_number?: string | null
          security_id: string
          settlement_date?: string | null
          tax?: number | null
          trade_date: string
          trade_status?: Database["public"]["Enums"]["trade_status"] | null
          trade_type: Database["public"]["Enums"]["trade_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_id?: string
          commission?: number | null
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          exchange_rate?: number | null
          fees?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          price?: number | null
          quantity?: number
          reference_number?: string | null
          security_id?: string
          settlement_date?: string | null
          tax?: number | null
          trade_date?: string
          trade_status?: Database["public"]["Enums"]["trade_status"] | null
          trade_type?: Database["public"]["Enums"]["trade_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_security_id_fkey"
            columns: ["security_id"]
            isOneToOne: false
            referencedRelation: "securities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_attempts: {
        Row: {
          created_at: string
          email: string
          failed_attempts: number
          id: string
          last_attempt: string
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          failed_attempts?: number
          id?: string
          last_attempt?: string
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          failed_attempts?: number
          id?: string
          last_attempt?: string
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string
          data: Json | null
          id: string
          step: Database["public"]["Enums"]["onboarding_step"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          step: Database["public"]["Enums"]["onboarding_step"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          step?: Database["public"]["Enums"]["onboarding_step"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          language: string
          notifications_enabled: boolean
          preferences: Json | null
          theme: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          notifications_enabled?: boolean
          preferences?: Json | null
          theme?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          notifications_enabled?: boolean
          preferences?: Json | null
          theme?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_verify_user_email: {
        Args: { user_id_to_verify: string }
        Returns: boolean
      }
      approve_user: {
        Args: { user_id_to_approve: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_auth_status: {
        Args: { user_id_param: string }
        Returns: {
          is_email_verified: boolean
          is_approved: boolean
          is_onboarded: boolean
          user_role: Database["public"]["Enums"]["app_role"]
          user_status: Database["public"]["Enums"]["user_status"]
        }[]
      }
      handle_failed_login: {
        Args: { user_email: string }
        Returns: undefined
      }
      is_account_locked: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reject_user: {
        Args: { user_id_to_reject: string }
        Returns: boolean
      }
      reset_failed_login_attempts: {
        Args: { user_email: string }
        Returns: undefined
      }
      sync_email_verification: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      account_status: "active" | "inactive" | "suspended" | "closed"
      account_type:
        | "individual"
        | "joint"
        | "corporate"
        | "trust"
        | "retirement"
      app_role: "admin" | "user"
      compliance_task_priority: "low" | "medium" | "high" | "critical"
      compliance_task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "overdue"
        | "escalated"
      document_status: "pending" | "approved" | "rejected" | "expired"
      document_type:
        | "kyc"
        | "account_opening"
        | "trade_confirmation"
        | "statement"
        | "tax_document"
        | "compliance"
        | "other"
      fee_type:
        | "management"
        | "performance"
        | "transaction"
        | "custody"
        | "retrocession"
        | "other"
      message_priority: "low" | "medium" | "high" | "urgent"
      message_status: "unread" | "read" | "archived" | "deleted"
      onboarding_step:
        | "profile_completion"
        | "preferences_setup"
        | "tutorial_completion"
      trade_status: "pending" | "executed" | "settled" | "cancelled" | "failed"
      trade_type:
        | "buy"
        | "sell"
        | "transfer_in"
        | "transfer_out"
        | "dividend"
        | "fee"
      user_status: "active" | "inactive" | "suspended" | "pending_approval"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive", "suspended", "closed"],
      account_type: ["individual", "joint", "corporate", "trust", "retirement"],
      app_role: ["admin", "user"],
      compliance_task_priority: ["low", "medium", "high", "critical"],
      compliance_task_status: [
        "pending",
        "in_progress",
        "completed",
        "overdue",
        "escalated",
      ],
      document_status: ["pending", "approved", "rejected", "expired"],
      document_type: [
        "kyc",
        "account_opening",
        "trade_confirmation",
        "statement",
        "tax_document",
        "compliance",
        "other",
      ],
      fee_type: [
        "management",
        "performance",
        "transaction",
        "custody",
        "retrocession",
        "other",
      ],
      message_priority: ["low", "medium", "high", "urgent"],
      message_status: ["unread", "read", "archived", "deleted"],
      onboarding_step: [
        "profile_completion",
        "preferences_setup",
        "tutorial_completion",
      ],
      trade_status: ["pending", "executed", "settled", "cancelled", "failed"],
      trade_type: [
        "buy",
        "sell",
        "transfer_in",
        "transfer_out",
        "dividend",
        "fee",
      ],
      user_status: ["active", "inactive", "suspended", "pending_approval"],
    },
  },
} as const
