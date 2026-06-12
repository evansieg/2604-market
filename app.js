import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#routers/users";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);

export default app;
