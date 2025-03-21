import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize SQLite database
const db = new sqlite3.Database(join(__dirname, '../../database.sqlite'), (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
  console.log('📦 Connected to SQLite database');
});

// Create tables if they don't exist
db.serialize(() => {
  console.log('🔧 Creating database tables...');
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err);
    } else {
      console.log('✅ Users table ready');
    }
  });

  // Create emissions table
  db.run(`CREATE TABLE IF NOT EXISTS emissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL,
    amount FLOAT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`, (err) => {
    if (err) {
      console.error('❌ Error creating emissions table:', err);
    } else {
      console.log('✅ Emissions table ready');
    }
  });
});

export default db;
