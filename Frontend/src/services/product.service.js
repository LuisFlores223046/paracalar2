import api from './api'

export const productService = {
  // Get product by ID
  async getProduct(productId) {
    const response = await api.get(`/products/${productId}`)
    return response.data
  },

  // Get related products
  async getRelatedProducts(productId) {
    const response = await api.get(`/products/${productId}/related`)
    return response.data
  },

  // Get product reviews
  async getProductReviews(productId, page = 1, limit = 10) {
    const response = await api.get(`/products/${productId}/reviews`, {
      params: { page, limit },
    })
    return response.data
  },

  // Create product review
  async createReview(productId, rating, comment) {
    const response = await api.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    })
    return response.data
  },

  // Search products
  async searchProducts(params = {}) {
    const response = await api.get('/search', { params })
    return response.data
  },
}

export default productService
