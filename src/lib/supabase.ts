import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          inventory: number
          category_id: string | null
          metadata: any | null
          image_url: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          inventory?: number
          category_id?: string | null
          metadata?: any | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          inventory?: number
          category_id?: string | null
          metadata?: any | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string | null
          label: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          zip_code: string
          country: string
          geolocation: any | null
          is_default: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          label?: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          zip_code: string
          country?: string
          geolocation?: any | null
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          label?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          zip_code?: string
          country?: string
          geolocation?: any | null
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string | null
          product_id: string | null
          quantity: number
          price_snapshot: number
          variant: any | null
          created_at: string | null
        }
        Insert: {
          id?: string
          cart_id?: string | null
          product_id?: string | null
          quantity: number
          price_snapshot: number
          variant?: any | null
          created_at?: string | null
        }
        Update: {
          id?: string
          cart_id?: string | null
          product_id?: string | null
          quantity?: number
          price_snapshot?: number
          variant?: any | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          total_amount: number
          delivery_fee: number | null
          address_snapshot: any
          delivery_instructions: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          total_amount: number
          delivery_fee?: number | null
          address_snapshot: any
          delivery_instructions?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          total_amount?: number
          delivery_fee?: number | null
          address_snapshot?: any
          delivery_instructions?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          price_snapshot: number
          variant: any | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          price_snapshot: number
          variant?: any | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          price_snapshot?: number
          variant?: any | null
          created_at?: string | null
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          created_at?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          rating: number
          review: string | null
          is_featured: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          rating: number
          review?: string | null
          is_featured?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          rating?: number
          review?: string | null
          is_featured?: boolean | null
          created_at?: string | null
        }
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string
          link_url: string | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url: string
          link_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string
          link_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: 'order_update' | 'promotion' | 'system' | 'delivery'
          title: string
          message: string
          read: boolean | null
          metadata: any | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'order_update' | 'promotion' | 'system' | 'delivery'
          title: string
          message: string
          read?: boolean | null
          metadata?: any | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'order_update' | 'promotion' | 'system' | 'delivery'
          title?: string
          message?: string
          read?: boolean | null
          metadata?: any | null
          created_at?: string | null
        }
      }
    }
  }
}