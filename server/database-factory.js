import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine database type
const USE_SQLITE = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('sqlite:');
const USE_POSTGRES = !USE_SQLITE && (process.env.DB_HOST || process.env.DB_NAME);

export async function initializeDatabaseSystem() {
  if (USE_SQLITE) {
    console.log('📱 Using SQLite database');
    const sqliteDb = await import('./sqlite-db.js');
    const userModel = await import('./models-sqlite/users.js');
    const productModel = await import('./models-sqlite/products.js');
    const orderModel = await import('./models-sqlite/orders.js');
    const cartModel = await import('./models-sqlite/carts.js');

    console.log('SQLite models loaded:', {
      userModel: !!userModel,
      productModel: !!productModel,
      orderModel: !!orderModel,
      cartModel: !!cartModel,
      productModelKeys: Object.keys(productModel)
    });

    return {
      db: sqliteDb.default,
      userModel,
      productModel,
      orderModel,
      cartModel,
      testConnection: sqliteDb.testConnection,
      initializeDatabase: sqliteDb.initializeDatabase
    };
  } else if (USE_POSTGRES) {
    console.log('🐘 Using PostgreSQL database');
    const postgresDb = await import('./db.js');
    const userModel = await import('./models/users.js');
    const productModel = await import('./models/products.js');
    const orderModel = await import('./models/orders.js');
    const cartModel = await import('./models/carts.js');

    return {
      db: postgresDb.default,
      userModel,
      productModel,
      orderModel,
      cartModel,
      testConnection: postgresDb.testConnection,
      initializeDatabase: postgresDb.initializeDatabase
    };
  } else {
    console.log('💾 Using in-memory storage (data will not persist)');
    // Fallback to in-memory (no database)
    return {
      db: null,
      userModel: null,
      productModel: null,
      orderModel: null,
      cartModel: null,
      testConnection: () => true,
      initializeDatabase: () => {}
    };
  }
}