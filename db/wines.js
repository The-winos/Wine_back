const { client } = require("./client");

async function createWine({ author_id, name, image_url, price, region, flavor }) {
  try {
    const {
      rows: [wines],
    } = await client.query(
      `
    INSERT INTO wines (author_id, name, image_url, price, region, flavor)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
      [author_id, name, image_url, price, region, flavor]
    );
    return wines;
  } catch (error) {
    throw error;
  }
}


async function getAllWines() {
  try {
    const { rows: wineIds } = await client.query(`
    SELECT id
    FROM wines
    `);
    const wines = await Promise.all(
      wineIds.map((wine) => getWineById(wine.id))
    );
    return wines;
  } catch (error) {
    console.error(error);
  }
}

async function getWineByFlavor(flavor) {
  try {
    const { rows: wines } = await client.query(
      `
  SELECT *
  FROM wines
  WHERE flavor = $1
  `,
      [flavor]
    );
    return wines;
  } catch (error) {
    throw error;
  }
}

async function getWineById(id) {
  try {
    const {
      rows: [wine],
    } = await client.query(
      `
    SELECT *
    FROM wines
    WHERE id=$1
    `,
      [id]
    );
    if (!wine) {
      throw {
        name: "WineNotFound",
        message: "Could not find a wine with that id",
      };
    }
    return wine;
  } catch (error) {
    console.error(error);
  }
}

async function updateWine(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [wine],
    } = await client.query(
      `
      UPDATE wines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );
    return wine;
  } catch (error) {
    throw error;
  }
}

async function destroyWine(id) {
  const {
    rows: [wine],
  } = await client.query(
    `
  DELETE FROM wines
  WHERE id = $1
  RETURNING *
  `,
    [id]
  );
  return [wine];
}

async function getWineByName(name) {
  try {
    const {
      rows: [wines],
    } = await client.query(
      `
    SELECT *
    FROM wines
    WHERE name= $1;
    `,
      [name]
    );
    return wines;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  destroyWine,
  getWineByName,
  getWineByFlavor,
};
