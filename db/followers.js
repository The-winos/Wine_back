const { client } = require("./client");
const { getUserById } = require("./users");

async function addFollower({ user_id, follower_id }) {
  try {
    const {
      rows: [followers],
    } = await client.query(
      `
        INSERT INTO followers(user_id, follower_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
      [user_id, follower_id]
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

async function getFollowerByUser({id}) {
  try {
    const { rows: followers } = await client.query(
      `
      SELECT follower_id
      FROM followers
      WHERE user_id = $1;
          `,
      [id]
    );

    return followers;
  } catch (error) {
    throw error;
  }
}

async function getFollowingByUser({id}) {
  try {
    const { rows: followers } = await client.query(
      `
      SELECT user_id
      FROM followers
      WHERE follower_id = $1;
          `,
      [id]
    );

    return followers;
  } catch (error) {
    throw error;
  }
}


async function deleteFollowersByFollowerId(userId) {
  try {
    const { rows: followers } = await client.query(
      `
      DELETE FROM followers
      WHERE follower_id = $1
      RETURNING *;
      `,
      [userId]
    );
    return followers;
  } catch (error) {
    throw error;
  }
}

async function deleteFollowersByUserId(followerId) {
  try {
    const { rows: followers } = await client.query(
      `
      DELETE FROM followers
      WHERE user_id = $1
      RETURNING *;
      `,
      [followerId]
    );
    return followers;
  } catch (error) {
    throw error;
  }
}



async function getFollowerById(id) {
  try {
    const { rows: [follow] } = await client.query(
      `
      SELECT *
      FROM followers
      WHERE follower_id = $1
      `, [id]
    );
    if (!follow) {
      throw {
        name: "Follower not found",
        message: `Could not find a follower with ID ${id}`
      };
    }
    return follow;
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  addFollower,
  getAllFollowers,
  getFollowerByUser,
  deleteFollowersByFollowerId,
  deleteFollowersByUserId,
  getFollowingByUser,
  getFollowerById
};
