import { NextRequest, NextResponse } from 'next/server'

interface UserInput {
  industry: string
  region: string
  revenue: number
  employees: number
  marketShare: number
  valuation: number
  fundingAmount: number
  profitable: boolean
  yearFounded: number
}

interface StartupData {
  startupName: string
  industry: string
  region: string
  fundingRounds: number
  fundingAmount: number
  valuation: number
  revenue: number
  employees: number
  marketShare: number
  profitable: boolean
  yearFounded: number
}

// Mock startup dataset
const startupDatabase: StartupData[] = [
  {
    startupName: 'TechAI Startup',
    industry: 'AI',
    region: 'Europe',
    fundingRounds: 1,
    fundingAmount: 150,
    valuation: 500,
    revenue: 2,
    employees: 45,
    marketShare: 5,
    profitable: false,
    yearFounded: 2022,
  },
  {
    startupName: 'FinTech Solutions',
    industry: 'FinTech',
    region: 'Europe',
    fundingRounds: 2,
    fundingAmount: 400,
    valuation: 1200,
    revenue: 8,
    employees: 120,
    marketShare: 8,
    profitable: true,
    yearFounded: 2020,
  },
  {
    startupName: 'EdTech Platform',
    industry: 'EdTech',
    region: 'North America',
    fundingRounds: 3,
    fundingAmount: 800,
    valuation: 3000,
    revenue: 15,
    employees: 200,
    marketShare: 12,
    profitable: false,
    yearFounded: 2019,
  },
  {
    startupName: 'IoT Innovations',
    industry: 'IoT',
    region: 'Asia',
    fundingRounds: 2,
    fundingAmount: 300,
    valuation: 800,
    revenue: 5,
    employees: 80,
    marketShare: 6,
    profitable: true,
    yearFounded: 2021,
  },
  {
    startupName: 'Green Energy Corp',
    industry: 'Clean Energy',
    region: 'Europe',
    fundingRounds: 1,
    fundingAmount: 200,
    valuation: 600,
    revenue: 1,
    employees: 35,
    marketShare: 3,
    profitable: false,
    yearFounded: 2023,
  },
  {
    startupName: 'Health Tech Inc',
    industry: 'HealthTech',
    region: 'North America',
    fundingRounds: 2,
    fundingAmount: 500,
    valuation: 1500,
    revenue: 10,
    employees: 150,
    marketShare: 10,
    profitable: false,
    yearFounded: 2020,
  },
]

// Helper: Determine funding type based on rounds and amount
function determineFundingType(rounds: number, amount: number): string {
  if (rounds <= 1 && amount < 200) {
    return 'Seed Funding / Pre-seed'
  } else if (rounds <= 2) {
    return 'Series A'
  } else if (rounds === 3) {
    return 'Series B'
  } else if (rounds === 4) {
    return 'Series C'
  } else if (rounds >= 5) {
    return 'Growth Funding / Late Stage VC'
  }
  return 'General Venture Funding'
}

// Normalize numeric features
function normalizeFeature(value: number, min: number, max: number): number {
  return (value - min) / (max - min || 1)
}

// Calculate cosine similarity
function cosineSimilarity(userVec: number[], startupVec: number[]): number {
  let dotProduct = 0
  let userMagnitude = 0
  let startupMagnitude = 0

  for (let i = 0; i < Math.min(userVec.length, startupVec.length); i++) {
    dotProduct += userVec[i] * startupVec[i]
    userMagnitude += userVec[i] * userVec[i]
    startupMagnitude += startupVec[i] * startupVec[i]
  }

  userMagnitude = Math.sqrt(userMagnitude)
  startupMagnitude = Math.sqrt(startupMagnitude)

  if (userMagnitude === 0 || startupMagnitude === 0) return 0
  return dotProduct / (userMagnitude * startupMagnitude)
}

// Vectorize user input
function vectorizeUser(user: UserInput): number[] {
  const revenues = startupDatabase.map((s) => s.revenue)
  const employees = startupDatabase.map((s) => s.employees)
  const valuations = startupDatabase.map((s) => s.valuation)
  const fundingAmounts = startupDatabase.map((s) => s.fundingAmount)
  const marketShares = startupDatabase.map((s) => s.marketShare)

  const minRevenue = Math.min(...revenues)
  const maxRevenue = Math.max(...revenues)
  const minEmployees = Math.min(...employees)
  const maxEmployees = Math.max(...employees)
  const minValuation = Math.min(...valuations)
  const maxValuation = Math.max(...valuations)
  const minFunding = Math.min(...fundingAmounts)
  const maxFunding = Math.max(...fundingAmounts)
  const minMarket = Math.min(...marketShares)
  const maxMarket = Math.max(...marketShares)

  return [
    normalizeFeature(user.revenue, minRevenue, maxRevenue),
    normalizeFeature(user.employees, minEmployees, maxEmployees),
    normalizeFeature(user.valuation, minValuation, maxValuation),
    normalizeFeature(user.fundingAmount, minFunding, maxFunding),
    normalizeFeature(user.marketShare, minMarket, maxMarket),
    user.profitable ? 1 : 0,
    (user.yearFounded % 100) / 100,
    user.industry.length > 0 ? 0.8 : 0,
    user.region.length > 0 ? 0.8 : 0,
  ]
}

// Vectorize startup
function vectorizeStartup(startup: StartupData): number[] {
  const revenues = startupDatabase.map((s) => s.revenue)
  const employees = startupDatabase.map((s) => s.employees)
  const valuations = startupDatabase.map((s) => s.valuation)
  const fundingAmounts = startupDatabase.map((s) => s.fundingAmount)
  const marketShares = startupDatabase.map((s) => s.marketShare)

  const minRevenue = Math.min(...revenues)
  const maxRevenue = Math.max(...revenues)
  const minEmployees = Math.min(...employees)
  const maxEmployees = Math.max(...employees)
  const minValuation = Math.min(...valuations)
  const maxValuation = Math.max(...valuations)
  const minFunding = Math.min(...fundingAmounts)
  const maxFunding = Math.max(...fundingAmounts)
  const minMarket = Math.min(...marketShares)
  const maxMarket = Math.max(...marketShares)

  return [
    normalizeFeature(startup.revenue, minRevenue, maxRevenue),
    normalizeFeature(startup.employees, minEmployees, maxEmployees),
    normalizeFeature(startup.valuation, minValuation, maxValuation),
    normalizeFeature(startup.fundingAmount, minFunding, maxFunding),
    normalizeFeature(startup.marketShare, minMarket, maxMarket),
    startup.profitable ? 1 : 0,
    (startup.yearFounded % 100) / 100,
    startup.industry.length > 0 ? 0.8 : 0,
    startup.region.length > 0 ? 0.8 : 0,
  ]
}

// Main recommendation function
function recommendFunding(userInput: UserInput, topN: number = 5) {
  const userVec = vectorizeUser(userInput)

  const similarities = startupDatabase.map((startup) => {
    const startupVec = vectorizeStartup(startup)
    return {
      ...startup,
      matchScore: cosineSimilarity(userVec, startupVec),
    }
  })

  const topMatches = similarities
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN)
    .map((match) => ({
      ...match,
      recommendedFundingType: determineFundingType(
        match.fundingRounds,
        match.fundingAmount
      ),
    }))

  return topMatches
}

export async function POST(request: NextRequest) {
  try {
    const userInput: UserInput = await request.json()

    if (!userInput.industry || !userInput.region) {
      return NextResponse.json(
        {
          success: false,
          error: 'Industry and region are required',
        },
        { status: 400 }
      )
    }

    const recommendations = recommendFunding(userInput, 5)

    return NextResponse.json({
      success: true,
      recommendations: recommendations.map((rec) => ({
        name: rec.startupName,
        fundingType: rec.recommendedFundingType,
        matchScore: parseFloat((rec.matchScore * 100).toFixed(2)),
        fundingAmount: rec.fundingAmount * 1000, // Convert to full amount
      })),
      totalMatches: recommendations.length,
    })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
