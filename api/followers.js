const express = require("express");
const {
  destroyFollower,
  getFollowingByUser,
  updateFollower,
  getFollowerByUser,
  addFollower,
  getFollowerById,
  deleteFollowersByUserId,
  deleteFollowersByFollowerId,
  getAllFollowers,
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
followersRouter.get("/user/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id, "in route follower")
  console.log(typeof id)
  try {
    const followersId = await getFollowerByUser({ id });
    console.log(followersId, "anything here followers?")
    res.send(followersId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

followersRouter.get("/follower/:follower_id", async (req, res, next) => {
  const { follower_id } = req.params;
  console.log(follower_id, "in route following")

  console.log(typeof follower_id)
  try {
    const followersId = await getFollowingByUser(follower_id);
    console.log(followersId, "anything here following?")
    res.send(followersId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});


//DELETE /api/followers:followerId
// DELETE /api/followers/follower/:followerId
followersRouter.delete("/follower/:followerId", requireUser, async (req, res, next) => {
  try {
    const { followerId } = req.params;
    console.log(followerId, "delete follower route")
    const deletedFollower = await deleteFollowersByFollowerId(followerId);
    res.send(deletedFollower);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/followers/user/:userId
followersRouter.delete("/user/:userId", requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId, "delete user route")
    const deletedFollowers = await deleteFollowersByUserId(userId);
    res.send(deletedFollowers);
  } catch (error) {
    next(error);
  }
});


//UPDATE /api/followers/:userId
followersRouter.post("/:user_id", requireUser, async (req, res, next) => {
  const { user_id } = req.params;
  const { follower_id } = req.body; // retrieve the follower ID from the request body
  const updateFields = req.body;
  console.log(user_id, "what's this?")
  try {
    const originalFollower = await getFollowingByUser(user_id );
    console.log(originalFollower, "orginalFollower")

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
