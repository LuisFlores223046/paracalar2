import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import Loading from '../../components/Loading'

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, getCartTotal } = useCart()

  if (loading) {
    return <Loading message="Loading cart..." />
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.item_id} className="card flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.product?.product_images?.[0] && (
                  <img
                    src={item.product.product_images[0].image_path}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <Link
                  to={`/products/${item.product.product_id}`}
                  className="font-semibold hover:text-primary-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-600 text-sm mt-1">{item.product.brand}</p>
                <p className="text-primary-600 font-bold mt-2">
                  ${item.product.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(item.item_id, item.quantity - 1)}
                      className="btn btn-outline w-8 h-8 p-0 text-sm"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.item_id, item.quantity + 1)}
                      className="btn btn-outline w-8 h-8 p-0 text-sm"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.item_id)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="block text-center mt-4 text-primary-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
