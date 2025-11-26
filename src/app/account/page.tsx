'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import parseApiError from '@/lib/apiErrors'
import { useRouter } from 'next/navigation'

interface UserData {
  id?: number
  email?: string
  company_name?: string
  industry?: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ company_name?: string; industry?: string }>({})
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', { method: 'GET' })
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        setUser(userData)
        setFormData({
          company_name: userData.company_name || '',
          industry: userData.industry || '',
        })
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    setFieldErrors({})

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
          const data = await res.json().catch(() => null)
          const parsed = parseApiError(data)
          if (parsed.field) {
            setFieldErrors(prev => ({ ...prev, [(parsed.field as string)]: parsed.message }))
          } else if (parsed.message) {
            setError(parsed.message)
          } else {
            setError('Failed to update profile')
          }
        setSaving(false)
        return
      }

      setUser({ ...user, ...formData })
      setEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Hup Holland
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-semibold">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-600 mt-2">Your email cannot be changed</p>
              </div>

              {editing ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                    />
                    {fieldErrors.company_name && (
                      <p className="mt-2 text-xs text-red-600">{fieldErrors.company_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                    >
                      <option>fintech</option>
                      <option>healthtech</option>
                      <option>edtech</option>
                      <option>iot</option>
                      <option>cleantech</option>
                      <option>other</option>
                    </select>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={user.company_name || ''}
                      disabled
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                    <input
                      type="text"
                      value={user.industry || 'Not specified'}
                      disabled
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
                    />
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Actions</h2>
          <button
            onClick={handleLogout}
            className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
