import db from '../db.js';

// Order model functions
export const createOrder = async (orderData) => {
  const { id, userId, customerInfo, items, totalPrice, status = 'pending' } = orderData;
  const query = `
    INSERT INTO orders (id, user_id, customer_info, items, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [id, userId, JSON.stringify(customerInfo), JSON.stringify(items), totalPrice, status];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getAllOrders = async () => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows.map(order => ({
    ...order,
    customerInfo: order.customer_info,
    items: order.items,
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));
};

export const getOrderById = async (id) => {
  const query = 'SELECT * FROM orders WHERE id = $1';
  const result = await db.query(query, [id]);
  if (result.rows.length === 0) return null;

  const order = result.rows[0];
  return {
    ...order,
    customerInfo: order.customer_info,
    items: order.items,
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

export const getOrdersByUserId = async (userId) => {
  const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
  const result = await db.query(query, [userId]);
  return result.rows.map(order => ({
    ...order,
    customerInfo: order.customer_info,
    items: order.items,
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));
};

export const updateOrderStatus = async (id, status) => {
  const query = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
  const result = await db.query(query, [status, id]);
  if (result.rows.length === 0) return null;

  const order = result.rows[0];
  return {
    ...order,
    customerInfo: order.customer_info,
    items: order.items,
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

export const getNextOrderId = async () => {
  const query = "SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)), 999) + 1 as next_id FROM orders WHERE id LIKE 'ORD-%'";
  const result = await db.query(query);
  return `ORD-${result.rows[0].next_id}`;
};