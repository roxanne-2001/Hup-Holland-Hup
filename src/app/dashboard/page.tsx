'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/auth'

interface UserData {
  id?: number
  email?: string
  company_name?: string
  industry?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

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
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

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
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
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
              <Link href="/recommendations" className="text-gray-600 hover:text-indigo-600 font-semibold">
                Get Recommendations
              </Link>
              <Link href="/account" className="text-gray-600 hover:text-indigo-600 font-semibold">
                Account
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.company_name}</h1>
          <p className="text-gray-600 text-lg">Manage your startup profile and funding applications</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Completion</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
            <p className="text-gray-600">Fill in your startup details to get better matches</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Saved Opportunities</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">12</div>
            <p className="text-gray-600">Funding opportunities you have saved</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Applications</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">3</div>
            <p className="text-gray-600">Applications submitted</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Funding Matches</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-600 p-6 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Seed Fund Europe 2025</h3>
                  <p className="text-sm text-gray-600 mt-1">Seed Stage Funding</p>
                </div>
                <div className="text-right bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">92%</div>
                  <p className="text-xs text-gray-600">Match</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-indigo-600 p-6 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Series A Accelerator</h3>
                  <p className="text-sm text-gray-600 mt-1">Series A Funding</p>
                </div>
                <div className="text-right bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">85%</div>
                  <p className="text-xs text-gray-600">Match</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-indigo-600 p-6 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tech Venture Fund</h3>
                  <p className="text-sm text-gray-600 mt-1">Growth Stage Funding</p>
                </div>
                <div className="text-right bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">78%</div>
                  <p className="text-xs text-gray-600">Match</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/recommendations">
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg mt-6">
              Get New Recommendations
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
