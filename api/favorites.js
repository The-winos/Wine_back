const express = require("express");
const { getAllFavoritesByUserId, removeFavorite } = require("../db/favorites");
const favoritesRouter = express.Router();
const { requireUser } = require("./utils");

favoritesRouter.use((req, res, next) => {
  console.log("A request is being made to /favorites");
  next();
});

// GET /api/favorites/:userId
favoritesRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const favoritesId = await getAllFavoritesByUserId({ userId });
    res.send(favoritesId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/favorites/:favoritesId
favoritesRouter.delete("/:favoriteId", requireUser, async (req, res, next) => {
  //you can access the req.params here
  const favoriteId = req.params;
  try {
    // favoriteId is already in the params so you don't need to find it again

    // const { user_id } = req.params;
    // const favorite = await getAllFavoritesByUserId({ user_id });
    const deletedFavorite = await removeFavorite(favoriteId);
    res.send(deletedFavorite);
  } catch ({ name, message, error }) {
    next({
      name: "NoFavorite",
      message: "No favorite with that id",
      error: "couldntFindFavorite",
    });
  }
});

// don't think we need the one below but we do need a post one for adding to favorites

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
