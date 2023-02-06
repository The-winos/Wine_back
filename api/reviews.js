const express = require("express");
const reviewsRouter = express.Router();
const { getAllReviews, getReviewByUser } = require("../db/reviews");
const { requireUser } = require("./utils");

reviewsRouter.use((req, res, next) => {
  console.log("A request is being made to /reviews");
  next();
});

// GET /api/reviews
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const allReviews = await getAllReviews();
    res.send(allReviews);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/reviews/:id
reviewsRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const reviewsId = await getReviewById(id);
    res.send(reviewsId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//POST /api/reviews
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
    const possibleReview = await getReviewByUser(id);
    if (!possibleReview) {
      const newReview = await createReview(reviewData);
      if (newReview) {
        res.send(newReview);
      }
    } else {
      next({
        name: "UserReviewExists",
        message: `A review with that username ${id} already exists`,
        error: "UserReviewExists",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//DELETE /api/reviews/:reviewId
reviewsRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await getReviewByUser(reviewId);
    const deletedReview = await destroyReview(review.id);
    res.send(deletedReview);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//UPDATE /api/reviews/:reviewId
reviewsRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params;
  const updateFields = req.body;
  try {
    const originalReview = await getReviewByUser(reviewId);

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
