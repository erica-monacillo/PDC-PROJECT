import db from '../sqlite-db.js';

// User model functions for SQLite
export const createUser = async (userData) => {
  const { id, email, name, password, role = 'customer' } = userData;
  const query = `
    INSERT INTO users (id, email, name, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [id, email, name, password, role];
  await db.query(query, values);
  return { id, email, name, role, created_at: new Date().toISOString() };
};

export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const query = 'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows;
};

export const updateUserRole = async (id, role) => {
  const query = 'UPDATE users SET role = ? WHERE id = ?';
  await db.query(query, [role, id]);
  return { id, role };
};

export const getNextUserId = async () => {
  const query = "SELECT COALESCE(MAX(CAST(SUBSTRING(id, 6) AS INTEGER)), 0) + 1 as next_id FROM users WHERE id LIKE 'user-%'";
  const result = await db.query(query);
  return `user-${result.rows[0].next_id}`;
};