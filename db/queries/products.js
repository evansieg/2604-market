import db from "#db/client";

export async function getAllProducts() {
  const { rows } = await db.query(`SELECT * FROM products`);
  return rows;
}

export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return product;
}
