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
const {
  getAllReviews,
  createReview,
  getReviewByUser,
  updateReview,
  destroyReview,
} = require("./reviews");
const {
  createWine,
  getWineById,
  getAllWines,
  getWineByFlavor,
  updateWine,
  destroyWine,
  getWineByName,
} = require("./wines");
const {
  createBadges,
  getAllBadges,
  getBadgeById,
  getBadgeByUser,
  updateBadge,
} = require("./badges");
const {
  addFollower,
  getAllFollowers,
  getFollowerByUser,
  updateFollower,
  destroyFollower,
  getFollowingByUser,
} = require("./followers");
const { addSaved, getAllSavedByUserId, removeSaved } = require("./saved");
const { addFavorite, getAllFavoritesByUserId, removeFavorite } = require("./favorites");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS saved;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS badges;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS wines;
    DROP TABLE IF EXISTS followers;
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
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT false,
      email VARCHAR(255) UNIQUE NOT NULL,
      follower_count INT NOT NULL DEFAULT (0),
      following_count INT NOT NULL DEFAULT (0)

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
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      wine_id INTEGER REFERENCES wines(id),
      user_id INTEGER REFERENCES users(id),
      name TEXT,
      rating INTEGER NOT NULL,
      price INTEGER,
      review_comment TEXT,
      image_url TEXT,
      review_date DATE
    );
    CREATE TABLE badges(
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      total_reviews INTEGER,
      total_uploads INTEGER,
      total_follows INTEGER,
      total_followers INTEGER,
      total_main_photos INTEGER
    );
    CREATE TABLE followers(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      follower_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, follower_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (follower_id) REFERENCES users(id)
    );

    CREATE TABLE favorites(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      wine_id INT NOT NULL REFERENCES wines(id),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE saved(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      wine_id INT NOT NULL REFERENCES wines(id),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );



    CREATE OR REPLACE FUNCTION update_follow_counts()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE users
      SET follower_count = follower_count + 1
      WHERE id = NEW.follower_id;

      UPDATE users
      SET following_count = following_count + 1
      WHERE id = NEW.user_id;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_follow_counts_trigger
    AFTER INSERT ON followers
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts();

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
      follower_count: 0,
      following_count:0,
    });
    await createUser({
      username: "CuteGeek",
      password: "ABCD1234",
      name: "Jessy",
      state: "Colorado",
      admin: true,
      email: "harry@potter.com",
      follower_count: 0,
      following_count:0,
    });

    await createUser({
      username: "Deleted",
      password: "ABCD1234",
      name: "NotHere",
      state: "Colorado",
      admin: false,
      email: "deleted@potter.com",
      follower_count: 0,
      following_count:0,
    });

    await createUser({
      username: "Mmouse",
      password: "ABCD1234",
      name: "Minnie",
      state: "Florida",
      admin: false,
      email: "Minnie@potter.com",
      follower_count: 0,
      following_count:0,
    });

    console.log("Finished creating users");
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

async function createInitialWine() {
  try {
    console.log("Starting to Create Wines");
    await createWine({
      author_id: 1,
      name: "Apothic Dark",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Blend",
    });

    await createWine({
      author_id: 2,
      name: "Kirkland Malbec",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Argentina",
      flavor: "Malbec",
    });

    await createWine({
      author_id: 2,
      name: "Yucky wine",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Trash",
      flavor: "Malbec",
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
    const wineId = await getWineById(1);
    console.log("Getting wine", wineId);
    await createReview({
      wine_id: wineId.id,
      user_id: wineId.author_id,
      name: "Review",
      rating: 5,
      price: 850,
      review_comment:
        "Plum and prune on the nose and palate. Fruity, with ripe, well-integrated tannins on the palate. Long, slightly drying finish with lingering plum and prune notes.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: 20190602,
    });

    await createReview({
      wine_id: wineId.id,
      user_id: wineId.author_id,
      name: "Delete Test",
      rating: 5,
      price: 850,
      review_comment: "Nevermind.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: 20190602,
    });

    console.log("Finished creating review");
  } catch (error) {
    console.error("error creating review");
    throw error;
  }
}
async function createInitialBadges() {
  try {
    console.log("starting to create Badges");
    await createBadges({
      author_id: 1,
      total_reviews: 2,
      total_uploads: 3,
      total_follows: 0,
      total_followers: 1,
      total_main_photos: 0,
    });
    console.log("finished creating initial badges");
  } catch (error) {
    console.error("error creating badges");
    throw error;
  }
}

async function createInitialFollowers() {
  try {
    console.log("starting to create followers");
    await addFollower({
      user_id: 1,
      follower_id: 2,
    });
    await addFollower({
      user_id: 2,
      follower_id: 1,
    });

    await addFollower({
      user_id: 2,
      follower_id: 4,
    });
    await addFollower({
      user_id: 1,
      follower_id: 4,
    });


    console.log("finished created initial followers");
  } catch (error) {
    console.error("error creating followers");
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
    await createInitialFollowers();
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

    console.log("testing getUser, password");
    const gettingUser = await getUser({
      username: "AmazingHuman",
      password: "ABCD1234",
    });
    console.log("this is getUser", gettingUser);

    console.log("testing delete user");
    const deletedUser = await deleteUser(3);
    console.log("deleted user", deletedUser);

    console.log("testing update User");
    console.log(allUsers[1], "what is this??");
    const updatingUser = await updateUser(allUsers[1].id, {
      state: "North Carolina",
      admin: true,
    });
    console.log("updated user", updatingUser);

    console.log("get all wines");
    const wines = await getAllWines();
    console.log("These are all wines", wines);

    console.log("getting wine type");
    const flavor = await getWineByFlavor("Blend");
    console.log("These are the blend wines", flavor);

    console.log("getting wines by id");
    const wineId = await getWineById(1);
    console.log("This is wine by id", wineId);

    console.log("Updating wine");
    const updatedWine = await updateWine(wines[2].id, {
      region: "Still Trash",
    });
    console.log("Updated wine", updatedWine);

    console.log("Destroying wine");
    const destroyedWine = await destroyWine(3);
    console.log("Deleting wine", destroyedWine);

    console.log("Getting wine by name");
    const wineName = await getWineByName("Kirkland Malbec");
    console.log("Getting wine by name", wineName);

    console.log("get all reviews");
    const reviews = await getAllReviews();
    console.log("This is the reviews", reviews);

    console.log("getting review by user");
    const userReview = await getReviewByUser(1);
    console.log("This is review by id", userReview);

    console.log("updating review");
    const updatedReview = await updateReview(reviews[0].id, {
      name: "Bold and Beautiful",
    });
    console.log("Updated review", updatedReview);

    console.log("Destroying review");
    const deletedReview = await destroyReview(2);
    console.log("Destroyed Review", deletedReview);

    console.log("getting all badges");
    const allBadges = await getAllBadges();
    console.log("all the badges", allBadges);

    console.log("getting badge by id");
    const badgeId = await getBadgeById(1);
    console.log("badge id 1", badgeId);

    console.log("get badge by username");
    const badgeUsername = await getBadgeByUser({ username: "AmazingHuman" });
    console.log("badges by user AmazingHuman", badgeUsername);

    console.log("updating the badges");
    console.log(allBadges[0].id, "updated badge id");
    const updatedBadge = await updateBadge(allBadges[0].id, {
      total_follows: 10,
    });
    console.log("updated total follows from 0 to 10", updatedBadge);

    console.log("get all followers");
    const followers = await getAllFollowers();
    console.log("These are all followers", followers);

    console.log("getting follow by user");
    const userFollower = await getFollowerByUser({id:allUsers[3].id,});
    console.log("This is follower by id", userFollower);

    console.log("getting people who follow a specfic user");
    console.log("what is this", allUsers[3].id)
    const followees = await getFollowingByUser({id:allUsers[3].id,});
    console.log("these users are following user 1", followees)

    console.log("updating follower");
    const updatedFollower = await updateFollower(followers[0].id, {
      created_at: "2022-12-31 21:59:59",
    });
    console.log("Updated follower", updatedFollower);

    // console.log("Destroying follower");
    // const deletedFollower = await destroyFollower(1);
    // console.log("Destroyed Follower", deletedFollower);

    console.log("adding a wine to Saved list")
    const savedWine= await addSaved({user_id:1, wine_id:1,});
    const secondWine =await addSaved({user_id:1, wine_id:2 });
    console.log("Wine Saved to save for later", savedWine, "and", secondWine);

    console.log("lets get that whole list of saved wines");
    const savedListofWines= await getAllSavedByUserId({user_id:1})
    console.log("Here's all your saved wines", savedListofWines);

    console.log("We need to delete a saved wine");
    const triedTheWine= await removeSaved(1);
    console.log("This wine is gone", triedTheWine)
    const updatedList= await getAllSavedByUserId({user_id:1})
    console.log("List of current wines", updatedList)

    console.log("adding a wine to favorites list")
    const favoriteWine= await addFavorite({user_id:2, wine_id:1,});
    const secondFavoredWine =await addFavorite({user_id:2, wine_id:2 });
    console.log("Wine favorited!", favoriteWine, "and", secondFavoredWine);

    console.log("lets get that whole list of saved wines");
    const favoriteListofWines= await getAllFavoritesByUserId({user_id:2})
    console.log("Here's all your favorite wines", favoriteListofWines);

    console.log("We need to delete a favorited wine");
    const notMyFavorite= await removeFavorite(1);
    console.log("This wine is gone", notMyFavorite)
    const updatedFavorList= await getAllFavoritesByUserId({user_id:2})
    console.log("List of current wines", updatedFavorList)

    console.log("Finished DB Tests");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

buildingDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
