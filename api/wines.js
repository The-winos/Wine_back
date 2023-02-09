const e = require("express");
const express = require("express");
const winesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getAllWines, getWineById, getWineByFlavor, getWineByName, createWine, destroyWine, updateWine } = require("../db/wines");
const { requireUser, requireAdmin } = require("./utils");

winesRouter.use((req, res, next) => {
  console.log("A request is being made to /wines");
  next();
});

winesRouter.get("/", async (req, res, next) => {
  try {
    const allWines = await getAllWines();
    res.send(allWines);
  } catch ({ name, message, error }) {
    next({
      name: "NoWines",
      message: "Couldn't get Wines",
      error: "NoWine",
    });
  }
});

winesRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const wineId = getWineById(id);
    res.send(wineId);
  } catch ({ name, message, error }) {
    next({
      name: "NoWineId",
      message: `Couldn't find wine by id ${id}`,
      error: "noWineById",
    });
  }
});

winesRouter.get("/flavor:type", async(req, res, next)=>{
  const {type: flavor}= req.params;
  try {
    const flavorType= await getWineByFlavor(flavor);
    res.send(flavorType);
  } catch ({name, message, error}) {
    next({
      name:"NoWineByThatFlavor",
      message: `Couldn't find any ${flavor} wine`,
      name:"NoFlavorWine"
    })

  }
})

winesRouter.post("/", requireUser, async(req, res, next)=>{
  try {
    const{
      author_id,
      name,
      image_url,
      price,
      region,
      flavor
    }= req.body;
    const wineData={
      author_id,
      name,
      image_url,
      price,
      region,
      flavor
    };
    const possiableWine= await getWineByName(name);
    if(!possiableWine){
      const newWine= await createWine(wineData);
      if(newWine){
        res.send(newWine);
      }
    }else{
      next({
        name:"wineExists",
        message: `A wine with the name ${name} already exists`,
        error:"duplicateWine",
      });
    }
  } catch ({name, message, error}) {
    next({name, message, error});

  }
});

winesRouter.delete("/:wineName", requireAdmin, async(req, res, next)=>{
  try {
   const{wineName}=req.params;
   const wine= await getWineByName(wineName);
   const deletedWine= await destroyWine(wine.id);
   res.send(deletedWine);
  } catch ({name, message, error}) {
    next({
      name:"NoWineToDelete",
      message:`No wine by the name of ${wineName} to delete`,
      error:"WineDeleteError"
    })
    };

  }
)

winesRouter.patch("/:wineName", requireUser, async(req, res, next)=>{
  const {wineName}=req.params;
  const updateFields= req.body;
  try {
    const originalWine= await getWineByName(wineName);
    if(originalWine){
      const updatedWine= await updateWine(originalWine.id, updateFields);
      res.send(updatedWine);
    }else{
      next({
        name:"WineDoesNotExist",
        message:`Wine ${wineName} not found`,
        error:"WineNotFound",
      });
    }
  } catch ({name, message, error}) {
    next({name, message, error});

  }
})

module.exports = winesRouter;
