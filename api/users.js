const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getReviewByUser } = require("../db/reviews");
const {
  getUser,
  getUserByUsername,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
} = require("../db/users");
const { requireAdmin, requireUser, requireUserOrAdmin } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

//tested with incorrect info, and expired token
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    console.log(username, password, "banana");
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({
        token,
        user,
        message: "You're logged in!",
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// tested with error and refined password to all 1 if statement

usersRouter.post("/register", async (req, res, next) => {
  const {
    username,
    password,
    name,
    state,
    avatar,
    role,
    email,
    birthday,
    follower_count,
    following_count,
  } = req.body;
  try {
    const user = await getUserByUsername(username);

    if (user) {
      // check if user exists
      next({
        error: "DuplicateUsername",
        message:
          "This username is already taken. Please choose a different one.",
        name: "Duplicate Username",
      });
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}/.test(password)) {
      next({
        error: "PasswordRequirementsNotMet",
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. You can also include optional special characters.",
        name: "Password Requirements Not Met",
      });
    } else if (new Date().getFullYear() - birthday < 21) {
      next({
        error: "UnderageRegistration",
        message: "You must be at least 21 years old to register.",
        name: "Underage Registration",
      });
    } else {
      const newUser = await createUser({
        username,
        password,
        name,
        state,
        avatar,
        role,
        email,
        birthday,
        follower_count,
        following_count,
      });
      const token = jwt.sign(newUser, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({
        message: "Thank you for registering!",
        token,
        user: newUser,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//tested with error
usersRouter.get("/me", async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      next({
        error: "unauthorized",
        name: "Invalid credentials",
        message: "You must be logged in",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
});

// tested with error
usersRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await getUserById(id);

    if (user) {
      delete user.password;
      res.send(user);
    } else {
      next({
        error: "unknownUser",
        name: "No User by that id",
        message: `no user found by id of ${id}`,
      });
    }
  } catch (error) {
    next({
      error: "unknownUser",
      name: "No User by that id",
      message: `no user found by id of ${id}`,
    });
  }
});

//tested with errors, fixed requireadmin incase no one is logged in to get the correct error message
usersRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    next({ message: "error getting users" });
  }
});

//tested with errors
usersRouter.delete("/:username", requireAdmin, async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    const deletedUser = deleteUser(user.id);
    res.send(deletedUser);
  } catch ({ name, message, error }) {
    next({
      name: "UnfoundUser",
      message: "Couldn't find that username",
      error: "errorDeletingUser",
    });
  }
});

//tested with errors, made new middleware for requireuser or admin
usersRouter.patch(
  "/:username",
  requireUser || requireAdmin,
  async (req, res, next) => {
    const { username } = req.params;
    const updateFields = req.body;
    const isAdmin = req.user.role;
    console.log(req.user, "lets look");

    if (isAdmin != "admin") {
      delete updateFields.role;
    }
    try {
      const originalUser = await getUserByUsername(username);
      if (originalUser) {
        const updatedUser = await updateUser(originalUser.id, updateFields);
        res.send(updatedUser);
      } else {
        next({
          name: "UserDoesNotExist",
          message: `User ${username} not found`,
          Error: "User does not exist",
        });
      }
    } catch ({ name, message, error }) {
      next({ name, message, error });
    }
  }
);

// GET /api/reviews/:id //passed get review by user ID and error
usersRouter.get("/:id/reviews", async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviewsId = await getReviewByUser(id);

    res.send(reviewsId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = usersRouter;
