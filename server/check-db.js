import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function checkTables() {
  try {
    const db = await open({
      filename: 'sweets.db',
      driver: sqlite3.Database
    });

    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables in database:', tables.map(t => t.name));

    // Check products
    const products = await db.all('SELECT COUNT(*) as count FROM products');
    console.log('Products count:', products[0].count);

    await db.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();