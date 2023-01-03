const { client } = require("./client");
const bcrypt = require("bcrypt");

async function createUser({username, password, name, admin, email}){
  const saltRound =10
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword =await bcrypt.hash(password, salt);
  try {
const{
  rows: [user],
}=await client.query(
  `
  INSERT INTO users (username, password, name, admin, email)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
  `,
  [username, bcryptPassword, name, admin, email]
);
delete user.password;
return user;

  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getWithUsername(username);
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

module.exports = {
createUser,
getUser,
getUserById,
getUserByUsername,
getAllUsers,

};
