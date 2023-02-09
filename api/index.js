const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");

apiRouter.use("/", async (req, res, next) => {
  console.log("find some wine");
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

// const adminRouter = require("./admin");
// apiRouter.use("/admin", adminRouter);

// const badgesRouter = require("./badges");
// apiRouter.use("/badges", badgesRouter);

const favoritesRouter = require("./favorites");
apiRouter.use("/favorites", favoritesRouter);

const followersRouter = require("./followers");
apiRouter.use("/followers", followersRouter);

const reviewsRouter = require("./reviews");
apiRouter.use("/reviews", reviewsRouter);

// const savedRouter = require("./saved");
// apiRouter.use("/saved", savedRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const winesRouter = require("./wines");
apiRouter.use("/wines", winesRouter);

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
