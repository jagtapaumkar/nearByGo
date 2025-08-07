import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']

export interface OrderWithItems extends Order {
  order_items?: Array<OrderItem & {
    product?: {
      id: string
      name: string
      image_url: string | null
    }
  }>
}

export interface CreateOrderData {
  address_id: string
  delivery_instructions?: string
  promo_code?: string
}

export interface OrderFilters {
  status?: Order['status']
  payment_status?: Order['payment_status']
  limit?: number
  offset?: number
}

class OrderService {
  // Create order from cart
  async createOrder(userId: string, orderData: CreateOrderData) {
    try {
      // Get user's cart
      const { data: cart, error: cartError } = await supabase
        .from('carts')
        .select(`
          *,
          cart_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', userId)
        .single()

      if (cartError || !cart || !cart.cart_items?.length) {
        throw new Error('Cart is empty or not found')
      }

      // Get address details
      const { data: address, error: addressError } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', orderData.address_id)
        .eq('user_id', userId)
        .single()

      if (addressError) throw addressError

      // Calculate totals
      const subtotal = cart.cart_items.reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0)
      const delivery_fee = subtotal >= 500 ? 0 : 50 // Free delivery above ₹500
      const total_amount = subtotal + delivery_fee

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount,
          delivery_fee,
          address_snapshot: address,
          delivery_instructions: orderData.delivery_instructions,
          estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.cart_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_snapshot: item.price_snapshot,
        variant: item.variant
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'order_update',
          title: 'Order Placed Successfully',
          message: `Your order #${order.id.slice(-8)} has been placed and will be delivered in 30 minutes.`,
          metadata: { order_id: order.id }
        })

      return { data: order, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user orders
  async getOrders(userId: string, filters: OrderFilters = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(id, name, image_url)
          )
        `)
        .eq('user_id', userId)

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status)
      }

      query = query.order('created_at', { ascending: false })

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get single order
  async getOrder(userId: string, orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(id, name, image_url, price)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status,
          delivered_at: status === 'delivered' ? new Date().toISOString() : null
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Create notification for status update
      if (data.user_id) {
        const statusMessages = {
          pending: 'Your order is being processed',
          processing: 'Your order is being prepared',
          shipped: 'Your order is on the way',
          delivered: 'Your order has been delivered',
          cancelled: 'Your order has been cancelled'
        }

        await supabase
          .from('notifications')
          .insert({
            user_id: data.user_id,
            type: 'order_update',
            title: 'Order Status Updated',
            message: statusMessages[status],
            metadata: { order_id: orderId, status }
          })
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Cancel order
  async cancelOrder(userId: string, orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', userId)
        .eq('status', 'pending') // Only allow cancelling pending orders
        .select()
        .single()

      if (error) throw error

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'order_update',
          title: 'Order Cancelled',
          message: `Your order #${orderId.slice(-8)} has been cancelled successfully.`,
          metadata: { order_id: orderId }
        })

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get order statistics
  async getOrderStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at')
        .eq('user_id', userId)

      if (error) throw error

      const stats = {
        total_orders: data?.length || 0,
        total_spent: data?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
        pending_orders: data?.filter(order => order.status === 'pending').length || 0,
        completed_orders: data?.filter(order => order.status === 'delivered').length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Reorder (create new order from previous order)
  async reorder(userId: string, orderId: string) {
    try {
      // Get original order with items
      const { data: originalOrder, error: orderError } = await this.getOrder(userId, orderId)
      if (orderError || !originalOrder) throw orderError

      // Add items to cart
      for (const item of originalOrder.order_items || []) {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: (await supabase.from('carts').select('id').eq('user_id', userId).single()).data?.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_snapshot: item.product?.price || item.price_snapshot,
            variant: item.variant
          })
      }

      return { data: true, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export const orderService = new OrderService()