const { client } = require("./client");

// async function avgPrice(){

//   //add prices to wines
//   try {
//     const {rows:[winesPrice]}= await client.query(`
//     SELECT AVG(price) AS AveragePrice
//     FROM wines;

//     `)
// return winesPrice;
//   } catch (error) {
//     throw error
//   }
// }

async function countWines(){
try {
  const {rows: wines}= await client.query(
  `
SELECT COUNT(id)
FROM wines
`);
return wines;
} catch (error) {
  throw error;
}}

async function countWinesByFlavor(flavor){
  try {
    const {rows: wines}= await client.query(
    `
  SELECT COUNT(id)
  FROM wines
  WHERE flavor = $1
  `, [flavor]);
  return wines;
  } catch (error) {
    throw error;
  }
}



module.exports = {
avgPrice,
};
