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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          age: number | null
          weight: number | null
          height: number | null
          gender: string | null
          activity_level: string | null
          goals: string[] | null
          dietary_restrictions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          age?: number | null
          weight?: number | null
          height?: number | null
          gender?: string | null
          activity_level?: string | null
          goals?: string[] | null
          dietary_restrictions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          age?: number | null
          weight?: number | null
          height?: number | null
          gender?: string | null
          activity_level?: string | null
          goals?: string[] | null
          dietary_restrictions?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_preferences: {
        Row: {
          id: string
          user_id: string
          workout_type: string | null
          workout_duration: string | null
          workout_days: number | null
          preferred_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_type?: string | null
          workout_duration?: string | null
          workout_days?: number | null
          preferred_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_type?: string | null
          workout_duration?: string | null
          workout_days?: number | null
          preferred_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dietary_preferences: {
        Row: {
          id: string
          user_id: string
          diet_type: string | null
          allergies: string[] | null
          intolerances: string[] | null
          medications: string[] | null
          injuries: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          diet_type?: string | null
          allergies?: string[] | null
          intolerances?: string[] | null
          medications?: string[] | null
          injuries?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          diet_type?: string | null
          allergies?: string[] | null
          intolerances?: string[] | null
          medications?: string[] | null
          injuries?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          meals: boolean | null
          workouts: boolean | null
          progress: boolean | null
          reminders: boolean | null
          achievements: boolean | null
          weekly_reports: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meals?: boolean | null
          workouts?: boolean | null
          progress?: boolean | null
          reminders?: boolean | null
          achievements?: boolean | null
          weekly_reports?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meals?: boolean | null
          workouts?: boolean | null
          progress?: boolean | null
          reminders?: boolean | null
          achievements?: boolean | null
          weekly_reports?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_tracking: {
        Row: {
          id: string
          user_id: string
          weight: number
          body_fat?: number | null
          muscle_mass?: number | null
          measurements?: Json | null
          record_date: string
          notes?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          body_fat?: number | null
          muscle_mass?: number | null
          measurements?: Json | null
          record_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          body_fat?: number | null
          muscle_mass?: number | null
          measurements?: Json | null
          record_date?: string
          notes?: string | null
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
          plan_data: Json
          calories_target: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
          plan_data: Json
          calories_target?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
          plan_data?: Json
          calories_target?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
          plan_data: Json
          duration_minutes: number | null
          difficulty_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
          plan_data: Json
          duration_minutes?: number | null
          difficulty_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
          plan_data?: Json
          duration_minutes?: number | null
          difficulty_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_trial_active: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]]
  : PublicTableNameOrOptions extends keyof DatabaseWithoutInternals["public"]["Tables"]
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions]
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]]["Insert"]
  : PublicTableNameOrOptions extends keyof DatabaseWithoutInternals["public"]["Tables"]
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions]["Insert"]
  : never

export type TablesRow<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]]["Row"]
  : PublicTableNameOrOptions extends keyof DatabaseWithoutInternals["public"]["Tables"]
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions]["Row"]
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]]["Update"]
  : PublicTableNameOrOptions extends keyof DatabaseWithoutInternals["public"]["Tables"]
  ? DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions]["Update"]
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Enums"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Enums"] },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Enums"] }
    ? keyof (DatabaseWithoutInternals["public"]["Enums"])
    : never = never
> = PublicEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals["public"]["Enums"]
}
  ? DatabaseWithoutInternals["public"]["Enums"][PublicEnumNameOrOptions["schema"]][PublicEnumNameOrOptions]
  : PublicEnumNameOrOptions extends keyof DatabaseWithoutInternals["public"]["Enums"]
    ? DatabaseWithoutInternals["public"]["Enums"][PublicEnumNameOrOptions]
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
    Enums: {},
  },
} as const
