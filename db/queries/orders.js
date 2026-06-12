import db from "#db/client";

export async function createOrder(date, note, userId) {
  const {
    rows: [order],
  } = await db.query(
    `INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *`,
    [date, note, userId],
  );
  return order;
}

export async function getOrdersByUserId(userId) {
  const { rows } = await db.query(`SELECT * FROM orders WHERE user_id = $1`, [
    userId,
  ]);
  return rows;
}

export async function getOrderById(id) {
  const {
    rows: [order],
  } = await db.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return order;
}

export async function addProductToOrder(orderId, productId, quantity) {
  const {
    rows: [orderProduct],
  } = await db.query(
    `INSERT INTO orders_products (order_id, product_id, quantity)
     VALUES ($1, $2, $3) RETURNING *`,
    [orderId, productId, quantity],
  );
  return orderProduct;
}

export async function getProductsByOrderId(orderId) {
  const { rows } = await db.query(
    `SELECT products.*
     FROM products
     JOIN orders_products ON products.id = orders_products.product_id
     WHERE orders_products.order_id = $1`,
    [orderId],
  );
  return rows;
}

export async function getOrdersByUserAndProduct(userId, productId) {
  const { rows } = await db.query(
    `SELECT orders.*
     FROM orders
     JOIN orders_products ON orders.id = orders_products.order_id
     WHERE orders.user_id = $1 AND orders_products.product_id = $2`,
    [userId, productId],
  );
  return rows;
}
