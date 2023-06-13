const express = require("express");
const { getAllSavedByUserId, getSavedById, addSaved, removeSaved } = require("../db/saved");
const { getUserById, getUserByUsername } = require("../db/users");
const savedRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");

savedRouter.use((req, res, next) => {
  console.log("A request is being made to /saved");
  next();
});

//tested with errors and working
savedRouter.get("/:userId", async (req, res, next) => {
  const  userId  = req.params.userId;
  const user = await getUserById(userId)
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

// tested with errors, added safe gaurd to insure logged in user or admin are only one that can update this
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
    if(req.user.id != user_id && req.user.role != "admin"){
      throw {
        name: "Not correct user",
        message: "Must be the logged in user to add to saved",
        error: "NotCorrectUser",
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

// tested requireUserOrAdmin didn't work so we will need to safe gaurd that in the front end to ensure the loggedin user is the one that posted, added, ect
savedRouter.delete("/:savedId", requireUser || requireAdmin, async (req, res, next)=>{
  try {
    const {savedId}= req.params;
    const save = await getSavedById(savedId);
    const deletedSave= await removeSaved(save.id)
    res.send(deletedSave);
  } catch ({name, message, error}) {
    next({
      name:"ErrorOnDeletedSave",
      message:"Error deleted saved wine",
      error:"WineDeleteFail"
    });
  }
});






module.exports = savedRouter;
