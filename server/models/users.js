import db from '../db.js';

// User model functions
export const createUser = async (userData) => {
  const { id, email, name, password, role = 'customer' } = userData;
  const query = `
    INSERT INTO users (id, email, name, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, name, role, created_at
  `;
  const values = [id, email, name, password, role];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const query = 'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows;
};

export const updateUserRole = async (id, role) => {
  const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, name, role';
  const result = await db.query(query, [role, id]);
  return result.rows[0];
};

export const getNextUserId = async () => {
  const result = await db.query(`
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 0) + 1 AS next_id
    FROM users
    WHERE id ~ '^user-[0-9]+$'
  `);
  return `user-${result.rows[0].next_id}`;
};