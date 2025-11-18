import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '../../services/order.service'
import Loading from '../../components/Loading'

export default function OrderDetails() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(orderId)
      setOrder(data)
    } catch (error) {
      console.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading order details..." />
  }

  if (!order) {
    return <div className="container-custom py-8">Order not found</div>
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.order_item_id} className="flex gap-4 border-b pb-4">
                  <div className="flex-1">
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${item.subtotal?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card space-y-6">
            <div>
              <h3 className="font-bold mb-2">Order Information</h3>
              <p className="text-sm text-gray-600">Order #{order.order_id}</p>
              <p className="text-sm text-gray-600">
                {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    order.order_status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.order_status}
                </span>
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.shipping_cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">${order.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
