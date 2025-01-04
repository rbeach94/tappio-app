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
      nfc_codes: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          code: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      nfc_profiles: {
        Row: {
          code_id: string
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          linkedin_url: string | null
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          code_id: string
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          code_id?: string
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nfc_profiles_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "nfc_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          id: string
        }
        Insert: {
          email?: string | null
          id: string
        }
        Update: {
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_nfc_codes: {
        Args: {
          count: number
          admin_id: string
        }
        Returns: {
          assigned_at: string | null
          assigned_to: string | null
          code: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
        }[]
      }
      generate_unique_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
