const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '..', 'hup_holland.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const testAccounts = [
  { email: 'test1@hupholland.nl', password: 'Test123!', company_name: 'TechStart BV', industry: 'Technology' },
  { email: 'test2@hupholland.nl', password: 'Test123!', company_name: 'GreenEnergy Solutions', industry: 'Energy' },
  { email: 'test3@hupholland.nl', password: 'Test123!', company_name: 'HealthTech Innovations', industry: 'Healthcare' },
  { email: 'test4@hupholland.nl', password: 'Test123!', company_name: 'FinanceFlow', industry: 'Finance' },
  { email: 'test5@hupholland.nl', password: 'Test123!', company_name: 'AgriTech Nederland', industry: 'Agriculture' }
];

async function seedAccounts() {
  console.log('Seeding test accounts...');
  
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, company_name, industry)
    VALUES (?, ?, ?, ?)
  `);

  for (const account of testAccounts) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    insertStmt.run(account.email, hashedPassword, account.company_name, account.industry);
    console.log(`✓ Added: ${account.email} (${account.company_name})`);
  }

  console.log('\nTest accounts created successfully!');
  console.log('You can now login with any of these accounts using password: Test123!');
  
  db.close();
}

seedAccounts().catch(console.error);
