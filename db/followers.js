const { client } = require("./client");

async function createFollower({ user_id, follower_id, created_at }) {
  try {
    const {
      rows: [followers],
    } = await client.query(
      `
        INSERT INTO followers(user_id, follower_id, created_at)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
      [user_id, follower_id, created_at]
    );
    return followers;
  } catch (error) {
    throw error;
  }
}

async function getAllFollowers() {
  try {
    const { rows: followers } = await client.query(`
        SELECT *
        FROM followers
          `);

    return followers;
  } catch (error) {
    throw error;
  }
}

async function getFollowerByUser(id) {
  try {
    const { rows: followers } = await client.query(
      `
            SELECT * FROM followers
            WHERE id = $1;
          `,
      [id]
    );
    return followers;
  } catch (error) {
    throw error;
  }
}

async function updateFollower(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [followers],
    } = await client.query(
      `UPDATE followers
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );
    return followers;
  } catch (error) {
    throw error;
  }
}

async function destroyFollower(id) {
  try {
    const { rows: followers } = await client.query(
      `
          DELETE FROM followers
          WHERE id=$1
          RETURNING *
          `,
      [id]
    );
    return followers;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createFollower,
  getAllFollowers,
  getFollowerByUser,
  updateFollower,
  destroyFollower,
};
