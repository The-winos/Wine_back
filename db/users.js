const { client } = require("./client");
const bcrypt = require("bcrypt");

const {
  getReviewByUser,
  updateReview,
  updateReviewAuthorId,
} = require("./reviews");
const { getWineByAuthor, updateWine, updateWineAuthorId } = require("./wines");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'corks_connect@outlook.com',
    pass: process.env.EMAIL_PASS,}
});

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
  join_date,
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
  INSERT INTO users(username, password, name, state, avatar, role, email, bio, birthday, follower_count, following_count, join_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        join_date,
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
  console.log("Hello??")
  console.log(username, password)
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

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (!user) {
      return null;
    }

    delete user.password;
    console.log(user, "this is user")
    return user;
  } catch (error) {
    console.error(error);
    throw error;
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
  console.log(id, "user id");
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
    console.log(user, "whats this user?");
    return user;
  } catch (error) {
    console.error(error);
  }
}
async function updateUserPassword(id, password ) {
  try {
    // Fetch the user from the database using the user id
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE id = $1;
      `,
      [id]
    );

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }


    // Update the user's password in the database
    const {
      rows: [updatedUser],
    } = await client.query(
      `
        UPDATE users
        SET password = $1
        WHERE id = $2
        RETURNING *;
      `,
      [password, id]
    );

    // Remove the hashed password from the updated user object

delete updatedUser.password
    return updatedUser;
  } catch (error) {
    throw error;
  }
}
async function sendPasswordResetEmail(toEmail, resetToken) {
  // Email content

  const mailOptions = {
    from: 'corks_connect@outlook.com',
    to: toEmail,
    subject: 'Password Reset for Corks',
    html: `
      <p>You have requested to reset your password for CORKS.</p>
      <p>Click the following link to reset your password, this link will expire in one hour:</p>
      <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
      <p>If you did not request this, please disregard this email. </p>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending password reset email:', error);
    } else {
      console.log('Password reset email sent:', info.response);
    }
  });
}

async function createToken(user_id, resetToken
) {


  // Set the token expiration to 1 hour from the current time
  const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  try {
    const {
      rows: [password_reset],
    } = await client.query(
      `
  INSERT INTO password_reset_tokens(user_id, token, expires_at)
  VALUES ($1, $2, $3)
  RETURNING *;
  `,
      [user_id, resetToken, expirationTime]
    );

    return password_reset;
  } catch (error) {
    throw error;
  }
}

async function getUserByToken(token) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT *
      FROM password_reset_tokens
      WHERE token = $1
    `, [token]);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function isItExpired(token) {
  console.log("in isItExpired")
  try {
    const tokenDetails = await getToken(token);
    console.log(tokenDetails, "tokenDets")
    console.log(tokenDetails.expires_at)

    if (tokenDetails && tokenDetails.expires_at) {
      // Get the current time
      const currentTime = new Date();

      // Parse the expiration time from the database
      const expirationTime = new Date(tokenDetails.expires_at);

      // Compare the current time with the expiration time
      return currentTime > expirationTime;
    } else {
      // Token details or expiration time not found
      return true; // Treat it as expired for safety
    }
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

async function getToken(token){
  try {
    const { rows: [resetToken]}= await client.query(
      `
      SELECT *
      FROM password_reset_tokens
      WHERE token= $1
      `,
      [token]
    );
    return resetToken;

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
  updateUserForeignKeys,
  getUserByEmail,
  sendPasswordResetEmail,
  createToken,
  getUserByToken,
  isItExpired,
  getToken
};
