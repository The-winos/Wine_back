const { client } = require("./client");

async function avgPrice(){

  //add prices to wines
  try {
    const {rows:[winesPrice]}= await client.query(`
    SELECT AVG(price) AS AveragePrice
    FROM wines;

    `)
return winesPrice;
  } catch (error) {
    throw error
  }
}



module.exports = {
avgPrice,
};
