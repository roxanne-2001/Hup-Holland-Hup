import { NextRequest, NextResponse } from 'next/server'

interface FundingOpportunity {
  id: number
  name: string
  type: string
  amount: string
  stage: string
  description: string
}

const opportunities: FundingOpportunity[] = [
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
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: opportunities,
  })
}
