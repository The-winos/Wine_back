const express = require("express");
const { getBadgeById, updateBadge } = require("../db/badges");
const { requireUser, requireAdmin } = require("./utils");
const badgesRouter = express.Router();

badgesRouter.use((req, res, next) => {
  console.log("A request is being made to /badges");
  next();
});

// GET /api/badges/:userId //tests passed and errors
badgesRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const badgesId = await getBadgeById(userId);

    delete badgesId.id;
    delete badgesId.author_id;
    res.send(badgesId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/badges/:badgesId
// badgesRouter.delete("/:badgesId", requireUser, async (req, res, next) => {
//   const badgesId = req.params;
//   try {
//     const deletedBadge = await removeBadge(BadgeId);
//     res.send(deletedBadge);
//   } catch ({ name, message, error }) {
//     next({
//       name: "BadgeRemoved",
//       message: "No badge with that id",
//       error: "BadgeRemoved",
//     });
//   }
// });

//PATCH /api/badges/:badges //tests passed and errors
badgesRouter.patch("/:badgesId", requireAdmin, async (req, res, next) => {
  const { badgesId } = req.params;
  const updateFields = req.body;
  try {
    const originalBadges = await getBadgeById(badgesId);

    if (originalBadges) {
      const updatedBadge = await updateBadge(badgesId, updateFields);

      delete updatedBadge.id;
      delete updatedBadge.author_id;
      res.send(updatedBadge);
    } else {
      next({
        name: "badgeDoesNotExist",
        message: `Badge ${badgesId} not found`,
        Error: "badge does not exist",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = badgesRouter;
