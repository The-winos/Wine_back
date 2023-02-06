const express = require("express");
const { getAllFavoritesByUserId } = require("../db/favorites");
const favoritesRouter = express.Router();
const { requireUser } = require("./utils");

favoritesRouter.use((req, res, next) => {
  console.log("A request is being made to /favorites");
  next();
});

// GET /api/favorites/:id
favoritesRouter.get("/:id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const favoritesId = await getAllFavoritesByUserId({ user_id });
    res.send(favoritesId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/favorites/:favoritesId
favoritesRouter.delete("/:favoriteId", requireUser, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const favorite = await getAllFavoritesByUserId({ user_id });
    const deletedFavorite = await destroyReview(favorite.id);
    res.send(deletedFavorite);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = favoritesRouter;
