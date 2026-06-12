import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#routers/users";
import productsRouter from "#routers/products";
import ordersRouter from "#routers/orders";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

export default app;
