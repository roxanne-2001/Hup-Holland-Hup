import { cookies } from 'next/headers'
import { getDatabase } from './db'

export interface User {
  id: number
  email: string
  company_name: string
  industry?: string
  created_at: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) return null

    const db = getDatabase()
    if (!db) return null

    const session = db
      .prepare(
        `SELECT user_id FROM sessions 
       WHERE id = ? AND expires_at > datetime('now')`
      )
      .get(sessionId) as { user_id: number } | undefined

    if (!session) {
      ;(await cookies()).delete('session_id')
      return null
    }

    const user = db
      .prepare('SELECT id, email, company_name, industry, created_at FROM users WHERE id = ?')
      .get(session.user_id) as User | undefined

    return user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function createSession(userId: number): Promise<string> {
  const db = getDatabase()
  if (!db) throw new Error('Database not initialized')

  const sessionId = Math.random().toString(36).substring(2, 15)
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at) 
     VALUES (?, ?, ?)`
  ).run(sessionId, userId, expiresAt.toISOString())

  const cookieStore = await cookies()
  cookieStore.set('session_id', sessionId, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return sessionId
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (sessionId) {
    const db = getDatabase()
    if (!db) return
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
  }

  cookieStore.delete('session_id')
}
