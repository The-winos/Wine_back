const { client } = require("./client");
const bcrypt = require("bcrypt");
const { getReviewByUser, updateReview, updateReviewAuthorId } = require("./reviews");
const { getWineByAuthor, updateWine, updateWineAuthorId } = require("./wines");

async function createUser({
  username,
  password,
  name,
  state,
  avatar,
  role,
  email,
  bio,
  birthday,
  follower_count,
  following_count,
  welcome,
  total_reviews,
  total_uploads,
  total_following,
  total_followers,
  total_main_photos,
}) {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptPassword = await bcrypt.hash(password, salt);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
  INSERT INTO users(username, password, name, state, avatar, role, email, bio, birthday, follower_count, following_count)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
  `,
      [
        username,
        bcryptPassword,
        name,
        state,
        avatar,
        role,
        email,
        bio,
        birthday,
        follower_count,
        following_count,
      ]
    );
    delete user.password;

    if (user) {
      // insert a corresponding row into the "badges" table
      await client.query(
        `
        INSERT INTO badges(author_id)
        VALUES($1);
        `,
        [user.id]
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

async function updateUserForeignKeys(userId) {
  try {
    // Fetch the reviews associated with the user
    const reviews = await getReviewByUser(userId);

    // Update the foreign keys in the reviews
    const updatedReviews = reviews.map((review) => {
      return { ...review, userId: 3 }; // user 3 is our deleted user
    });

    // Fetch the wines associated with the user
    const wines = await getWineByAuthor(userId);

    // Update the foreign keys in the wines
    const updatedWines = wines.map((wine) => {
      return { ...wine, author_id: 3 }; // user 3 is our deleted user
    });

    // Update the reviews in the backend
    for (const review of updatedReviews) {
      await updateReviewAuthorId(review.id, review.userId);
    }

    // Update the wines in the backend
    for (const wine of updatedWines) {
      await updateWineAuthorId(wine.id, wine.author_id);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
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
async function updateUserPassword(id, password) {
  const saltRound=10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptPassword = await bcrypt.hash(password, salt);
  console.log(bcryptPassword, "bcrypt")
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET password = $1
        WHERE id = $2
        RETURNING *;
      `,
      [bcryptPassword, id]
    );
    console.log(user, "user")
    delete user.password;
    return bcryptPassword;


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
  updateUserPassword,
  updateUserForeignKeys
};
