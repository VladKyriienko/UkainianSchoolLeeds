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
      class_photo_galery: {
        Row: {
          class_id: string
          created_at: string
          id: string
          order: number
          photo: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          order?: number
          photo: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          order?: number
          photo?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_photo_galery_class_id_classes_id_fk"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          description: string | null
          description_uk: string | null
          id: string
          order: number
          title: string
          title_uk: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_uk?: string | null
          id?: string
          order?: number
          title: string
          title_uk?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          description_uk?: string | null
          id?: string
          order?: number
          title?: string
          title_uk?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          content_uk: string | null
          created_at: string
          id: string
          title: string
          title_uk: string | null
          type: Database["public"]["Enums"]["typeDocumentEnum"]
        }
        Insert: {
          content: string
          content_uk?: string | null
          created_at?: string
          id?: string
          title: string
          title_uk?: string | null
          type: Database["public"]["Enums"]["typeDocumentEnum"]
        }
        Update: {
          content?: string
          content_uk?: string | null
          created_at?: string
          id?: string
          title?: string
          title_uk?: string | null
          type?: Database["public"]["Enums"]["typeDocumentEnum"]
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          description_uk: string | null
          end_time: string | null
          id: string
          location: string | null
          location_uk: string | null
          start_time: string | null
          title: string
          title_uk: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          description?: string | null
          description_uk?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          location_uk?: string | null
          start_time?: string | null
          title: string
          title_uk?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          description_uk?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          location_uk?: string | null
          start_time?: string | null
          title?: string
          title_uk?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string
          date: string
          description: string | null
          description_uk: string | null
          id: string
          order: number
          photo: string | null
          title: string
          title_uk: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          description?: string | null
          description_uk?: string | null
          id?: string
          order?: number
          photo?: string | null
          title: string
          title_uk?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          description_uk?: string | null
          id?: string
          order?: number
          photo?: string | null
          title?: string
          title_uk?: string | null
        }
        Relationships: []
      }
      organisation_memberships: {
        Row: {
          id: string
          organisation_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          organisation_id: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          organisation_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_memberships_organisation_id_organisations_id_fk"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_memberships_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          created_at: string
          id: string
          name: string
          name_uk: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_uk?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_uk?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["rolesEnum"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["rolesEnum"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["rolesEnum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          category: Database["public"]["Enums"]["teacherCategoryEnum"]
          created_at: string
          description: string | null
          description_uk: string | null
          email: string | null
          id: string
          name: string
          name_uk: string | null
          phone: string | null
          photo: string | null
          title: string | null
          title_uk: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["teacherCategoryEnum"]
          created_at?: string
          description?: string | null
          description_uk?: string | null
          email?: string | null
          id?: string
          name: string
          name_uk?: string | null
          phone?: string | null
          photo?: string | null
          title?: string | null
          title_uk?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["teacherCategoryEnum"]
          created_at?: string
          description?: string | null
          description_uk?: string | null
          email?: string | null
          id?: string
          name?: string
          name_uk?: string | null
          phone?: string | null
          photo?: string | null
          title?: string | null
          title_uk?: string | null
        }
        Relationships: []
      }
      user_uploads: {
        Row: {
          created_at: string
          file_url: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_uploads_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          birthdate: string | null
          full_name: string | null
          id: string
          is_active: boolean
          marketing_consent: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          birthdate?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          marketing_consent?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          birthdate?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          marketing_consent?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      keep_db_active: { Args: never; Returns: undefined }
    }
    Enums: {
      rolesEnum: "admin" | "user"
      teacherCategoryEnum: "HEADTEACHER" | "TEACHER" | "STAF"
      typeDocumentEnum: "COOKIES_POLICY" | "PRIVACY_POLICY" | "DOCUMEND"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      rolesEnum: ["admin", "user"],
      teacherCategoryEnum: ["HEADTEACHER", "TEACHER", "STAF"],
      typeDocumentEnum: ["COOKIES_POLICY", "PRIVACY_POLICY", "DOCUMEND"],
    },
  },
} as const

