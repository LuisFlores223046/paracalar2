import api from './api'

export const authService = {
  // Sign up with email
  async signup(userData) {
    const formData = new FormData()
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    formData.append('first_name', userData.firstName)
    formData.append('last_name', userData.lastName)
    formData.append('gender', userData.gender)
    formData.append('date_of_birth', userData.dateOfBirth)

    if (userData.profileImage) {
      formData.append('profile_image', userData.profileImage)
    }

    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Confirm email with verification code
  async confirmSignup(email, code) {
    const response = await api.post('/auth/confirm', {
      email,
      confirmation_code: code,
    })
    return response.data
  },

  // Resend confirmation code
  async resendCode(email) {
    const response = await api.post('/auth/resend-code', { email })
    return response.data
  },

  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Refresh token
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Confirm forgot password
  async confirmForgotPassword(email, code, newPassword) {
    const response = await api.post('/auth/confirm-forgot-password', {
      email,
      confirmation_code: code,
      new_password: newPassword,
    })
    return response.data
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/profile')
    return response.data
  },
}

export default authService
