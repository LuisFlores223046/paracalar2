import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../../services/order.service'
import Loading from '../../components/Loading'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders()
      setOrders(data.orders || data)
    } catch (error) {
      console.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading orders..." />
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Order #{order.order_id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      order.order_status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : order.order_status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.order_status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-primary-600">
                      ${order.total_amount?.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="btn btn-outline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
