const { client } = require("./client");

async function createWine({
  author_id,
      name,
      image_url,
      region,
      flavor,
}){
  try {
    const { rows : [wines],}= await client.query(`
    INSERT INTO wines (author_id, name, image_url, region, flavor)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [author_id, name, image_url, region, flavor]);
    return wines
  } catch (error) {
    throw error;
  }
}





module.exports = {
createWine
};
