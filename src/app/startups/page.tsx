'use client'

import { useState } from 'react'

export default function Startups() {
  const [startups] = useState([
    {
      id: 1,
      name: 'TechAI Solutions',
      industry: 'Artificial Intelligence',
      stage: 'Series A',
      description: 'AI-powered analytics platform',
      fundingReceived: '€2M',
    },
    {
      id: 2,
      name: 'GreenEnergy Co',
      industry: 'Clean Energy',
      stage: 'Seed',
      description: 'Sustainable renewable energy technology',
      fundingReceived: '€500K',
    },
    {
      id: 3,
      name: 'FinTech Innovations',
      industry: 'Financial Technology',
      stage: 'Growth',
      description: 'Blockchain-based payment solutions',
      fundingReceived: '€5M',
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
        <h2 className="text-3xl font-bold mb-2">Startups Directory</h2>
        <p className="text-gray-600 mb-8">
          Discover startups and scale-ups in our network
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {startups.map((startup) => (
            <div
              key={startup.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {startup.name}
                  </h3>
                  <p className="text-gray-600">{startup.industry}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {startup.stage}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{startup.description}</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Funding Received: <span className="font-semibold">{startup.fundingReceived}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
