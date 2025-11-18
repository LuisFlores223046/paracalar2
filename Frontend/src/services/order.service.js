import api from './api'

export const orderService = {
  // Get user's orders
  async getOrders(page = 1, limit = 10) {
    const response = await api.get('/orders', {
      params: { page, limit },
    })
    return response.data
  },

  // Get order by ID
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  },

  // Create order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}/status`, {
      order_status: status,
    })
    return response.data
  },
}

export default orderService
