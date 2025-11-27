'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface UserData {
  email?: string
  company_name?: string
}

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me', { 
        method: 'GET',
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hup Holland
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/funding" className="text-gray-600 hover:text-gray-900 font-medium transition">
                Funding
              </Link>
              {user && (
                <Link href="/recommendations" className="text-gray-600 hover:text-gray-900 font-medium transition">
                  Platform
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-10 bg-gray-100 animate-pulse rounded-xl"></div>
            ) : user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
                >
                  <span>👤</span>
                  <span>|</span>
                  <span>{user.company_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
                  Sign in
                </Link>
                <Link href="/signup">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition transform font-medium">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
