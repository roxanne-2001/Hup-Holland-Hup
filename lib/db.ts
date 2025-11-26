import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export function initDatabase() {
  if (db) return db

  const dbPath = path.join(process.cwd(), 'hup_holland.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      company_name TEXT NOT NULL,
      industry TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      revenue TEXT,
      employees TEXT,
      market_share TEXT,
      valuation TEXT,
      funding_needed TEXT,
      year_founded TEXT,
      profitable BOOLEAN,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  return db
}

export function getDatabase() {
  if (!db) {
    initDatabase()
  }
  return db
}
