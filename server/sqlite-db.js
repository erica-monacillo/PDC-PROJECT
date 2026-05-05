import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database connection
let dbInstance = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, 'sweets.db'),
      driver: sqlite3.Database
    });
    // Enable foreign keys
    await dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

// Test database connection
export const testConnection = async () => {
  try {
    const db = await getDb();
    await db.get('SELECT 1');
    console.log('✅ SQLite database connected successfully');
    return true;
  } catch (err) {
    console.error('❌ SQLite connection failed:', err.message);
    return false;
  }
};

// Initialize database (schema is created by setup-sqlite.js)
export const initializeDatabase = async () => {
  console.log('✅ SQLite database already initialized');
};

// Generic query function
export const query = async (text, params = []) => {
  const db = await getDb();
  const start = Date.now();
  try {
    let result;
    if (text.trim().toUpperCase().startsWith('SELECT') || text.trim().toUpperCase().startsWith('PRAGMA')) {
      result = await db.all(text, params);
    } else {
      result = await db.run(text, params);
    }
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.length || result.changes });
    return { rows: result };
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  const db = await getDb();
  try {
    await db.exec('BEGIN TRANSACTION');
    const result = await callback(db);
    await db.exec('COMMIT');
    return result;
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
};

// Close database
export const closeDb = async () => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('SQLite database closed');
  }
};

export default { getDb, testConnection, initializeDatabase, query, transaction, closeDb };