const express = require("express");
const { getAllFavoritesByUserId, removeFavorite, getFavoritedById, addFavorite } = require("../db/favorites");
const favoritesRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");

favoritesRouter.use((req, res, next) => {
  console.log("A request is being made to /favorites");
  next();
});

// GET /api/favorites/:userId
favoritesRouter.get("/:userId", async (req, res, next) => {
  const  userId  = req.params.userId;
  const user = await getUserById(userId)
  try {
    const favoriteWines = await getAllFavoritesByUserId(user.id);
    res.send(favoriteWines);
  } catch ({ name, message, error }) {
    next({
      name: "CantFindUser",
      message: "No user by that id",
      error: "NoUser",
    });
  }
});


favoritesRouter.delete("/:favoriteId", requireUser || requireAdmin, async (req, res, next)=>{
  try {
    const {favoriteId}= req.params;
    const favorite = await getFavoritedById(favoriteId);
    const deletedFavorite= await removeFavorite(favorite.id)
    res.send(deletedFavorite);
  } catch ({name, message, error}) {
    next({
      name:"ErrorOnDeletedFavorite",
      message:"Error deleting favorited wine",
      error:"WineDeleteFail"
    });
  }
});

favoritesRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const { user_id, wine_id } = req.body;
    const favoriteWines = await getAllFavoritesByUserId(user_id);
    const alreadyFavored = favoriteWines.some((favoriteWine) => favoriteWine.wine_id === wine_id);
    if (alreadyFavored) {
      throw {
        name: "WineAlreadyFavorited",
        message: "Wine is already on favorite list",
        error: "WineAlreadyFavored",
      };
    }
    if(req.user.id != user_id && req.user.role != "admin"){
      throw {
        name: "Not correct user",
        message: "Must be the logged in user to add to saved",
        error: "NotCorrectUser",
      };
    }
    const favor = await addFavorite({ user_id, wine_id });
    res.send(favor);
  } catch ({ name, message, error }) {
    next({
      name,
      message,
      error,
    });
  }
});

module.exports = favoritesRouter;
