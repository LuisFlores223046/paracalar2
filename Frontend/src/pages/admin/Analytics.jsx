import { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analytics.service'
import { BarChart3, TrendingUp, Users, DollarSign, Package } from 'lucide-react'
import Loading from '../../components/Loading'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [salesData, setSalesData] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [userBehavior, setUserBehavior] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [sales, revenue, products, behavior] = await Promise.all([
        analyticsService.getSalesAnalytics(dateRange.startDate, dateRange.endDate),
        analyticsService.getRevenue(dateRange.startDate, dateRange.endDate),
        analyticsService.getTopProducts(10),
        analyticsService.getUserBehavior(),
      ])

      setSalesData(sales)
      setRevenueData(revenue)
      setTopProducts(products)
      setUserBehavior(behavior)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading analytics..." />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        {/* Date Range Selector */}
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm text-gray-600 mr-2">From:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">To:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="input text-sm"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${revenueData?.total_revenue?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{revenueData?.growth_percentage?.toFixed(1) || '0'}% vs last period
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{salesData?.total_orders || 0}</p>
              <p className="text-sm text-blue-600 mt-1">
                {salesData?.orders_this_month || 0} this month
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold">{userBehavior?.active_users || 0}</p>
              <p className="text-sm text-purple-600 mt-1">
                {userBehavior?.new_users || 0} new users
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
              <p className="text-2xl font-bold">
                ${salesData?.average_order_value?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {salesData?.total_items_sold || 0} items sold
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package size={20} />
            Top Selling Products
          </h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.units_sold || 0} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      ${product.revenue?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-gray-600">revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No sales data available</p>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {salesData?.sales_by_category && Object.entries(salesData.sales_by_category).length > 0 ? (
              Object.entries(salesData.sales_by_category).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold capitalize">{category}</span>
                      <span className="text-gray-600">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(amount / Math.max(...Object.values(salesData.sales_by_category))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* User Behavior Insights */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">User Behavior Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {userBehavior?.conversion_rate?.toFixed(2) || '0.00'}%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg. Cart Value</p>
            <p className="text-2xl font-bold text-green-600">
              ${userBehavior?.average_cart_value?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Cart Abandonment</p>
            <p className="text-2xl font-bold text-purple-600">
              {userBehavior?.cart_abandonment_rate?.toFixed(2) || '0.00'}%
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      {revenueData && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold mb-4">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Product Sales</p>
              <p className="text-xl font-bold">${revenueData.product_revenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Subscription Revenue</p>
              <p className="text-xl font-bold">${revenueData.subscription_revenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipping Fees</p>
              <p className="text-xl font-bold">${revenueData.shipping_revenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-primary-600">
                ${revenueData.total_revenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
