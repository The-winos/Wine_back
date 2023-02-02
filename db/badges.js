const { client } = require("./client");
const { getUserByUsername } = require("./users");

async function createBadges({author_id, total_reviews, total_uploads, total_following, total_followers, total_main_photos}){
try {
  const{
    rows:[badges],
  }= await client.query(`
  INSERT INTO badges(author_id, total_reviews, total_uploads, total_following, total_followers, total_main_photos)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `,
  [author_id, total_reviews, total_uploads, total_following, total_followers, total_main_photos]
  );
  return badges;

} catch (error) {
  throw error;
}
}

async function getAllBadges(){
  try {
    const {rows}= await client.query(`
    SELECT badges.*,
    users.username AS author_id
    FROM badges
    JOIN users ON users.id = badges.author_id
    `);
    const badges= rows;
    return badges;

  } catch (error) {
    throw error;
  }
}

async function getBadgeById(id){
try {
  const {
    rows: [badges],
  }= await client.query(`
  SELECT *
  FROM badges
  WHERE id=${id}
  `);
  return badges;
} catch (error) {
  throw error;
}
}

async function getBadgeByUser({username}){
  try {
    const userName= await getUserByUsername(username)
    const{rows: badges} = await client.query(
      `
      SELECT * FROM badges
      WHERE author_id= $1;
      `, [userName.id]
    );
    return badges
  } catch (error) {
    throw error
  }
}

// async function attachBadgeToUser(userId){
//   const badgeToReturn = {...users};
//   try {
//     const {rows: users}= await client.query(`
//     SELECT users.*, badges.author_id AS "authorId", badges.total_reviews, badges.total_uploads, badges.total_follows, badges.total_followers, badges.total_main_photos
//     FROM users
//     JOIN badges ON badges.author_id = users.id
//     WHERE badges.id IN ($1)
//     `, [badgeToReturn.id]);
//     badgeToReturn.users=users;
//     return badgeToReturn;

//   } catch (error) {
// console.error(error);
//   }
// }

async function updateBadge(id, fields={}){
  const setString =Object.keys(fields).map((key,index)=>
  `"${key}"=$${index +1}`).join(", ");
  if (setString.length === 0){
    return;
  }
  try {
    const {rows: [badge],}= await client.query(`
    UPDATE badges
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
    Object.values(fields));
    return badge;
  } catch (error) {
    throw error;
  }
}



module.exports = {
createBadges,
getAllBadges,
getBadgeById,
getBadgeByUser,
updateBadge,
};
