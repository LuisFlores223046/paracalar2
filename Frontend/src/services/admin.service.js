import api from './api'

export const adminService = {
  // User Management
  async getUsers(page = 1, limit = 10) {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    })
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  async updateUser(userId, userData) {
    const response = await api.patch(`/admin/users/${userId}`, userData)
    return response.data
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Product Management
  async getProducts(page = 1, limit = 10) {
    const response = await api.get('/admin/products', {
      params: { page, limit },
    })
    return response.data
  },

  async createProduct(productData) {
    const formData = new FormData()

    Object.keys(productData).forEach((key) => {
      if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((image) => {
          formData.append('images', image)
        })
      } else if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key])
      }
    })

    const response = await api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async updateProduct(productId, productData) {
    const response = await api.patch(`/admin/products/${productId}`, productData)
    return response.data
  },

  async deleteProduct(productId) {
    const response = await api.delete(`/admin/products/${productId}`)
    return response.data
  },

  // Analytics
  async getSalesAnalytics(startDate, endDate) {
    const response = await api.get('/analytics/sales', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },

  async getUserBehavior() {
    const response = await api.get('/analytics/user-behavior')
    return response.data
  },

  async getRevenue(startDate, endDate) {
    const response = await api.get('/analytics/revenue', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },

  async getTopProducts(limit = 10) {
    const response = await api.get('/analytics/top-products', {
      params: { limit },
    })
    return response.data
  },
}

export default adminService
