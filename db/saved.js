const { client } = require("./client");


async function addSaved({
  user_id, wine_id
}){
  try { const{rows:[saving]}=await client.query(
    `INSERT INTO saved(user_id, wine_id)
    VALUES($1, $2)
    RETURNING *;
    `, [user_id, wine_id]
  );
  return saving;

  } catch (error) {
    throw error;
  }
}
// WROTE THIS AND REALIZED ITS UNNEEDED. FOR FAVORITES AND SAVED WE JUST NEED TO BE ABLE TO ADD AND DELETE
// async function updateSaved(id, fields={}){
//   const setString = Object.keys(fields)
//     .map((key, index) => `"${key}"=$${index + 1}`)
//     .join(", ");
//   if (setString.length === 0) {
//     return;
//   }
//   try {
//     const{rows:[saved]}=await client.query(`
//     UPDATE saved
//     SET ${setString}
//     WHERE id=${id}
//     RETURNING *;
//     `, Object.values(fields));
//     return saved;
//   } catch (error) {
//     throw error;
//   }
// }
async function removeSaved(id){
  try {
    const {rows: saved}=await client.query(`
    DELETE FROM saved
    WHERE id=$1
    RETURNING *
    `,[id]);
    return saved;
  } catch (error) {
    throw error
  }
}

async function getAllSavedByUserId({user_id}){
  try {
    const {rows: saved}= await client.query(`
    SELECT *
    FROM saved
    WHERE user_id=$1
    `, [user_id]);
    return saved;
  } catch (error) {
    throw error;
  }
}

module.exports = {
addSaved,
removeSaved,
getAllSavedByUserId
};
