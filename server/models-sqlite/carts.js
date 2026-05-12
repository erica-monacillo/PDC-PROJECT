import db from '../sqlite-db.js';

// Cart model functions for SQLite
export const createCart = async (userId) => {
  const query = 'INSERT OR IGNORE INTO carts (user_id, items, total) VALUES (?, ?, ?)';
  const values = [userId, JSON.stringify([]), 0];
  await db.query(query, values);
};

export const getCartByUserId = async (userId) => {
  const query = 'SELECT * FROM carts WHERE user_id = ?';
  const result = await db.query(query, [userId]);

  if (result.rows.length === 0) {
    // Create cart if it doesn't exist
    await createCart(userId);
    return { userId, items: [], total: 0 };
  }

  const cart = result.rows[0];
  return {
    userId: cart.user_id,
    items: JSON.parse(cart.items || '[]'),
    total: parseFloat(String(cart.total)) || 0
  };
};

export const updateCart = async (userId, items, total) => {
  const query = 'UPDATE carts SET items = ?, total = ?, updated_at = datetime(\'now\') WHERE user_id = ?';
  const values = [JSON.stringify(items), total, userId];
  await db.query(query, values);
};

export const clearCart = async (userId) => {
  const query = 'UPDATE carts SET items = ?, total = ?, updated_at = datetime(\'now\') WHERE user_id = ?';
  const values = [JSON.stringify([]), 0, userId];
  await db.query(query, values);
};