import express from "express";
import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByUserAndProduct } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");
    res.send(product);
  } catch (e) {
    next(e);
  }
});

router.get("/:id/orders", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");

    if (!req.user) return res.status(401).send("Unauthorized.");

    const orders = await getOrdersByUserAndProduct(req.user.id, product.id);
    res.send(orders);
  } catch (e) {
    next(e);
  }
});

export default router;
