import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { address_id, delivery_instructions, promo_code } = await req.json()

    // Get user's cart with items
    const { data: cart, error: cartError } = await supabaseClient
      .from('carts')
      .select(`
        *,
        cart_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (cartError || !cart || !cart.cart_items?.length) {
      throw new Error('Cart is empty or not found')
    }

    // Get address details
    const { data: address, error: addressError } = await supabaseClient
      .from('addresses')
      .select('*')
      .eq('id', address_id)
      .eq('user_id', user.id)
      .single()

    if (addressError) throw addressError

    // Calculate totals
    const subtotal = cart.cart_items.reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0)
    let discount = 0
    
    // Apply promo code if provided
    if (promo_code) {
      // Simple promo code logic - in production, you'd have a promo_codes table
      if (promo_code === 'FIRST10') {
        discount = subtotal * 0.1 // 10% discount
      } else if (promo_code === 'SAVE50') {
        discount = Math.min(50, subtotal * 0.05) // ₹50 or 5% whichever is less
      }
    }

    const delivery_fee = subtotal >= 500 ? 0 : 50 // Free delivery above ₹500
    const total_amount = subtotal - discount + delivery_fee

    // Check inventory for all items
    for (const item of cart.cart_items) {
      if (item.product.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for ${item.product.name}`)
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount,
        delivery_fee,
        address_snapshot: address,
        delivery_instructions,
        estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        metadata: {
          subtotal,
          discount,
          promo_code
        }
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items and update inventory
    for (const item of cart.cart_items) {
      // Create order item
      await supabaseClient
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_snapshot: item.price_snapshot,
          variant: item.variant
        })

      // Update product inventory
      await supabaseClient
        .from('products')
        .update({
          inventory: item.product.inventory - item.quantity
        })
        .eq('id', item.product_id)
    }

    // Clear cart
    await supabaseClient
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'order_update',
        title: 'Order Placed Successfully',
        message: `Your order #${order.id.slice(-8)} has been placed and will be delivered in 30 minutes.`,
        metadata: { order_id: order.id }
      })

    return new Response(
      JSON.stringify({ 
        order,
        message: 'Order created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})