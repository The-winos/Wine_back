const { client } = require("./client");

async function createReview(
  user_id,
  wines_id,
  rating,
  price,
  review_comment,
  image_url,
  review_date
) {
  try {
    const {
      rows: [reviews],
    } = await client.query(
      `
        INSERT INTO reviews(user_id, wines_id, rating, price, review_comment, image_url, review_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,
      [user_id, wines_id, rating, price, review_comment, image_url, review_date]
    );
    return reviews;
  } catch (error) {
    throw error;
  }
}

async function updateReview(id, fields = {}) {
  const setString = Object.keys(fields).map((key, index) =>
    `"${key}"=$${index + 1}`.join(",")
  );
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [reviews],
    } = await client.query(
      `
        UPDATE reviews
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );
    console.log(product, "this is an updated review");
  } catch (error) {
    throw error;
  }
}

async function destroyReview(id) {
  try {
    const { rows: reviews } = await client.query(
      `
        DELETE FROM reviews
        WHERE id=$1
        RETURNING *
        `,
      [id]
    );
    return reviews;
  } catch (error) {
    throw error;
  }
}

async function getAllReviews() {
  try {
    const { rows: reviewsIds } = await client.query(`
      SELECT id
      FROM reviews  
        `);
    const reviews = await Promise.all(
      reviewsIds.map((reviews) => getReviewByUser(reviews.id))
    );
    return reviews;
  } catch (error) {
    console.error(error);
  }
}

async function getReviewByUser(id) {
  try {
    const { rows: reviews } = await client.query(
      `
          SELECT * FROM reviews
          WHERE id = $1;
        `,
      [id]
    );
    return reviews;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createReview,
  updateReview,
  destroyReview,
  getAllReviews,
  getReviewByUser,
};
