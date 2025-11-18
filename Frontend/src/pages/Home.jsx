import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Truck, Award, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Premium fitness and nutrition products',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Only certified brands and products',
    },
    {
      icon: Heart,
      title: 'Personalized',
      description: 'Products tailored to your goals',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Your Fitness Journey Starts Here
            </h1>
            <p className="text-xl mb-8">
              Discover premium supplements and nutrition products tailored to your fitness goals.
              Get personalized recommendations based on your unique profile.
            </p>
            <div className="flex gap-4">
              {!isAuthenticated && (
                <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Get Started
                </Link>
              )}
              <Link to="/products" className="btn btn-outline border-white text-white hover:bg-white/10">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BeFit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Positioning Test CTA */}
      {isAuthenticated && (
        <section className="bg-gray-100 py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Take Your Positioning Test</h2>
              <p className="text-lg text-gray-600 mb-8">
                Answer a few questions about your fitness goals and lifestyle to get personalized
                product recommendations tailored just for you.
              </p>
              <Link
                to="/positioning-test"
                className="inline-flex items-center gap-2 btn btn-primary"
              >
                Start Test
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Subscription Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Subscribe & Save</h2>
              <p className="text-lg mb-8">
                Get your personalized monthly box of supplements delivered to your door. Save time
                and money while staying consistent with your fitness nutrition.
              </p>
              <Link
                to={isAuthenticated ? '/subscriptions' : '/signup'}
                className="btn bg-white text-primary-600 hover:bg-gray-100"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Program */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">BeFit Loyalty Program</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Earn points with every purchase and unlock exclusive rewards, discounts, and perks.
            </p>
          </div>
          <div className="text-center">
            <Link
              to={isAuthenticated ? '/loyalty' : '/signup'}
              className="btn btn-primary"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
