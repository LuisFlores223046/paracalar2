import { ShoppingBag, Users, Package, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Orders', value: '1,234', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Users', value: '5,678', icon: Users, color: 'bg-green-500' },
    { label: 'Products', value: '234', icon: Package, color: 'bg-purple-500' },
    { label: 'Revenue', value: '$45,678', icon: DollarSign, color: 'bg-yellow-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-600">Recent orders will appear here...</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <p className="text-gray-600">Top selling products will appear here...</p>
        </div>
      </div>
    </div>
  )
}
