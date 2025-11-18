import api from './api'

export const paymentMethodService = {
  // Get user's payment methods
  async getPaymentMethods() {
    const response = await api.get('/payment-methods')
    return response.data
  },

  // Create payment method
  async createPaymentMethod(data) {
    const response = await api.post('/payment-methods', data)
    return response.data
  },

  // Delete payment method
  async deletePaymentMethod(methodId) {
    const response = await api.delete(`/payment-methods/${methodId}`)
    return response.data
  },
}

export default paymentMethodService
