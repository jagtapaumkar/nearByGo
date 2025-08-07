import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Wishlist = Database['public']['Tables']['wishlists']['Row']

export interface WishlistWithProduct extends Wishlist {
  product?: {
    id: string
    name: string
    price: number
    image_url: string | null
    inventory: number
    category?: {
      name: string
    }
  }
}

class WishlistService {
  // Get user's wishlist
  async getWishlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:products(
            id,
            name,
            price,
            image_url,
            inventory,
            category:categories(name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Add product to wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          product_id: productId
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Check if product is in wishlist
  async isInWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { data: !!data, error: null }
    } catch (error) {
      return { data: false, error }
    }
  }

  // Toggle wishlist status
  async toggleWishlist(userId: string, productId: string) {
    try {
      const { data: isInWishlist } = await this.isInWishlist(userId, productId)
      
      if (isInWishlist) {
        return await this.removeFromWishlist(userId, productId)
      } else {
        return await this.addToWishlist(userId, productId)
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get wishlist count
  async getWishlistCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) throw error
      return { data: count || 0, error: null }
    } catch (error) {
      return { data: 0, error }
    }
  }

  // Clear wishlist
  async clearWishlist(userId: string) {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}

export const wishlistService = new WishlistService()