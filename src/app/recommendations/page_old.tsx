'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Recommendation {
  name: string
  matchScore: number
  fundingType: string
  fundingAmount: number
}

export default function RecommendationsPage() {
  const [formData, setFormData] = useState({
    industry: 'fintech',
    region: 'Netherlands',
    revenue: '100000',
    employees: '5',
    marketShare: '0.5',
    valuation: '500000',
    fundingAmount: '250000',
    yearFounded: '2022',
    profitable: false,
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitted(true)

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">Hup Holland</Link>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Funding Recommendations</h1>
        <p className="text-gray-600 mb-12 text-lg">Fill in your startup details to receive personalized funding matches</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border-l-4 border-indigo-600">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
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

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                >
                  <option>Netherlands</option>
                  <option>Belgium</option>
                  <option>Germany</option>
                  <option>EU</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Annual Revenue (€)</label>
                <input
                  type="number"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Employees</label>
                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Market Share (%)</label>
                <input
                  type="number"
                  name="marketShare"
                  value={formData.marketShare}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Valuation (€)</label>
                <input
                  type="number"
                  name="valuation"
                  value={formData.valuation}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Funding Amount Needed (€)</label>
                <input
                  type="number"
                  name="fundingAmount"
                  value={formData.fundingAmount}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Year Founded</label>
                <input
                  type="number"
                  name="yearFounded"
                  value={formData.yearFounded}
                  onChange={handleInputChange}
                  className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="profitable"
                  checked={formData.profitable}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 accent-indigo-600"
                />
                <label className="text-sm font-semibold text-gray-900">Your startup is profitable</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition text-lg"
              >
                {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {submitted && loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">⚙️</div>
                <p className="text-gray-700 mt-4 font-semibold">Analyzing your profile...</p>
              </div>
            )}

            {submitted && !loading && recommendations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No recommendations found. Try adjusting your criteria.</p>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches ({recommendations.length})</h2>
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white border-l-4 border-indigo-600 p-6 rounded-lg shadow hover:shadow-xl transition transform hover:scale-105">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{rec.name}</h3>
                          <p className="text-sm text-indigo-600 font-semibold mt-2">{rec.fundingType}</p>
                          <p className="text-sm text-gray-600 mt-1">💰 €{rec.fundingAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right bg-indigo-50 rounded-lg p-4">
                          <div className="text-3xl font-bold text-indigo-600">{rec.matchScore}%</div>
                          <p className="text-xs text-gray-600 mt-1">Match Score</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
