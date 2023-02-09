const express = require("express");
const { getAllSavedByUserId, getSavedById } = require("../db/saved");
const { getUserById, getUserByUsername } = require("../db/users");
const savedRouter = express.Router();
const { requireUser } = require("./utils");

savedRouter.use((req, res, next) => {
  console.log("A request is being made to /saved");
  next();
});

savedRouter.get("/:username", async (req, res, next) => {
  const  username  = req.params.username;
  const user = await getUserByUsername(username)
  try {
    const savedWines = await getAllSavedByUserId(user.id);
    res.send(savedWines);
  } catch ({ name, message, error }) {
    next({
      name: "CantFindUser",
      message: "No user by that id",
      error: "NoUser",
    });
  }
});

savedRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const { user_id, wine_id } = req.body;
    const savedWines = await getAllSavedByUserId(user_id);
    const alreadySaved = savedWines.some((savedWine) => savedWine.wine_id === wine_id);
    if (alreadySaved) {
      throw {
        name: "WineAlreadySaved",
        message: "Wine is already saved",
        error: "WineAlreadySaved",
      };
    }
    const saved = await addSaved({ user_id, wine_id });
    res.send(saved);
  } catch ({ name, message, error }) {
    next({
      name,
      message,
      error,
    });
  }
});

savedRouter.delete("/:savedId", requireUser, async (req, res, next)=>{
  try {
    const {savedId}= req.params;
    const save = await getSavedById(savedId);
    const deletedSave= await deletedSave(save.id)
    res.send(deletedSave);
  } catch ({name, message, error}) {
    next({
      name:"ErrorOnDeletedSave",
      message:"Error deleted saved wine",
      error:"WineDeleteFail"
    });

  }
})





module.exports = savedRouter;
