import bcrypt from "bcrypt";
import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create a user with a hashed password
  const hashedPassword = await bcrypt.hash("password123", 10);
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
    ["alice", hashedPassword],
  );

  // Create at least 10 products
  const products = [
    ["Wireless Mouse", "Ergonomic wireless mouse with USB receiver", 19.99],
    ["Mechanical Keyboard", "RGB backlit mechanical keyboard", 79.99],
    ["USB-C Hub", "7-in-1 USB-C hub with HDMI and SD card slot", 34.5],
    ["Laptop Stand", "Adjustable aluminum laptop stand", 29.99],
    ["Webcam", "1080p HD webcam with built-in microphone", 45.0],
    ["Desk Lamp", "LED desk lamp with adjustable brightness", 22.5],
    ["Noise Cancelling Headphones", "Over-ear wireless headphones", 129.99],
    ["External SSD", "1TB portable solid state drive", 99.99],
    ["Monitor Arm", "Single monitor desk mount arm", 49.99],
    ["Bluetooth Speaker", "Portable speaker with 12hr battery life", 39.99],
    ["Phone Stand", "Adjustable phone and tablet stand", 12.99],
    ["Cable Organizer", "Set of reusable cable ties and clips", 8.99],
  ];

  const insertedProducts = [];
  for (const [title, description, price] of products) {
    const {
      rows: [product],
    } = await db.query(
      `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, price],
    );
    insertedProducts.push(product);
  }

  // Create an order for the user
  const {
    rows: [order],
  } = await db.query(
    `INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *`,
    ["2026-05-01", "First order", user.id],
  );

  // Add 5 distinct products to the order
  const orderedProducts = insertedProducts.slice(0, 5);
  for (const product of orderedProducts) {
    await db.query(
      `INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)`,
      [order.id, product.id, 2],
    );
  }
}
