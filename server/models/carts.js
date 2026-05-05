import db from '../db.js';

// Cart model functions
export const createCart = async (userId) => {
  const query = 'INSERT INTO carts (user_id, items, total) VALUES ($1, $2, $3)';
  const values = [userId, JSON.stringify([]), 0];
  await db.query(query, values);
};

export const getCartByUserId = async (userId) => {
  const query = 'SELECT * FROM carts WHERE user_id = $1';
  const result = await db.query(query, [userId]);

  if (result.rows.length === 0) {
    // Create cart if it doesn't exist
    await createCart(userId);
    return { userId, items: [], total: 0 };
  }

  const cart = result.rows[0];
  return {
    userId: cart.user_id,
    items: cart.items || [],
    total: parseFloat(cart.total) || 0
  };
};

export const updateCart = async (userId, items, total) => {
  const query = 'UPDATE carts SET items = $1, total = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3';
  const values = [JSON.stringify(items), total, userId];
  await db.query(query, values);
};

export const clearCart = async (userId) => {
  const query = 'UPDATE carts SET items = $1, total = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3';
  const values = [JSON.stringify([]), 0, userId];
  await db.query(query, values);
};