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
  addFollower,
  getAllFollowers,
  getFollowerByUser,
  destroyFollower,
  getFollowingByUser
};
