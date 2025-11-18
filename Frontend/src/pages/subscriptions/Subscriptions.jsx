import { useState, useEffect } from 'react'
import { subscriptionService } from '../../services/subscription.service'
import { toast } from 'react-toastify'

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionService.getSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (subscriptionId, status) => {
    try {
      await subscriptionService.updateSubscriptionStatus(subscriptionId, status)
      await fetchSubscriptions()
      toast.success('Subscription updated!')
    } catch (error) {
      toast.error('Failed to update subscription')
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 mb-4">You don't have any active subscriptions.</p>
          <p className="text-sm text-gray-500 mb-6">
            Take the positioning test to get personalized subscription recommendations!
          </p>
          <a href="/positioning-test" className="btn btn-primary">
            Take Positioning Test
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.subscription_id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Monthly Subscription</h3>
                  <p className="text-sm text-gray-600">
                    Started: {new Date(subscription.start_date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    subscription.subscription_status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : subscription.subscription_status === 'PAUSED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subscription.subscription_status}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-xl font-bold text-primary-600 mb-4">
                  ${subscription.price?.toFixed(2)}/month
                </p>

                <div className="flex gap-2">
                  {subscription.subscription_status === 'ACTIVE' && (
                    <button
                      onClick={() =>
                        handleStatusChange(subscription.subscription_id, 'PAUSED')
                      }
                      className="btn btn-outline text-sm"
                    >
                      Pause
                    </button>
                  )}
                  {subscription.subscription_status === 'PAUSED' && (
                    <button
                      onClick={() =>
                        handleStatusChange(subscription.subscription_id, 'ACTIVE')
                      }
                      className="btn btn-primary text-sm"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleStatusChange(subscription.subscription_id, 'CANCELLED')
                    }
                    className="btn btn-danger text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
