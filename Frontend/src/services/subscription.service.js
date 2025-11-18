import api from './api'

export const subscriptionService = {
  // Get user's subscriptions
  async getSubscriptions() {
    const response = await api.get('/subscriptions')
    return response.data
  },

  // Create subscription
  async createSubscription(data) {
    const response = await api.post('/subscriptions', data)
    return response.data
  },

  // Update subscription status
  async updateSubscriptionStatus(subscriptionId, status) {
    const response = await api.patch(`/subscriptions/${subscriptionId}/status`, {
      subscription_status: status,
    })
    return response.data
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    const response = await api.delete(`/subscriptions/${subscriptionId}`)
    return response.data
  },
}

export default subscriptionService
