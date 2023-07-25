const express = require("express");
const { getAllFavoritesByUserId, removeFavorite, getFavoritedById, addFavorite, getAllFavoritesByWineId } = require("../db/favorites");
const { getUserById } = require("../db/users");
const favoritesRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { getWineById } = require("../db/wines");

favoritesRouter.use((req, res, next) => {
  console.log("A request is being made to /favorites");
  next();
});

//tested with errors
// GET /api/favorites/:userId
favoritesRouter.get("/:userId", async (req, res, next) => {
  const  userId  = req.params.userId;
  console.log(userId, "userId")
  const user = await getUserById(userId)
  console.log(user, "user")
  try {
    const favoriteWines = await getAllFavoritesByUserId({user_id:user.id});
    if(!favoriteWines.length){
      next({
        name: "NoWines favored",
        message: "No wines favorited",
        error: "NoFavor",
      });
    }
    res.send(favoriteWines);
  } catch ({ name, message, error }) {
    next({
      name: "CantFindUser",
      message: "No user by that id",
      error: "NoUser",
    });
  }
});

// GET /api/favorites/wine/:wineId
favoritesRouter.get("/wine/:wineId", async (req, res, next) => {
  const  wineId  = req.params.wineId;
  console.log(wineId, "wineId")
  const wine = await getWineById(wineId)
  console.log(wine, "wine")
  try {
    const favoriteWines = await getAllFavoritesByWineId({wine_id:wine.id});
    if(!favoriteWines.length){
      next({
        name: "NoWines favored",
        message: "No wines favorited",
        error: "NoFavor",
      });
    }
    res.send(favoriteWines);
  } catch ({ name, message, error }) {
    next({
      name: "CantFindwine",
      message: "No wine by that id",
      error: "Nowine",
    });
  }
});


//tested with errors
favoritesRouter.delete("/:favoriteId", requireUser || requireAdmin, async (req, res, next)=>{
  try {
    const {favoriteId}= req.params;
    const deletedFavorite= await removeFavorite(favoriteId)
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
    const favoriteWines = await getAllFavoritesByUserId({user_id});
    const alreadyFavored = favoriteWines.some((favoriteWine) =>favoriteWine.wine_id === wine_id);
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
    const favor = await addFavorite( user_id, wine_id );
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
