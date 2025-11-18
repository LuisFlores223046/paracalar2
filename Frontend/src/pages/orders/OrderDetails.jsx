import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '../../services/order.service'
import { shippingService } from '../../services/shipping.service'
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react'
import Loading from '../../components/Loading'

export default function OrderDetails() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
    fetchTracking()
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

  const fetchTracking = async () => {
    try {
      const data = await shippingService.getTracking(orderId)
      setTracking(data)
    } catch (error) {
      console.error('Failed to load tracking info')
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
          {/* Shipping Tracking */}
          {tracking && order.order_status !== 'PENDING' && order.order_status !== 'CANCELLED' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck size={20} />
                Shipping Tracking
              </h2>

              {order.tracking_number && (
                <p className="text-sm text-gray-600 mb-4">
                  Tracking Number: <span className="font-semibold">{order.tracking_number}</span>
                </p>
              )}

              <div className="space-y-4">
                {tracking.events?.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {index === 0 ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 pb-4 border-b last:border-0">
                      <p className="font-semibold">{event.status}</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {tracking.estimated_delivery && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold">
                      {new Date(tracking.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.order_item_id} className="flex gap-4 border-b pb-4 last:border-0">
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
