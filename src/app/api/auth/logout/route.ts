import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export async function POST() {
  try {
    await logout()
    return NextResponse.json({ success: true, message: 'Succesvol uitgelogd' }, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Interne serverfout' },
      { status: 500 }
    )
  }
}
