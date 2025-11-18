import api from './api'

export const analyticsService = {
  // Get sales analytics
  async getSalesAnalytics(startDate, endDate) {
    const response = await api.get('/analytics/sales', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },

  // Get user behavior analytics
  async getUserBehavior() {
    const response = await api.get('/analytics/user-behavior')
    return response.data
  },

  // Get revenue analytics
  async getRevenue(startDate, endDate) {
    const response = await api.get('/analytics/revenue', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },

  // Get top products
  async getTopProducts(limit = 10) {
    const response = await api.get('/analytics/top-products', {
      params: { limit },
    })
    return response.data
  },
}

export default analyticsService
