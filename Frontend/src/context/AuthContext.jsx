import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const userData = await authService.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)

      const userData = await authService.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)

      toast.success('Login successful!')
      return response
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData)
      toast.success('Account created successfully! Please check your email to confirm.')
      return response
    } catch (error) {
      toast.error(error.message || 'Signup failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
      toast.info('Logged out successfully')
    }
  }

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUser,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
