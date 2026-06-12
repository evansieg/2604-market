import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  addProductToOrder,
  getProductsByOrderId,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.use(requireUser);

router.post("/", requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;
    const order = await createOrder(date, note, req.user.id);
    res.status(201).send(order);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");
    res.send(order);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found.");
      if (order.user_id !== req.user.id)
        return res.status(403).send("Forbidden.");

      const { productId, quantity } = req.body;
      const product = await getProductById(productId);
      if (!product) return res.status(400).send("Product does not exist.");

      const orderProduct = await addProductToOrder(
        order.id,
        productId,
        quantity,
      );
      res.status(201).send(orderProduct);
    } catch (e) {
      next(e);
    }
  },
);

router.get("/:id/products", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");

    const products = await getProductsByOrderId(order.id);
    res.send(products);
  } catch (e) {
    next(e);
  }
});

export default router;
