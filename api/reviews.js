const express = require("express");
const reviewsRouter = express.Router();
const {
  createReview,
  destroyReview,
  getAllReviews,
  getReviewByUser,
  getReviewById,
  updateReview,
  getReviewByIdAndUserId,
} = require("../db/reviews");
const { requireUser } = require("./utils");

reviewsRouter.use((req, res, next) => {
  console.log("A request is being made to /reviews");
  next();
});

// GET /api/reviews //passed get all reviews and error
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const allReviews = await getAllReviews();
    res.send(allReviews);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/reviews/:id //passed get review by user ID and error
reviewsRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log("is this id", id);

  try {
    const reviewsId = await getReviewByUser(id);

    res.send(reviewsId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//POST /api/reviews // passed create and error
reviewsRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const {
      wine_id,
      user_id,
      name,
      rating,
      price,
      review_comment,
      image_url,
      review_date,
      location,
    } = req.body;
    const reviewData = {
      wine_id,
      user_id,
      name,
      rating,
      price,
      review_comment,
      image_url,
      review_date,
      location,
    };
    const possibleReview = await getReviewByUser(user_id);
    console.log("Review?", possibleReview.wine_id);
    if (possibleReview.length > 0) {
      const existingReview = possibleReview.some(
        (review) => review.wine_id === wine_id
      );
    console.log(possibleReview,"possiable")
      console.log(existingReview, "existing")
      if (!existingReview) {
        const newReview = await createReview(reviewData);
        if (newReview) {
          res.send(newReview);
        }
      } else {
        next({
          name: "UserReviewExists",
          message: `A review with that wine ${wine_id} already exists`,
          error: "UserReviewExists",
        });
      }
    }

  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/reviews/:reviewId //passed destroy and error
reviewsRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await getReviewById(reviewId);
    console.log("review?", review.user_id);
    console.log("which user?", req.user.id);
    if (req.user.id == review.user_id) {
      const deletedReview = await destroyReview(reviewId);
      res.send(deletedReview);
    } else {
      next({
        name: "unauthorizedUser",
        message: `User ${req.user.username} cannot delete unauthorized review`,
        Error: "Unauthorized User",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//UPDATE /api/reviews/:reviewId //passed update and error
reviewsRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params;
  const updateFields = req.body;
  try {
    const originalReview = await getReviewByIdAndUserId(reviewId, req.user.id);

    if (originalReview) {
      const updatedReview = await updateReview(reviewId, updateFields);
      console.log("this is updated review", updatedReview);
      res.send(updatedReview);
    } else {
      next({
        name: "reviewDoesNotExist",
        message: `Review ${reviewId} not found`,
        Error: "Review does not exist",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = reviewsRouter;
