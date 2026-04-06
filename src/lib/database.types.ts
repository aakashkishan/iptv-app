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
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          theme: string
          channel_view: string
          player_autoplay: boolean
          player_volume: number
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          theme?: string
          channel_view?: string
          player_autoplay?: boolean
          player_volume?: number
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          theme?: string
          channel_view?: string
          player_autoplay?: boolean
          player_volume?: number
        }
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string
          channels: Json
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url?: string
          channels?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string
          channels?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          channel_id: string
          channel_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel_id: string
          channel_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel_id?: string
          channel_data?: Json
          created_at?: string
        }
      }
      recently_watched: {
        Row: {
          id: string
          user_id: string
          channel_id: string
          channel_data: Json
          watched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel_id: string
          channel_data: Json
          watched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel_id?: string
          channel_data?: Json
          watched_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
