const { client } = require("./client");


async function addFavorite(
  user_id, wine_id
){
  try { const{rows:[favorites]}=await client.query(
    `INSERT INTO favorites(user_id, wine_id)
    VALUES($1, $2)
    RETURNING *;
    `, [user_id, wine_id]
  );
  return favorites;

  } catch (error) {
    throw error;
  }
}

async function removeFavorite(id){
  try {
    const {rows: favorite}=await client.query(`
    DELETE FROM favorites
    WHERE id=$1
    RETURNING *
    `,[id]);
    return favorite;
  } catch (error) {
    throw error
  }
}

async function getAllFavoritesByUserId({user_id}){
  try {
    const {rows: favorites}= await client.query(`
    SELECT *
    FROM favorites
    WHERE user_id=$1
    `, [user_id]);
    return favorites;
  } catch (error) {
    throw error;
  }
}

async function getFavoritedById(id){
  try {
    const { rows:[favorite]}=await client.query(
      `
      SELECT *
      FROM favorites
      WHERE id=$1
      `, [id]
    );
    if(!favorite){
      throw{
        name:"Favorite not found",
        message: `Could not find a favorite wine ${id}`
      };

    }return favorite;
  } catch (error) {
    console.error(error);
  }
 }

module.exports = {
addFavorite,
removeFavorite,
getAllFavoritesByUserId,
getFavoritedById
};
