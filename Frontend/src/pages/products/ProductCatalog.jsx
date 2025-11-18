import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { productService } from '../../services/product.service'
import Loading from '../../components/Loading'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    fitness_objective: '',
    physical_activity: '',
  })

  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [filters, searchQuery])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        ...filters,
        search: searchQuery,
      }
      const data = await productService.searchProducts(params)
      setProducts(data.products || data)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
    } catch (error) {
      console.error('Add to cart error:', error)
    }
  }

  if (loading) {
    return <Loading message="Loading products..." />
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <button className="btn btn-outline flex items-center gap-2">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Filter options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input"
          >
            <option value="">All Categories</option>
            <option value="protein">Protein</option>
            <option value="vitamins">Vitamins</option>
            <option value="pre-workout">Pre-Workout</option>
            <option value="recovery">Recovery</option>
          </select>

          <select
            value={filters.fitness_objective}
            onChange={(e) => setFilters({ ...filters, fitness_objective: e.target.value })}
            className="input"
          >
            <option value="">All Objectives</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="endurance">Endurance</option>
            <option value="recovery">Recovery</option>
          </select>

          <select
            value={filters.physical_activity}
            onChange={(e) => setFilters({ ...filters, physical_activity: e.target.value })}
            className="input"
          >
            <option value="">All Activities</option>
            <option value="weightlifting">Weightlifting</option>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.product_id} className="card hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.product_id}`}>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {product.product_images?.[0] && (
                    <img
                      src={product.product_images[0].image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>

              <Link to={`/products/${product.product_id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-primary-600">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price?.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(product.product_id)}
                  className="btn btn-primary text-sm"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {product.average_rating > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < Math.floor(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.average_rating.toFixed(1)})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
