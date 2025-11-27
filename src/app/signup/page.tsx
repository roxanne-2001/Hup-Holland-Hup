"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import parseApiError from '@/lib/apiErrors'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import apiFetch from '@/lib/apiFetch'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    company_name?: string
  }>({})
  const [emailValid, setEmailValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordScore, setPasswordScore] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    industry: 'fintech',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // clear field-specific error while typing
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    // Client-side validations (Nederlands)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Voer een geldig e-mailadres in')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      setLoading(false)
      return
    }

    const pwd = String(formData.password)
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    if (!pwdRegex.test(pwd)) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten en hoofdletter, kleine letter, cijfer en speciaal teken')
      setLoading(false)
      return
    }

    try {
      const data = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          company_name: formData.company_name,
          industry: formData.industry,
        }),
      })

      router.push('/dashboard')
      } catch (err: any) {
        // apiFetch throws ApiError with optional field
        if (err && err.field) {
          setFieldErrors(prev => ({ ...prev, [err.field]: err.message }))
        } else if (err && err.message) {
          setError(err.message)
        } else {
          setError('Er is iets misgegaan')
        }
        setLoading(false)
    }
  }

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(formData.email))

    const pwd = String(formData.password)
    const hasLower = /[a-z]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    const hasDigit = /\d/.test(pwd)
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd)
    const longEnough = pwd.length >= 8
    const score = [longEnough, hasLower, hasUpper, hasDigit, hasSpecial].reduce((s, v) => s + (v ? 1 : 0), 0)
    setPasswordScore(score)
    setPasswordValid(score >= 4) // require at least 4/5
    setPasswordsMatch(Boolean(formData.password) && formData.password === formData.confirmPassword)
  }, [formData])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account aanmaken</h1>
            <p className="text-gray-600 mb-8">Maak een account aan bij Hup Holland om de beste financieringsmatches te vinden</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  placeholder="Je startup naam"
                />
                {fieldErrors.company_name && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sector</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                >
                  <option>fintech</option>
                  <option>healthtech</option>
                  <option>edtech</option>
                  <option>iot</option>
                  <option>cleantech</option>
                  <option>other</option>
                </select>
              </div>

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
                  placeholder="Minimaal 8 tekens"
                  minLength={8}
                />
                <p className="mt-2 text-xs text-gray-600">Wachtwoord moet minimaal 8 tekens bevatten en een hoofdletter, kleine letter, cijfer en speciaal teken bevatten.</p>
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 bg-indigo-600 transition-all`} 
                      style={{ width: `${(passwordScore / 5) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs">
                    <span className={`${passwordScore >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>• 8+ chars</span>
                    <span className="px-2">|</span>
                    <span className={`${passwordScore >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>• lowercase</span>
                    <span className="px-2">|</span>
                    <span className={`${passwordScore >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>• UPPERCASE</span>
                    <span className="px-2">|</span>
                    <span className={`${passwordScore >= 4 ? 'text-indigo-600' : 'text-gray-400'}`}>• number</span>
                    <span className="px-2">|</span>
                    <span className={`${passwordScore >= 5 ? 'text-indigo-600' : 'text-gray-400'}`}>• symbol</span>
                  </div>
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bevestig wachtwoord
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  placeholder="Bevestig je wachtwoord"
                  minLength={8}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !emailValid || !passwordValid || !passwordsMatch}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Account wordt aangemaakt...' : 'Account aanmaken →'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Heb je al een account?
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 ml-1">
                Inloggen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
