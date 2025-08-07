import { useState, useEffect } from 'react'
import { cartService, type CartWithItems } from '../services/cart'
import { useAuth } from './useAuth'

export const useCart = () => {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartWithItems | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setCart(null)
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await cartService.getCartWithItems(user.id)
      if (error) throw error
      setCart(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1, variant?: any) => {
    if (!user) throw new Error('Please login to add items to cart')

    setLoading(true)
    setError(null)

    try {
      const { error } = await cartService.addToCart(user.id, {
        product_id: productId,
        quantity,
        variant
      })
      
      if (error) throw error
      await loadCart() // Reload cart after adding item
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await cartService.updateCartItem(user.id, itemId, quantity)
      if (error) throw error
      await loadCart() // Reload cart after updating
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await cartService.removeFromCart(user.id, itemId)
      if (error) throw error
      await loadCart() // Reload cart after removing item
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await cartService.clearCart(user.id)
      if (error) throw error
      await loadCart() // Reload cart after clearing
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCartItemCount = () => {
    return cart?.total_items || 0
  }

  const getCartTotal = () => {
    return cart?.total_amount || 0
  }

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    refreshCart: loadCart
  }
}