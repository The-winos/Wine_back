const { client } = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password, name, state, avatar, role, email, year_born, follower_count, following_count, welcome, total_reviews, total_uploads, total_following, total_followers, total_main_photos }) {

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptPassword = await bcrypt.hash(password, salt);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
  INSERT INTO users(username, password, name, state, avatar,role, email, year_born, follower_count, following_count)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
  `,
      [username, bcryptPassword, name, state, avatar, role, email, year_born, follower_count, following_count]
    );
    delete user.password;

    if (user) {
      // insert a corresponding row into the "badges" table
      await client.query(
        `
        INSERT INTO badges(author_id)
        VALUES($1);
        `,
        [user.id,]
      );
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (validPassword) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT*
    FROM users
    WHERE id=${user_id}
    `);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username = $1;
    `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(
      `
      SELECT *
      FROM users
     `
    );
    return users;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(id) {
  const {
    rows: [user],
  } = await client.query(
    `
  DELETE FROM badges
  WHERE author_id = $1
  RETURNING *
  `,
    [id]
  );

  const result = await client.query(
    `
  DELETE FROM users
  WHERE id = $1
  RETURNING *
  `,
    [id]
  );

  return result.rows;
}


async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  deleteUser,
  updateUser,
};
