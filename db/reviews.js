const { client } = require("./client");

async function createReview({
  wine_id,
  user_id,
  name,
  rating,
  price,
  review_comment,
  image_url,
  review_date,
}) {
  try {
    const {
      rows: [reviews],
    } = await client.query(
      `
        INSERT INTO reviews(wine_id, user_id, name, rating, price, review_comment, image_url, review_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `,
      [
        wine_id,
        user_id,
        name,
        rating,
        price,
        review_comment,
        image_url,
        review_date,
      ]
    );
    return reviews;
  } catch (error) {
    throw error;
  }
}

async function updateReview(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [reviews],
    } = await client.query(
      `UPDATE reviews
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );
    return reviews;
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
    const { rows: reviews } = await client.query(`
      SELECT *
      FROM reviews
        `);

    return reviews;
  } catch (error) {
    throw error;
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
