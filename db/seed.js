async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
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
      email VARCHAR(255) UNIQUE NOT NULL,
    );
    CREATE TYPE wine_type AS ENUM ('Cabernet','Syrah','Zinfandel','Noir','Merlot','Malbec','Tempranillo','Riesling','Grigio','Sauvignon','Chardonnay','Moscato','Blend');
    CREATE TABLE wines(
      id SERIAL PRIMARY KEY,
      author TEXT REFERENCES user(username)
      name TEXT UNIQUE NOT NULL,
      price INTEGER,
      image_url TEXT,
      thoughts TEXT,
      region TEXT,
      flavor wine_type
    );
    `);
    console.log("Finished building tables");
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
}
