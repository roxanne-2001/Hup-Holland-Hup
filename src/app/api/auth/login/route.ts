import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { getDatabase } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-mail en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    if (!db) {
      return NextResponse.json({ message: 'Databasefout' }, { status: 500 })
    }

    const user = db
      .prepare('SELECT id, password FROM users WHERE email = ?')
      .get(email) as { id: number; password: string } | undefined

    if (!user) {
      return NextResponse.json(
        { message: 'Ongeldige e-mail of wachtwoord' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Ongeldige e-mail of wachtwoord' },
        { status: 401 }
      )
    }

    // Create session
    await createSession(user.id)

    return NextResponse.json(
      { success: true, message: 'Succesvol ingelogd' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Interne serverfout' },
      { status: 500 }
    )
  }
}
