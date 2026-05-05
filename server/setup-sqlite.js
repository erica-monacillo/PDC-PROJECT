import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📱 Setting up SQLite database for Sweets Website...\n');

async function setupSQLite() {
  try {
    // Open SQLite database
    const db = await open({
      filename: path.join(__dirname, 'sweets.db'),
      driver: sqlite3.Database
    });

    console.log('📦 Creating SQLite database...');

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.exec(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category TEXT,
        image TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Orders table
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        customer_info TEXT NOT NULL,
        items TEXT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Carts table
      CREATE TABLE IF NOT EXISTS carts (
        user_id TEXT PRIMARY KEY REFERENCES users(id),
        items TEXT DEFAULT '[]',
        total DECIMAL(10,2) DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Sessions table
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    `);

    // Check if products exist
    const productCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      console.log('📦 Initializing products...');

      const initialProducts = [
        { id: 'prod-1', name: 'Chocolate Cake', price: 8.99, description: 'Rich chocolate cake with creamy frosting', category: 'cakes', image: '/images/cake1.jpg', stock: 10 },
        { id: 'prod-2', name: 'Strawberry Cheesecake', price: 9.99, description: 'Creamy cheesecake topped with fresh strawberries', category: 'cakes', image: '/images/cake2.jpg', stock: 8 },
        { id: 'prod-3', name: 'Donut Pack (6)', price: 12.99, description: 'Assorted glazed donuts, perfect for sharing', category: 'pastries', image: '/images/donuts.jpg', stock: 15 },
        { id: 'prod-4', name: 'Macaron Set', price: 15.99, description: 'Delicate French macarons in various flavors', category: 'pastries', image: '/images/macarons.jpg', stock: 12 },
        { id: 'prod-5', name: 'Cupcake Box (12)', price: 24.99, description: 'Colorful cupcakes with different toppings', category: 'cakes', image: '/images/cupcakes.jpg', stock: 6 },
        { id: 'prod-6', name: 'Ras Malai', price: 6.99, description: 'Traditional Indian sweet cheese dumplings', category: 'traditional', image: '/images/rasmalai.jpg', stock: 20 },
        { id: 'prod-7', name: 'Gulab Jamun', price: 7.99, description: 'Soft milk dumplings soaked in rose syrup', category: 'traditional', image: '/images/gulabjamun.jpg', stock: 18 },
        { id: 'prod-8', name: 'Ladoo Pack', price: 11.99, description: 'Traditional Indian sweets in various flavors', category: 'traditional', image: '/images/ladoo.jpg', stock: 14 },
      ];

      for (const product of initialProducts) {
        await db.run(`
          INSERT INTO products (id, name, price, description, category, image, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [product.id, product.name, product.price, product.description, product.category, product.image, product.stock]);
      }

      console.log('✅ Products initialized');
    }

    await db.close();

    console.log('✅ SQLite database setup completed successfully!');
    console.log('📍 Database file: server/sweets.db');
    console.log('\n🚀 You can now start the server with: npm start');
    console.log('👑 Admin login: admin@sweetshop.com / admin123');

  } catch (error) {
    console.error('❌ SQLite setup failed:', error.message);
    process.exit(1);
  }
}

setupSQLite();