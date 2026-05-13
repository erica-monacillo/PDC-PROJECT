import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

try {
  await pool.query(`
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
    ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('pending', 'processing', 'delivering', 'completed', 'cancelled'));
  `);
  console.log('✅ Render database constraint updated!');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await pool.end();
  process.exit(0);
}