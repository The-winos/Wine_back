const express = require("express");
const { getAllSavedByUserId } = require("../db/saved");
const { getUserById, getUserByUsername } = require("../db/users");
const savedRouter = express.Router();
const { requireUser } = require("./utils");

savedRouter.use((req, res, next) => {
  console.log("A request is being made to /saved");
  next();
});

savedRouter.get("/:username", async (req, res, next) => {
  const  username  = req.params.username;
  const user= await getUserByUsername(username)
  try {
    const savedWines = await getAllSavedByUserId(user.id);
    console.log(savedWines, "why empty?")
    res.send(savedWines);
  } catch ({ name, message, error }) {
    next({
      name: "CantFindUser",
      message: "No user by that id",
      error: "NoUser",
    });
  }
});


module.exports = savedRouter;
