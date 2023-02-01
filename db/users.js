const { client } = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password, name, state, admin, email, follower_count, following_count }) {

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptPassword = await bcrypt.hash(password, salt);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
  INSERT INTO users(username, password, name, state, admin, email, follower_count, following_count)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
  `,
      [username, bcryptPassword, name, state, admin, email, follower_count, following_count]
    );
    delete user.password;

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
  DELETE FROM users
  WHERE id = $1
  RETURNING *
  `,
    [id]
  );
  return [user];
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
