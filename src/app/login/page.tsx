"use client"

import Link from 'next/link'
import { useState } from 'react'
import parseApiError from '@/lib/apiErrors'
import apiFetch from '@/lib/apiFetch'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      router.push('/dashboard')
      return
    } catch (err: any) {
      if (err && err.field) {
        setFieldErrors(prev => ({ ...prev, [(err.field as string)]: err.message }))
      } else if (err && err.message) {
        setError(err.message)
      } else {
        setError('Inloggen mislukt')
      }
      setLoading(false)
      return
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inloggen</h1>
            <p className="text-gray-600 mb-8">Meld je aan bij je Hup Holland-account</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  placeholder="je@email.com"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Wachtwoord</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  placeholder="Voer je wachtwoord in"
                />
                {fieldErrors.password && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Bezig met inloggen...' : 'Inloggen →'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Heb je nog geen account?
              <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 ml-1">
                Registreren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
