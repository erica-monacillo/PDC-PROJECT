import db from '../sqlite-db.js';

// Order model functions for SQLite
export const createOrder = async (orderData) => {
  const { id, userId, customerInfo, items, totalPrice, status = 'pending' } = orderData;
  const query = `
    INSERT INTO orders (id, user_id, customer_info, items, total_price, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [id, userId, JSON.stringify(customerInfo), JSON.stringify(items), totalPrice, status];
  await db.query(query, values);
  return { ...orderData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
};

export const getAllOrders = async () => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows.map(order => ({
    ...order,
    customerInfo: JSON.parse(order.customer_info),
    items: JSON.parse(order.items),
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));
};

export const getOrderById = async (id) => {
  const query = 'SELECT * FROM orders WHERE id = ?';
  const result = await db.query(query, [id]);
  if (result.rows.length === 0) return null;

  const order = result.rows[0];
  return {
    ...order,
    customerInfo: JSON.parse(order.customer_info),
    items: JSON.parse(order.items),
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

export const getOrdersByUserId = async (userId) => {
  const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  const result = await db.query(query, [userId]);
  return result.rows.map(order => ({
    ...order,
    customerInfo: JSON.parse(order.customer_info),
    items: JSON.parse(order.items),
    totalPrice: order.total_price,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));
};

export const updateOrderStatus = async (id, status) => {
  const query = 'UPDATE orders SET status = ?, updated_at = datetime(\'now\') WHERE id = ?';
  await db.query(query, [status, id]);
  return await getOrderById(id);
};

export const getNextOrderId = async () => {
  const query = "SELECT COALESCE(MAX(CAST(SUBSTRING(id, 5) AS INTEGER)), 999) + 1 as next_id FROM orders WHERE id LIKE 'ORD-%'";
  const result = await db.query(query);
  return `ORD-${result.rows[0].next_id}`;
};