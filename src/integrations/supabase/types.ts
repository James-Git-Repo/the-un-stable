export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      Articles: {
        Row: {
          author: string
          content: string
          created_at: string
          id: number
          image_url: string | null
          published_at: string
          read_time: string
          slug: string
          subtitle: string | null
          tag: string
          title: string
        }
        Insert: {
          author?: string
          content?: string
          created_at?: string
          id?: number
          image_url?: string | null
          published_at?: string
          read_time?: string
          slug?: string
          subtitle?: string | null
          tag?: string
          title?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: number
          image_url?: string | null
          published_at?: string
          read_time?: string
          slug?: string
          subtitle?: string | null
          tag?: string
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          article_id: number
          content: string
          created_at: string
          id: string
          user_email: string
          user_name: string
        }
        Insert: {
          article_id: number
          content: string
          created_at?: string
          id?: string
          user_email: string
          user_name: string
        }
        Update: {
          article_id?: number
          content?: string
          created_at?: string
          id?: string
          user_email?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "Articles"
            referencedColumns: ["id"]
          },
        ]
      }
      Contributions: {
        Row: {
          article_summary: string | null
          article_topic: string | null
          created_at: string
          email: string | null
          id: number
          name: string | null
          policy_agreement: boolean | null
        }
        Insert: {
          article_summary?: string | null
          article_topic?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          policy_agreement?: boolean | null
        }
        Update: {
          article_summary?: string | null
          article_topic?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          policy_agreement?: boolean | null
        }
        Relationships: []
      }
      Covers: {
        Row: {
          category: string | null
          created_at: string
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      "Newsletter Sub": {
        Row: {
          created_at: string
          email: string | null
          id: number
          policy_agreement: boolean | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          policy_agreement?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          policy_agreement?: boolean | null
        }
        Relationships: []
      }
      Questions: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
          question: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          question?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          question?: string | null
        }
        Relationships: []
      }
      Resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: number
          metadata: string | null
          sort_order: number | null
          title: string
          url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: never
          metadata?: string | null
          sort_order?: number | null
          title: string
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: never
          metadata?: string | null
          sort_order?: number | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
