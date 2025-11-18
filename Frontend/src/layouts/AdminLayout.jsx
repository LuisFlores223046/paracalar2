import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingBag, BarChart3, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-primary-400">
            BeFit Admin
          </Link>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition-colors ${
                  isActive(item.path) ? 'bg-gray-800 border-l-4 border-primary-500' : ''
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition-colors w-full text-left mt-8"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
