import { useState, useEffect } from 'react'
import { loyaltyService } from '../../services/loyalty.service'
import { Award, Gift } from 'lucide-react'

export default function LoyaltyProgram() {
  const [points, setPoints] = useState(0)
  const [tier, setTier] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchLoyaltyData()
  }, [])

  const fetchLoyaltyData = async () => {
    try {
      const pointsData = await loyaltyService.getPoints()
      const tierData = await loyaltyService.getTier()
      const historyData = await loyaltyService.getHistory()

      setPoints(pointsData.total_points || 0)
      setTier(tierData)
      setHistory(historyData.history || historyData)
    } catch (error) {
      console.error('Failed to load loyalty data')
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Loyalty Program</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Points Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Points</p>
                <p className="text-4xl font-bold">{points}</p>
              </div>
              <Award size={64} className="opacity-50" />
            </div>

            {tier && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm opacity-90">Current Tier</p>
                <p className="text-2xl font-bold">{tier.tier_level}</p>
              </div>
            )}
          </div>

          {/* Points History */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Points History</h2>
            {history.length === 0 ? (
              <p className="text-gray-600">No points history yet. Start shopping to earn points!</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => (
                  <div
                    key={entry.point_history_id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <p className="font-semibold">{entry.event_type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        entry.point_change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {entry.point_change > 0 ? '+' : ''}
                      {entry.point_change}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rewards */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Gift size={20} />
              Available Rewards
            </h3>
            <p className="text-sm text-gray-600">
              Redeem your points for exclusive rewards and discounts!
            </p>
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">10% Off Coupon</p>
                <p className="text-sm text-gray-600">500 points</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-gray-600">300 points</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">20% Off Coupon</p>
                <p className="text-sm text-gray-600">1000 points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
