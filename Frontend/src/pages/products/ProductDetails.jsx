import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { productService } from '../../services/product.service'
import { useCart } from '../../context/CartContext'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'

export default function ProductDetails() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  const { addToCart } = useCart()

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
    fetchRelatedProducts()
  }, [productId])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const data = await productService.getProduct(productId)
      setProduct(data)
    } catch (error) {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const data = await productService.getProductReviews(productId)
      setReviews(data.reviews || data)
    } catch (error) {
      console.error('Failed to load reviews')
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const data = await productService.getRelatedProducts(productId)
      setRelatedProducts(data)
    } catch (error) {
      console.error('Failed to load related products')
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity)
    } catch (error) {
      console.error('Add to cart error:', error)
    }
  }

  if (loading) {
    return <Loading message="Loading product details..." />
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <p>Product not found</p>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.product_images?.[0] && (
              <img
                src={product.product_images[0].image_path}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.average_rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.average_rating.toFixed(1)})</span>
            </div>
          )}

          <div className="text-3xl font-bold text-primary-600 mb-6">
            ${product.price?.toFixed(2)}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.nutritional_value && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Nutritional Information</h3>
              <p className="text-gray-600">{product.nutritional_value}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Brand</h3>
            <p className="text-gray-600">{product.brand}</p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-outline w-10 h-10 p-0"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="btn btn-outline w-10 h-10 p-0"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {product.stock} items in stock
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary w-full mb-4"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.review_id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="font-semibold">{review.user?.first_name || 'Anonymous'}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date_created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <Link
                key={relatedProduct.product_id}
                to={`/products/${relatedProduct.product_id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {relatedProduct.product_images?.[0] && (
                    <img
                      src={relatedProduct.product_images[0].image_path}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                <p className="text-primary-600 font-bold">
                  ${relatedProduct.price?.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
