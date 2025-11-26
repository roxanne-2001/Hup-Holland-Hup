'use client'

import { useState } from 'react'

interface FundingOpportunity {
  id: number
  name: string
  type: string
  amount: string
  stage: string
  description: string
}

export default function Funding() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([
    {
      id: 1,
      name: 'Tech Venture Fund',
      type: 'Venture Capital',
      amount: '€50,000 - €500,000',
      stage: 'Seed to Series A',
      description: 'Investing in innovative tech startups',
    },
    {
      id: 2,
      name: 'Green Innovation Grant',
      type: 'Grant',
      amount: '€10,000 - €100,000',
      stage: 'Early Stage',
      description: 'Support for sustainable business ideas',
    },
    {
      id: 3,
      name: 'Scale-up Accelerator',
      type: 'Accelerator',
      amount: '€20,000 + 2% equity',
      stage: 'Growth',
      description: 'Intensive 3-month program for scaling companies',
    },
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">Hup Holland</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-2">Funding Opportunities</h2>
        <p className="text-gray-600 mb-8">Browse available funding opportunities for your startup</p>

        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {opportunity.name}
                  </h3>
                  <p className="text-gray-600">{opportunity.type}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {opportunity.stage}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{opportunity.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  {opportunity.amount}
                </span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
