export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          sku: string | null;
          status: string;
          price_cents: number | null;
          category: string | null;
          description: string | null;
          reason: string | null;
          image_url: string | null;
          sort_order: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          sku?: string | null;
          status?: string;
          price_cents?: number | null;
          category?: string | null;
          description?: string | null;
          reason?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      lost_objects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          object_type: string;
          description: string | null;
          meaning: string | null;
          status: string;
          image_url: string | null;
          unlock_code: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          object_type?: string;
          description?: string | null;
          meaning?: string | null;
          status?: string;
          image_url?: string | null;
          unlock_code?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['lost_objects']['Insert']>;
      };
      news_items: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body: string | null;
          category: string;
          byline: string;
          is_true: boolean | null;
          is_public: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body?: string | null;
          category?: string;
          byline?: string;
          is_true?: boolean | null;
          is_public?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['news_items']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          alias: string | null;
          employee_id: string | null;
          department: string | null;
          role_name: string | null;
          assigned_object_slug: string | null;
          house_rule: string | null;
          uniform_recommendation_slug: string | null;
          preferred_light: string | null;
          preferred_place: string | null;
          shift_status: string;
          clocked_out_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          alias?: string | null;
          employee_id?: string | null;
          department?: string | null;
          role_name?: string | null;
          assigned_object_slug?: string | null;
          house_rule?: string | null;
          uniform_recommendation_slug?: string | null;
          preferred_light?: string | null;
          preferred_place?: string | null;
          shift_status?: string;
          clocked_out_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      after_hours_profiles: {
        Row: {
          id: string;
          user_id: string;
          player_alias: string | null;
          fake_handicap: number | null;
          preferred_light: string | null;
          signature_object: string | null;
          assigned_table: string | null;
          after_hours_status: string;
          regular_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          player_alias?: string | null;
          fake_handicap?: number | null;
          preferred_light?: string | null;
          signature_object?: string | null;
          assigned_table?: string | null;
          after_hours_status?: string;
          regular_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['after_hours_profiles']['Insert']>;
      };
      saved_artifacts: {
        Row: { id: string; user_id: string; artifact_type: string; artifact_slug: string; notes: string | null; created_at: string };
        Insert: { id?: string; user_id: string; artifact_type: string; artifact_slug: string; notes?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['saved_artifacts']['Insert']>;
      };
      tournaments: {
        Row: { id: string; slug: string; name: string; status: string; location: string | null; starts_at: string | null; description: string | null; is_public: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; name: string; status?: string; location?: string | null; starts_at?: string | null; description?: string | null; is_public?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['tournaments']['Insert']>;
      };
      tournament_registrations: {
        Row: { id: string; tournament_id: string | null; user_id: string | null; player_alias: string | null; answers: Json; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; tournament_id?: string | null; user_id?: string | null; player_alias?: string | null; answers?: Json; status?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['tournament_registrations']['Insert']>;
      };
      phone_messages: {
        Row: { id: string; slug: string; from_label: string; message_type: string; body: string; received_at: string; unlock_level: number; is_public: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; from_label: string; message_type?: string; body: string; received_at?: string; unlock_level?: number; is_public?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['phone_messages']['Insert']>;
      };
      wall_posts: {
        Row: { id: string; user_id: string | null; alias: string | null; body: string; x: number | null; y: number | null; rotation: number | null; is_approved: boolean; created_at: string };
        Insert: { id?: string; user_id?: string | null; alias?: string | null; body: string; x?: number | null; y?: number | null; rotation?: number | null; is_approved?: boolean; created_at?: string };
        Update: Partial<Database['public']['Tables']['wall_posts']['Insert']>;
      };
      ventures: {
        Row: { id: string; slug: string; name: string; status: string; description: string | null; memo: string | null; is_public: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; name: string; status?: string; description?: string | null; memo?: string | null; is_public?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['ventures']['Insert']>;
      };
      radio_logs: {
        Row: { id: string; title: string; body: string | null; aired_at: string; created_at: string };
        Insert: { id?: string; title: string; body?: string | null; aired_at?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['radio_logs']['Insert']>;
      };
      secrets: {
        Row: { id: string; slug: string; level: number; clue: string | null; payload: Json; is_active: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; level?: number; clue?: string | null; payload?: Json; is_active?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['secrets']['Insert']>;
      };
      user_secrets: {
        Row: { id: string; user_id: string; secret_id: string; unlocked_at: string };
        Insert: { id?: string; user_id: string; secret_id: string; unlocked_at?: string };
        Update: Partial<Database['public']['Tables']['user_secrets']['Insert']>;
      };
      site_events: {
        Row: { id: string; user_id: string | null; event_name: string; path: string | null; payload: Json; created_at: string };
        Insert: { id?: string; user_id?: string | null; event_name: string; path?: string | null; payload?: Json; created_at?: string };
        Update: Partial<Database['public']['Tables']['site_events']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
