const { client } = require("./client");

async function createBadges(author_id, total_reviews, total_uploads, total_follows, total_followers, total_main_photos){
try {
  const{
    rows:[badges],
  }= await client.query(`
  INSERT INTO badges(author_id, total_reviews, total_uploads, total_follows, total_followers, total_main_photos)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `,
  [author_id, total_reviews, total_uploads, total_follows, total_followers, total_main_photos]
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
    const{
      rows: [badges],
    }=await client.query(`
    SELECT badges.*, users.username AS user_username
    FROM badges
    JOIN badges on users.id = badges.author_id
    WHERE username = $1
    `, [username]);
    const diffBadges= Promise.all(badges.map((badge)=>{
      return attachBadgeToUser(badge)
    }))
    // make function attachBadgeToUser
    return diffBadges;
  } catch (error) {
    throw error
  }
}

async function updateBadge({id, fields={}}){
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
