import api from './api'

export const loyaltyService = {
  // Get user's loyalty points
  async getPoints() {
    const response = await api.get('/loyalty/points')
    return response.data
  },

  // Get user's loyalty tier
  async getTier() {
    const response = await api.get('/loyalty/tier')
    return response.data
  },

  // Get points history
  async getHistory(page = 1, limit = 10) {
    const response = await api.get('/loyalty/history', {
      params: { page, limit },
    })
    return response.data
  },

  // Redeem coupon
  async redeemCoupon(couponCode) {
    const response = await api.post('/loyalty/redeem-coupon', {
      coupon_code: couponCode,
    })
    return response.data
  },

  // Get tier benefits
  async getTierBenefits(tierId) {
    const response = await api.get('/loyalty/tier-benefits', {
      params: { tier_id: tierId },
    })
    return response.data
  },
}

export default loyaltyService
