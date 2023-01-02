const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");

apiRouter.use("/", async (req, res, next) => {
  console.log("find some books");
  next();
});

apiRouter.get("/", (req, res, next) => {
  console.log("A get request was made to /api");
  res.send({ message: "success" });
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {

        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const addressRouter = require("./address");
apiRouter.use("/address", addressRouter);

const userRouter = require("./user");
apiRouter.use("/user", userRouter);

const productRouter = require("./product");
apiRouter.use("/product", productRouter);

const cartRouter = require("./cart");
apiRouter.use("/cart", cartRouter);

const cart_itemRouter = require("./cart_item");
apiRouter.use("/cart_item", cart_itemRouter);

apiRouter.use((error, req, res, next) => {
  error.error == "Unauthorized" && res.status(401);
  const errorObj = {
    error: error.name,
    name: error.name,
    message: error.message,
  };
  res.send(errorObj);
});

module.exports = apiRouter;
