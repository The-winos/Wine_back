const express = require("express");
const { getAllFavoritesByUserId, removeFavorite } = require("../db/favorites");
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
    const deletedFavorite = await removeFavorite(favorite.id);
    res.send(deletedFavorite);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//UPDATE /api/favorites/:favoriteId
favoritesRouter.patch("/:favoriteId", requireUser, async (req, res, next) => {
  const { favoriteId } = req.params;
  const updateFields = req.body;
  try {
    const originalFavorite = await getAllFavoritesByUserId(favoriteId);

    if (originalFavorite) {
      const updatedFavorite = await updateFavorite(favoriteId, updateFields);
      console.log("this is updated favorite", updatedFavorite);
      res.send(updatedFavorite);
    } else {
      next({
        name: "favoriteDoesNotExist",
        message: `Favorite ${favoriteId} not found`,
        Error: "Favorite does not exist",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = favoritesRouter;
