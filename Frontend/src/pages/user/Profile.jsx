import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/profile.service'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    gender: user?.gender || '',
    date_of_birth: user?.date_of_birth || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const updated = await profileService.updateProfile(formData)
      updateUser(updated)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-outline text-sm"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="input"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="PREFER_NOT_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_birth: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-semibold">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Gender</label>
                  <p className="font-semibold">{user?.gender}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date of Birth</label>
                  <p className="font-semibold">{user?.date_of_birth}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/orders" className="block text-primary-600 hover:underline">
                Order History
              </a>
              <a href="/subscriptions" className="block text-primary-600 hover:underline">
                Manage Subscriptions
              </a>
              <a href="/loyalty" className="block text-primary-600 hover:underline">
                Loyalty Program
              </a>
              <a href="/positioning-test" className="block text-primary-600 hover:underline">
                Retake Positioning Test
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
