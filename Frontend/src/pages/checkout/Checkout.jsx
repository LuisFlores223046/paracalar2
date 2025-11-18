import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { paymentService } from '../../services/payment.service'
import { shippingService } from '../../services/shipping.service'
import { toast } from 'react-toastify'

export default function Checkout() {
  const { cart, getCartTotal } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [shippingCost, setShippingCost] = useState(0)
  const [calculatingShipping, setCalculatingShipping] = useState(false)

  useEffect(() => {
    calculateShipping()
  }, [cart])

  const calculateShipping = async () => {
    try {
      setCalculatingShipping(true)
      const data = await shippingService.calculateShipping({
        cart_total: getCartTotal(),
        items_count: cart?.items?.length || 0,
      })
      setShippingCost(data.shipping_cost || 0)
    } catch (error) {
      console.error('Failed to calculate shipping')
      setShippingCost(10.00) // Fallback shipping cost
    } finally {
      setCalculatingShipping(false)
    }
  }

  const handleCheckout = async () => {
    try {
      setLoading(true)

      if (paymentMethod === 'stripe') {
        const { url } = await paymentService.createStripeSession({
          success_url: `${window.location.origin}/orders`,
          cancel_url: `${window.location.origin}/checkout`,
        })
        window.location.href = url
      } else if (paymentMethod === 'paypal') {
        const { approve_url } = await paymentService.createPayPalOrder({
          return_url: `${window.location.origin}/orders`,
          cancel_url: `${window.location.origin}/checkout`,
        })
        window.location.href = approve_url
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <p className="text-gray-600">Address management coming soon...</p>
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold">Credit/Debit Card (Stripe)</p>
                  <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold">PayPal</p>
                  <p className="text-sm text-gray-600">Pay securely via PayPal</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.item_id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {calculatingShipping ? (
                    <span className="text-sm">Calculating...</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">
                  ${(getCartTotal() + shippingCost).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
