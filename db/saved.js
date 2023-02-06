const { client } = require("./client");

async function addSaved({ user_id, wine_id }) {
  try {
    const {
      rows: [saving],
    } = await client.query(
      `INSERT INTO saved(user_id, wine_id)
    VALUES($1, $2)
    RETURNING *;
    `,
      [user_id, wine_id]
    );
    return saving;
  } catch (error) {
    throw error;
  }
}

async function removeSaved(id) {
  try {
    const { rows: saved } = await client.query(
      `
    DELETE FROM saved
    WHERE id=$1
    RETURNING *
    `,
      [id]
    );
    return saved;
  } catch (error) {
    throw error;
  }
}

async function getAllSavedByUserId({ user_id }) {
  try {
    const { rows: saved } = await client.query(
      `
    SELECT *
    FROM saved
    WHERE user_id=$1
    `,
      [user_id]
    );
    return saved;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addSaved,
  removeSaved,
  getAllSavedByUserId,
};
