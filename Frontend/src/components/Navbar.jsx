import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Heart, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const cartItemsCount = getCartItemsCount()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">BeFit</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/subscriptions"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Subscriptions
                </Link>
                <Link
                  to="/loyalty"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Loyalty
                </Link>
              </>
            )}
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogOut size={24} />
                </button>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="btn btn-primary text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/subscriptions"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Subscriptions
                  </Link>
                  <Link
                    to="/loyalty"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Loyalty
                  </Link>
                  <Link
                    to="/cart"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({cartItemsCount})
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-700 hover:text-primary-600"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
