export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          plan: string
          stripe_customer_id: string | null
          subscription_status: string
          subscription_id: string | null
          credits_used: number
          credits_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_id?: string | null
          credits_used?: number
          credits_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_id?: string | null
          credits_used?: number
          credits_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      title_generations: {
        Row: {
          id: string
          user_id: string
          input_topic: string
          generated_titles: Json
          thumbnail_texts: Json | null
          style_preferences: Json | null
          ctr_scores: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_topic: string
          generated_titles: Json
          thumbnail_texts?: Json | null
          style_preferences?: Json | null
          ctr_scores?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_topic?: string
          generated_titles?: Json
          thumbnail_texts?: Json | null
          style_preferences?: Json | null
          ctr_scores?: Json | null
          created_at?: string
        }
      }
      saved_titles: {
        Row: {
          id: string
          user_id: string
          title: string
          thumbnail_text: string | null
          topic: string
          style: string
          ctr_score: number | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          thumbnail_text?: string | null
          topic: string
          style: string
          ctr_score?: number | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          thumbnail_text?: string | null
          topic?: string
          style?: string
          ctr_score?: number | null
          is_favorite?: boolean
          created_at?: string
        }
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string
          action: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}