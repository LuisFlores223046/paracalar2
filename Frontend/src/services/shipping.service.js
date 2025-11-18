import api from './api'

export const shippingService = {
  // Get shipment tracking
  async getTracking(orderId) {
    const response = await api.get(`/shipping/tracking/${orderId}`)
    return response.data
  },

  // Calculate shipping cost
  async calculateShipping(data) {
    const response = await api.post('/shipping/calculate', data)
    return response.data
  },
}

export default shippingService
