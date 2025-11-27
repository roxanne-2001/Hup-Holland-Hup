'use client'

import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../components/Navbar'

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
  const [savingId, setSavingId] = useState<number | null>(null)

  async function saveOpportunity(rec: Recommendation, index: number) {
    setSavingId(index)
    try {
      const response = await fetch('/api/saved-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funding_name: rec.name,
          funding_type: rec.fundingType,
          funding_amount: `€${rec.fundingAmount.toLocaleString()}`,
          match_score: rec.matchScore,
          description: `AI recommended match based on your startup profile`,
        }),
      })

      if (response.ok) {
        alert('✓ Opgeslagen! Bekijk je opgeslagen opportunities in je dashboard.')
      } else {
        alert('Je moet ingelogd zijn om opportunities op te slaan.')
      }
    } catch (error) {
      console.error('Error saving opportunity:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setSavingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitted(true)

    try {
      // Convert string values to numbers for API
      const payload = {
        industry: formData.industry,
        region: formData.region,
        revenue: Number(formData.revenue),
        employees: Number(formData.employees),
        marketShare: Number(formData.marketShare),
        valuation: Number(formData.valuation),
        fundingAmount: Number(formData.fundingAmount),
        yearFounded: Number(formData.yearFounded),
        profitable: formData.profitable,
      }

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            AI-powered matching
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Vind jouw perfecte <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">funding match</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vul je startup gegevens in en onze AI vindt binnen seconden de beste funding opties voor jou
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vertel over je startup</h2>
                <p className="text-gray-600">Deze informatie gebruiken we om de perfecte match te vinden</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sector *</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  >
                    <option value="fintech">Fintech</option>
                    <option value="healthtech">Healthtech</option>
                    <option value="edtech">Edtech</option>
                    <option value="iot">IoT</option>
                    <option value="cleantech">Cleantech</option>
                    <option value="other">Anders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Regio *</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                  >
                    <option value="Netherlands">Nederland</option>
                    <option value="Belgium">België</option>
                    <option value="Germany">Duitsland</option>
                    <option value="EU">EU</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jaaromzet (€)</label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aantal medewerkers</label>
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marktaandeel (%)</label>
                  <input
                    type="number"
                    name="marketShare"
                    value={formData.marketShare}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="0.5"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Waardering (€)</label>
                  <input
                    type="number"
                    name="valuation"
                    value={formData.valuation}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Funding nodig (€) *</label>
                  <input
                    type="number"
                    name="fundingAmount"
                    value={formData.fundingAmount}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opgericht in</label>
                  <input
                    type="number"
                    name="yearFounded"
                    value={formData.yearFounded}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none transition"
                    placeholder="2022"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="profitable"
                  checked={formData.profitable}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-indigo-600"
                />
                <label className="text-sm font-semibold text-gray-900">Mijn startup is winstgevend</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Matches zoeken...' : 'Vind mijn matches →'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {!submitted && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 text-center border-2 border-indigo-100">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Klaar voor je matches?</h3>
                <p className="text-gray-600 mb-6">
                  Vul het formulier in en ontdek binnen seconden welke funding opties het beste bij jouw startup passen
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Gratis
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Direct resultaat
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    AI-powered
                  </div>
                </div>
              </div>
            )}

            {submitted && loading && (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100 shadow-xl">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI aan het werk...</h3>
                <p className="text-gray-600">We analyseren 500+ funding opties voor jou</p>
              </div>
            )}

            {submitted && !loading && recommendations.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100 shadow-xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Geen matches gevonden</h3>
                <p className="text-gray-600 mb-6">Probeer je criteria aan te passen voor betere resultaten</p>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {recommendations.length} perfecte matches
                  </h2>
                  <p className="text-gray-600">Gesorteerd op match score - de beste bovenaan</p>
                </div>
                <div className="space-y-6">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 p-6 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{rec.name}</h3>
                          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                            {rec.fundingType}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {rec.matchScore}%
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Match score</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-6">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-lg">€{rec.fundingAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => saveOpportunity(rec, idx)}
                          disabled={savingId === idx}
                          className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition disabled:opacity-50"
                        >
                          {savingId === idx ? 'Opslaan...' : 'Opslaan'}
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition transform">
                          Bekijk details →
                        </button>
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
