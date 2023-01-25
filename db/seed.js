const { client } = require("./client");
const bcrypt = require("bcrypt");

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("./users");
const { getAllReviews, createReview } = require("./reviews");
const { createWine } = require("./wines");
const { createBadges } = require("./badges");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS badges;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS wines;
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS wine_type;
    `);
    console.log("Finished dropping tables");
  } catch (error) {
    console.log("Error dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    //review line 32 - to get author AS username or ID ?? (review cart of fitness tracker)
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT false,
      email VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TYPE wine_type AS ENUM ('Cabernet','Syrah','Zinfandel','Noir','Merlot','Malbec','Tempranillo','Riesling','Grigio','Sauvignon','Chardonnay','Moscato','Blend');

    CREATE TABLE wines(
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      name TEXT UNIQUE NOT NULL,
      image_url TEXT NOT NULL,
      region TEXT,
      flavor wine_type
    );
    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      wine_id INTEGER REFERENCES wines(id),
      user_id INTEGER REFERENCES users(id)
      name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      price INTEGER,
      review_comment TEXT,
      image_url TEXT NOT NULL,
      review_date DATE
    );
    CREATE TABLE badges (
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      total_reviews INTEGER,
      total_uploads INTEGER,
      total_follows INTEGER,
      total_followers INTEGER,
      total_main_photos INTEGER
    );
    `);
    console.log("Finished building tables");
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users");
    await createUser({
      username: "AmazingHuman",
      password: "ABCD1234",
      name: "Jenniffer",
      state: "Florida",
      admin: true,
      email: "dumdum@dumdum.com",
    });
    await createUser({
      username: "CuteGeek",
      password: "ABCD1234",
      name: "Jessy",
      state: "Colorado",
      admin: true,
      email: "harry@potter.com",
    });
    console.log("Finished creating users");
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

async function createInitialWine(){
try {
  console.log("Starting to Create Wines");
  await createWine({
    author_id:1,
    name: "Apothic Dark",
    image_url: "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Blend",
 });
 console.log("Finished creating wines");
} catch (error) {
  console.error("error creating wines");
    throw error;
}
}

async function createInitialReview() {
  try {
    console.log("Starting to create reviews");
    await createReview({
      name: "Alamos",
      rating: 5,
      price: 850,
      review_comment:
        "Plum and prune on the nose and palate. Fruity, with ripe, well-integrated tannins on the palate. Long, slightly drying finish with lingering plum and prune notes.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: 2023 - 01 - 19,
    });
    console.log("Finished creating review");
  } catch (error) {
    console.error("error creating review");
    throw error;
  }
}
async function createInitialBadges(){
  try {
    console.log("starting to create Badges");
    await createBadges({
      author_id:1,
      total_reviews:2,
      total_follows:0,
      total_followers:1,
      total_main_photos:0,
    });
    console.log("finished creating intial badges");
  } catch (error) {
    console.error("error creating badges");
    throw error;
  }
}

async function buildingDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialWine();
    await createInitialReview();
    await createInitialBadges();
  } catch (error) {
    console.log("error during building");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("getting user by Id");
    const userId = await getUserById(1);
    console.log(userId, "this is user Id");

    console.log("getting user by username");
    const username = await getUserByUsername("CuteGeek");
    console.log("result:", username);

    console.log("testing getting all users");
    const allUsers = await getAllUsers();
    console.log("this is all users", allUsers);

    console.log("Finished DB Tests");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }

  console.log("get all reviews");
  const reviews = await getAllReviews(1);
  console.log("This is a review", reviews);
}

buildingDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
