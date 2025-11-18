import api from './api'

export const addressService = {
  // Get user's addresses
  async getAddresses() {
    const response = await api.get('/addresses')
    return response.data
  },

  // Create address
  async createAddress(addressData) {
    const response = await api.post('/addresses', addressData)
    return response.data
  },

  // Update address
  async updateAddress(addressId, addressData) {
    const response = await api.patch(`/addresses/${addressId}`, addressData)
    return response.data
  },

  // Delete address
  async deleteAddress(addressId) {
    const response = await api.delete(`/addresses/${addressId}`)
    return response.data
  },
}

export default addressService
