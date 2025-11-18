import { createContext, useContext, useState, useEffect } from 'react'
import { cartService } from '../services/cart.service'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await cartService.getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const updatedCart = await cartService.addItem(productId, quantity)
      setCart(updatedCart)
      toast.success('Product added to cart!')
      return updatedCart
    } catch (error) {
      toast.error(error.message || 'Failed to add product to cart')
      throw error
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const updatedCart = await cartService.updateItem(itemId, quantity)
      setCart(updatedCart)
      toast.success('Cart updated!')
      return updatedCart
    } catch (error) {
      toast.error(error.message || 'Failed to update cart')
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeItem(itemId)
      await fetchCart()
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(error.message || 'Failed to remove item')
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartService.clearCart()
      setCart(null)
      toast.success('Cart cleared')
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart')
      throw error
    }
  }

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
