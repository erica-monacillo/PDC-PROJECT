import db from '../sqlite-db.js';

// Product model functions for SQLite
export const createProduct = async (productData) => {
  const { id, name, price, description, category, image, stock } = productData;
  const query = `
    INSERT INTO products (id, name, price, description, category, image, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id, name, price, description, category, image, stock];
  await db.query(query, values);
  return { ...productData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
};

export const getAllProducts = async () => {
  const query = 'SELECT * FROM products ORDER BY name';
  const result = await db.query(query);
  return result.rows;
};

export const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const updateProduct = async (id, productData) => {
  const { name, price, description, category, image, stock } = productData;
  const query = `
    UPDATE products
    SET name = ?, price = ?, description = ?, category = ?, image = ?, stock = ?, updated_at = datetime('now')
    WHERE id = ?
  `;
  const values = [name, price, description, category, image, stock, id];
  await db.query(query, values);
  return { ...productData, id, updated_at: new Date().toISOString() };
};

export const updateProductStock = async (id, stock) => {
  const query = 'UPDATE products SET stock = ?, updated_at = datetime(\'now\') WHERE id = ?';
  await db.query(query, [stock, id]);
  return await getProductById(id);
};

export const getNextProductId = async () => {
  const query = "SELECT COALESCE(MAX(CAST(SUBSTRING(id, 6) AS INTEGER)), 0) + 1 as next_id FROM products WHERE id LIKE 'prod-%'";
  const result = await db.query(query);
  return `prod-${result.rows[0].next_id}`;
};