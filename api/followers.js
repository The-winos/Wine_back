const express = require("express");
const {
  destroyFollower,
  getFollowingByUser,
  updateFollower,
  getFollowerByUser,
  addFollower,
} = require("../db/followers");
const followersRouter = express.Router();
const { requireUser } = require("./utils");

followersRouter.use((req, res, next) => {
  console.log("A request is being made to /followers");
  next();
});

// GET /api/followers
followersRouter.get("/", async (req, res, next) => {
  try {
    const allFollowers = await getAllFollowers();
    res.send(allFollowers);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/follower/:id
followersRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const followersId = await getFollowerByUser({ id });
    res.send(followersId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/followers:followerId
followersRouter.delete("/:followerId", requireUser, async (req, res, next) => {
  try {
    const { followerId } = req.params;
    const follower = await getFollowerByUser({ id });
    const deletedFollower = await destroyFollower(follower.id);
    res.send(deletedFollower);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//UPDATE /api/followers/:userId
followersRouter.post("/:user_id", requireUser, async (req, res, next) => {
  const { user_id } = req.params;
  const { follower_id } = req.body; // retrieve the follower ID from the request body
  const updateFields = req.body;
  try {
    const originalFollower = await getFollowingByUser({ user_id });

    if (originalFollower) {
      const updatedFollower = await addFollower({user_id, follower_id}); // pass in the user ID and follower ID
      console.log("this is updated follower", updatedFollower);
      res.send(updatedFollower);
    } else {
      next({
        name: "followerDoesNotExist",
        message: `Follower ${followerId} not found`,
        Error: "Follower does not exist",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});


module.exports = followersRouter;
