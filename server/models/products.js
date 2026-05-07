import db from '../db.js';

// Product model functions
export const createProduct = async (productData) => {
  const { id, name, price, description, category, image, stock } = productData;
  const query = `
    INSERT INTO products (id, name, price, description, category, image, stock)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [id, name, price, description, category, image, stock];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getAllProducts = async () => {
  const query = 'SELECT * FROM products ORDER BY name';
  const result = await db.query(query);
  return result.rows;
};

export const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const updateProduct = async (id, productData) => {
  const { name, price, description, category, image, stock } = productData;
  const query = `
    UPDATE products
    SET name = $1, price = $2, description = $3, category = $4, image = $5, stock = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const values = [name, price, description, category, image, stock, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateProductStock = async (id, stock) => {
  const query = 'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
  const result = await db.query(query, [stock, id]);
  return result.rows[0];
};

export const getNextProductId = async () => {
  const query = "SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 0) + 1 as next_id FROM products WHERE id LIKE 'prod-%'";
  const result = await db.query(query);
  return `prod-${result.rows[0].next_id}`;
};