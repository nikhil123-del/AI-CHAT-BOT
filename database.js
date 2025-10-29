import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const db = new Database(join(__dirname, 'chat.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables immediately
// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Chat messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    tokens_used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Chat sessions table for organizing conversations
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

console.log('✅ Database initialized successfully');

// User operations
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  findByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),

  findById: db.prepare(`
    SELECT id, username, email, created_at FROM users WHERE id = ?
  `)
};

// Message operations
export const messageQueries = {
  create: db.prepare(`
    INSERT INTO messages (user_id, role, content, model, tokens_used)
    VALUES (?, ?, ?, ?, ?)
  `),

  getByUserId: db.prepare(`
    SELECT * FROM messages 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `),

  getRecentByUserId: db.prepare(`
    SELECT * FROM messages 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `),

  countByUserId: db.prepare(`
    SELECT COUNT(*) as count FROM messages WHERE user_id = ?
  `),

  getTotalTokensByUserId: db.prepare(`
    SELECT SUM(tokens_used) as total FROM messages WHERE user_id = ?
  `),

  getMessagesByDate: db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM messages 
    WHERE user_id = ? 
    GROUP BY DATE(created_at) 
    ORDER BY date DESC 
    LIMIT 30
  `),

  getMessagesByRole: db.prepare(`
    SELECT role, COUNT(*) as count 
    FROM messages 
    WHERE user_id = ? 
    GROUP BY role
  `),

  getModelUsage: db.prepare(`
    SELECT model, COUNT(*) as count 
    FROM messages 
    WHERE user_id = ? AND model IS NOT NULL 
    GROUP BY model
  `)
};

export default db;
