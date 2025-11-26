import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getDatabase } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { company_name, industry } = await request.json()

    const db = getDatabase()
    if (!db) {
      return NextResponse.json({ message: 'Databasefout' }, { status: 500 })
    }

    db.prepare(
      `UPDATE users SET company_name = ?, industry = ? WHERE id = ?`
    ).run(company_name, industry, user.id)

    return NextResponse.json(
      { success: true, message: 'Profiel bijgewerkt' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ message: 'Interne serverfout' }, { status: 500 })
  }
}
