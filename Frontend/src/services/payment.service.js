import api from './api'

export const paymentService = {
  // Calculate checkout summary
  async getCheckoutSummary(data) {
    const response = await api.post('/checkout/summary', data)
    return response.data
  },

  // Create Stripe checkout session
  async createStripeSession(data) {
    const response = await api.post('/checkout/stripe', data)
    return response.data
  },

  // Create PayPal order
  async createPayPalOrder(data) {
    const response = await api.post('/checkout/paypal', data)
    return response.data
  },

  // Capture PayPal payment
  async capturePayPalPayment(orderId) {
    const response = await api.post('/checkout/paypal/capture', {
      order_id: orderId,
    })
    return response.data
  },
}

export default paymentService
