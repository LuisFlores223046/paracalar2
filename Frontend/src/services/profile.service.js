import api from './api'

export const profileService = {
  // Get user profile
  async getProfile() {
    const response = await api.get('/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(data) {
    const formData = new FormData()

    if (data.first_name) formData.append('first_name', data.first_name)
    if (data.last_name) formData.append('last_name', data.last_name)
    if (data.gender) formData.append('gender', data.gender)
    if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
    if (data.profile_image) formData.append('profile_image', data.profile_image)

    const response = await api.patch('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get fitness profile
  async getFitnessProfile() {
    const response = await api.get('/profile/fitness-profile')
    return response.data
  },

  // Create/Update fitness profile
  async updateFitnessProfile(data) {
    const response = await api.post('/profile/fitness-profile', data)
    return response.data
  },
}

export default profileService
