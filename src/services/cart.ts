import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Cart = Database['public']['Tables']['carts']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row']

export interface CartItemWithProduct extends CartItem {
  product?: {
    id: string
    name: string
    price: number
    image_url: string | null
    inventory: number
  }
}

export interface CartWithItems extends Cart {
  cart_items?: CartItemWithProduct[]
  total_amount?: number
  total_items?: number
}

export interface AddToCartData {
  product_id: string
  quantity: number
  variant?: any
}

class CartService {
  // Get or create cart for user
  async getOrCreateCart(userId: string) {
    try {
      // First try to get existing cart
      let { data: cart, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .single()

      // If no cart exists, create one
      if (error && error.code === 'PGRST116') {
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({
            user_id: userId,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          })
          .select()
          .single()

        if (createError) throw createError
        cart = newCart
      } else if (error) {
        throw error
      }

      return { data: cart, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get cart with items
  async getCartWithItems(userId: string) {
    try {
      const { data: cart, error: cartError } = await this.getOrCreateCart(userId)
      if (cartError || !cart) throw cartError

      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            id,
            name,
            price,
            image_url,
            inventory
          )
        `)
        .eq('cart_id', cart.id)

      if (itemsError) throw itemsError

      // Calculate totals
      const total_amount = cartItems?.reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0) || 0
      const total_items = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

      return {
        data: {
          ...cart,
          cart_items: cartItems,
          total_amount,
          total_items
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Add item to cart
  async addToCart(userId: string, { product_id, quantity, variant }: AddToCartData) {
    try {
      // Get or create cart
      const { data: cart, error: cartError } = await this.getOrCreateCart(userId)
      if (cartError || !cart) throw cartError

      // Get product details for price snapshot
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('price, inventory')
        .eq('id', product_id)
        .single()

      if (productError) throw productError

      // Check if item already exists in cart
      const { data: existingItem, error: existingError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', product_id)
        .eq('variant', JSON.stringify(variant || {}))
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError
      }

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id,
            quantity,
            price_snapshot: product.price,
            variant: variant || {}
          })
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update cart item quantity
  async updateCartItem(userId: string, itemId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(userId, itemId)
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Clear cart
  async clearCart(userId: string) {
    try {
      const { data: cart, error: cartError } = await this.getOrCreateCart(userId)
      if (cartError || !cart) throw cartError

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get cart total
  async getCartTotal(userId: string) {
    try {
      const { data: cart, error: cartError } = await this.getOrCreateCart(userId)
      if (cartError || !cart) throw cartError

      const { data, error } = await supabase
        .rpc('get_cart_total', { cart_id: cart.id })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get cart item count
  async getCartItemCount(userId: string) {
    try {
      const { data: cart, error: cartError } = await this.getOrCreateCart(userId)
      if (cartError || !cart) return { data: 0, error: null }

      const { count, error } = await supabase
        .from('cart_items')
        .select('quantity', { count: 'exact' })
        .eq('cart_id', cart.id)

      if (error) throw error

      // Sum up all quantities
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('cart_id', cart.id)

      if (itemsError) throw itemsError

      const totalCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      return { data: totalCount, error: null }
    } catch (error) {
      return { data: 0, error }
    }
  }
}

export const cartService = new CartService()