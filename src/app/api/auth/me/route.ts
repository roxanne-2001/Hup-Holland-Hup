import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ field: 'authorization', message: 'Niet geautoriseerd' }, { status: 401 })
    }
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: 'Interne serverfout' }, { status: 500 })
  }
}
