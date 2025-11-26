import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { getDatabase } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, company_name, industry } = await request.json()

    if (!email || !password || !company_name) {
      return NextResponse.json(
        { message: 'E-mail, wachtwoord en bedrijfsnaam zijn verplicht' },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ field: 'email', message: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    // Strong password validation: min 8 chars, uppercase, lowercase, digit, special
    const pwd = String(password)
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    if (!pwdRegex.test(pwd)) {
      return NextResponse.json(
        { field: 'password', message: 'Wachtwoord moet minimaal 8 tekens bevatten en hoofdletter, kleine letter, cijfer en speciaal teken' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    if (!db) {
      return NextResponse.json({ message: 'Databasefout' }, { status: 500 })
    }

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return NextResponse.json(
        { field: 'email', message: 'Dit e-mailadres is al geregistreerd' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const result = db
      .prepare(
        `INSERT INTO users (email, password, company_name, industry) 
         VALUES (?, ?, ?, ?)`
      )
      .run(email, hashedPassword, company_name, industry || null)

    const userId = (result.lastInsertRowid as number) || 0

    // Create session
    await createSession(userId)

    return NextResponse.json(
      { success: true, message: 'Account succesvol aangemaakt' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Interne serverfout' },
      { status: 500 }
    )
  }
}
