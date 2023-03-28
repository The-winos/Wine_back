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
  getReviewsByFollowers,
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
const {
  addFavorite,
  getAllFavoritesByUserId,
  removeFavorite,
} = require("./favorites");

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
      DROP TYPE IF EXISTS user_role;
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
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'merchant');

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      avatar VARCHAR(255),
      role user_role DEFAULT 'user',
      email VARCHAR(255) UNIQUE NOT NULL,
      birthday DATE NOT NULL,
      follower_count INT NOT NULL DEFAULT (0),
      following_count INT NOT NULL DEFAULT (0)
    );

    CREATE TYPE wine_type AS ENUM ('Cabernet','Syrah','Zinfandel','Pinot Noir','Merlot','Malbec','Tempranillo','Riesling','Pinot Grigio','Sauvignon','Chardonnay','Moscato','Blend','TreTerzi', 'Petite Sirah', 'Other');

    CREATE TABLE wines(
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      name TEXT UNIQUE NOT NULL,
      image_url TEXT NOT NULL,
      price INTEGER DEFAULT (0),
      rating INTEGER DEFAULT (0),
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
      review_date DATE,
      location VARCHAR(255)
    );

    CREATE TABLE badges(
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      welcome INTEGER NOT NULL DEFAULT(1),
      total_reviews INTEGER NOT NULL DEFAULT (0),
      total_uploads INTEGER NOT NULL DEFAULT (0),
      total_following INTEGER NOT NULL DEFAULT (0),
      total_followers INTEGER NOT NULL DEFAULT (0),
      total_main_photos INTEGER NOT NULL DEFAULT (0)
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

    CREATE OR REPLACE FUNCTION update_following_count() RETURNS TRIGGER AS $$
    BEGIN

      UPDATE badges SET total_following = NEW.following_count WHERE author_id = NEW.id;

      UPDATE badges SET total_followers = NEW.follower_count WHERE author_id = NEW.id;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_following_count_trigger
    AFTER UPDATE OF following_count ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_following_count();

    CREATE OR REPLACE FUNCTION update_badge_review_count() RETURNS TRIGGER AS $$
BEGIN
    UPDATE badges SET total_reviews = total_reviews + 1 WHERE author_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badge_review_count_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_badge_review_count();

CREATE OR REPLACE FUNCTION update_badge_review_count_down() RETURNS TRIGGER AS $$
BEGIN
    UPDATE badges SET total_reviews = total_reviews - 1 WHERE author_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badge_review_count_down_trigger
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_badge_review_count_down();

CREATE OR REPLACE FUNCTION update_wine_price() RETURNS TRIGGER AS $$
BEGIN
  UPDATE wines
  SET price = (SELECT AVG(price) FROM reviews WHERE wine_id = NEW.wine_id AND price>0)
  WHERE id = NEW.wine_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wine_price_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_wine_price();



CREATE OR REPLACE FUNCTION update_badge_upload_count() RETURNS TRIGGER AS $$
BEGIN
    UPDATE badges SET total_uploads = total_uploads + 1 WHERE author_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badge_upload_count_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_badge_upload_count();

CREATE OR REPLACE FUNCTION update_badge_upload_count_down() RETURNS TRIGGER AS $$
BEGIN
    UPDATE badges SET total_uploads = total_uploads - 1 WHERE author_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badge_upload_count_down_trigger
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_badge_upload_count_down();

CREATE OR REPLACE FUNCTION update_wine_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE wines
  SET rating = (SELECT AVG(rating) FROM reviews WHERE wine_id = NEW.wine_id)
  WHERE id = NEW.wine_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wine_rating_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_wine_rating();



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
      username: "amazinghuman",
      password: "ABCD1234",
      name: "Jenniffer",
      state: "Florida",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
      role: "admin",
      email: "dumdum@dumdum.com",
      birthday: "1992-01-01",
      follower_count: 0,
      following_count: 0,
    });
    await createUser({
      username: "cutegeek",
      password: "ABCD1234",
      name: "Jessy",
      state: "Colorado",
      avatar:
        "https://cdn5.vectorstock.com/i/1000x1000/01/69/businesswoman-character-avatar-icon-vector-12800169.jpg",
      role: "admin",
      email: "japarker0421@gmail.com",
      birthday: "1986-12-01",
      follower_count: 0,
      following_count: 0,
    });

    await createUser({
      username: "deleted",
      password: "ABCD1234",
      name: "NotHere",
      state: "Colorado",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbM1sKRHlT8AroSFkNAmAT4fCrvcBOqCUXX_e1YF45ZjkBnqYDKz7AmqZblmAlZALabY&usqp=CAU",
      role: "user",
      email: "deleted@potter.com",
      birthday: "1978-03-13",
      follower_count: 0,
      following_count: 0,
    });

    await createUser({
      username: "iceman",
      password: "ABCD1234",
      name: "Justin",
      state: "Colorado",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTue0QzcbncaPSxMCpLhzOab4a1Sux6xXpow&usqp=CAU",
      role: "admin",
      email: "thelastprince11@yahoo.com",
      birthday: "1975-04-15",
      follower_count: 0,
      following_count: 0,
    });
    await createUser({
      username: "sistersubie",
      password: "Abcd1234",
      name: "Sue",
      state: "colorado",
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      role: "merchant",
      email: "sistersubie@gmail.com",
      birthday: "1956-09-18",
      follower_count: 0,
      following_count: 0,
    });
    await createUser({
      username: "gapiesco",
      password: "Abcd1234",
      name: "Joe",
      state: "Florida",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFbUU_a4sv-K_cepk27hrSBc2PgISEEGQyojJ1rSECA&s",
      role: "merchant",
      email: "gapies55@yahoo.com",
      birthday: "1955-06-02",
      follower_count: 0,
      following_count: 0,
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
      author_id: 2,
      name: "Apothic Dark",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Blend",
    });

    await createWine({
      author_id: 1,
      name: "Kirkland Malbec",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Argentina",
      flavor: "Malbec",
    });

    await createWine({
      author_id: 1,
      name: "Yucky wine",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Trash",
      flavor: "Malbec",
    });
    await createWine({
      author_id: 2,
      name: "19 Crimes, The Banished",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Australia",
      flavor: "Blend",
    });
    await createWine({
      author_id: 2,
      name: "Chalkboard",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Cabernet",
    });
    await createWine({
      author_id: 2,
      name: "Palumbo Selezion Speciale",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Puglia, IGT Italy",
      flavor: "TreTerzi",
    });
    await createWine({
      author_id: 5,
      name: "Bogle, Red Blend",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Blend",
    });
    await createWine({
      author_id: 5,
      name: "Petite Petite, by Michael David",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Petite Sirah",
    });
    await createWine({
      author_id: 5,
      name: "Meiomi",
      image_url:
        "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "California",
      flavor: "Pinot Noir",
    });
    await createWine({
      author_id: 5,
      name: "Kirkland Cabernet",
      image_url:
        "https://static6.depositphotos.com/1000261/645/i/600/depositphotos_6459418-stock-photo-white-wine-box.jpg",
      region: "California",
      flavor: "Cabernet",
    });
    await createWine({
      author_id: 2,
      name: "Amore Assoluto",
      image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
      region: "Italy",
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
      wine_id: 1,
      user_id: 2,
      name: "Really good",
      rating: 5,
      price: 899,
      review_comment:
        "This wine is so good its got a full body without being too much. It pairs good with all red meats or just to drink on it's own. It's a favorite in our household",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2019-06-2",
      location: "Davco",
    });

    await createReview({
      wine_id: 1,
      user_id: 1,
      name: "Delete Test",
      rating: 5,
      price: 950,
      review_comment: "Nevermind.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2019-06-02",
      location: "Costco",
    });
    await createReview({
      wine_id: 4,
      user_id: 2,
      name: "Bold and dark",
      rating: 5,
      price: 999,
      review_comment:
        "This wine has a unique flavor that it is both smooth and heavy. I love to eat it with steaks",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2019-06-02",
      location: "Davco",
    });

    await createReview({
      wine_id: 2,
      user_id: 1,
      name: "Not bad for price",
      rating: 4,
      price: 879,
      review_comment:
        "It wasn't my favorite wine but it was solid for the price",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2019-06-02",
      location: "Costco",
    });
    await createReview({
      wine_id: 4,
      user_id: 4,
      name: "Solid",
      rating: 4,
      price: 999,
      review_comment:
        "This wine is just easy to drink. There's never a time when someone opens it that I'm disappointed",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2019-06-02",
      location: "local liquor store",
    });
    await createReview({
      wine_id: 1,
      user_id: 4,
      name: "Solid wine!",
      rating: 5,
      price: 999,
      review_comment:
        "Delicious, fantastic wine.Always a good buy. It's super flavorful!",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-02-13",
      location: "Davco",
    });
    await createReview({
      wine_id: 5,
      user_id: 4,
      name: "A good go to!",
      rating: 3,
      price: 999,
      review_comment:
        "Solid, easy to drink wine. A good go to, it's not a bad buy but I feel there are other wines in this price range that are better.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-02-13",
      location: "Davco",
    });
    await createReview({
      wine_id: 5,
      user_id: 2,
      name: "Good for a mix up!",
      rating: 3,
      price: 999,
      review_comment:
        "This wine didn't blow me away but it's flavor was good and I could def drink it. This is a wine I wouldn't claim is a favorite but if someone had it I'd pick it as I know it's a good wine. ",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-02-13",
      location: "Davco",
    });
    await createReview({
      wine_id: 6,
      user_id: 6,
      name: "One of my favorites",
      rating: 5,
      price: 1400,
      review_comment:
        "I'm not a connoisseur by any stretch, but I love this red. It's not too dry and has a great fruity taste.",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-02-13",
      location: "Wine Club",
    });
    await createReview({
      wine_id: 7,
      user_id: 5,
      name: "Perfect for a party",
      rating: 3,
      price: 800,
      review_comment:
        "This is the one I get the most often as for the price most people enjoy it, but it doesn't break the bank when having a large party",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-03-15",
      location: "Costco",
    });
    await createReview({
      wine_id: 8,
      user_id: 5,
      name: "REALLY good for price!",
      rating: 4,
      price: 1200,
      review_comment:
        "It's amazing for the price! a favorite for me!",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-03-15",
      location: "Costco",
    });
    await createReview({
      wine_id: 9,
      user_id: 5,
      name: "It's so yummy",
      rating: 5,
      price: 2000,
      review_comment:
        "Meiomi yummy yummy for my tummy!",
      image_url:
        "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-03-15",
      location: "Costco",
    });
    await createReview({
      wine_id: 10,
      user_id: 5,
      name: "Small amounts...",
      rating: 2,
      price: 1400,
      review_comment:
        "I can drink it in small amounts but it makes my heart race. Not one I'd pick unless no other options.",
      image_url:
      "https://static6.depositphotos.com/1000261/645/i/600/depositphotos_6459418-stock-photo-white-wine-box.jpg",
      review_date: "2023-03-15",
      location: "Costco",
    });
    await createReview({
      wine_id: 7,
      user_id: 2,
      name: "Really like this wine!",
      rating: 5,
      price: 899,
      review_comment:
        "I really enjoy this wine, specially compared to it's Cab. It's got a nice smooth flavor that is super easy to sip on.",
      image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-03-15",
      location: "Costco",
    });
    await createReview({
      wine_id: 11,
      user_id: 2,
      name: "Super smooth!",
      rating: 4,
      review_comment:
        "Very smooth and easy to drink. Perfect for sipping and having some giggles with friends.",
      image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
      review_date: "2023-03-15",
    });


    console.log("Finished creating review");
  } catch (error) {
    console.error("error creating review");
    throw error;
  }
}
// async function createInitialBadges() {
//   const user= await getUserById(1)
//   console.log(user, "looking here!!")
//   try {
//     console.log("starting to create Badges");
//     await createBadges({
//       author_id: 1,
//       total_reviews: 2,
//       total_uploads: 3,
//       total_following: user.following_count,
//       total_followers: user.follower_count,
//       total_main_photos: 0,
//     });
//     console.log("finished creating initial badges");
//   } catch (error) {
//     console.error("error creating badges");
//     throw error;
//   }
// }

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
    // await createInitialBadges();
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
    const username = await getUserByUsername("cutegeek");
    console.log("result:", username);

    console.log("testing getting all users");
    const allUsers = await getAllUsers();
    console.log("this is all users", allUsers);

    console.log("testing getUser, password");
    const gettingUser = await getUser({
      username: "amazinghuman",
      password: "ABCD1234",
    });
    console.log("this is getUser", gettingUser);

    // console.log("testing delete user");
    // const deletedUser = await deleteUser(3);
    // console.log("deleted user", deletedUser);

    console.log("testing update User");
    console.log(allUsers[1], "what is this??");
    const updatingUser = await updateUser(allUsers[1].id, {
      state: "North Carolina",
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

    // console.log("Updating wine");
    // const updatedWine = await updateWine(wines[2].id, {
    //   region: "California",
    // });
    // console.log("Updated wine", updatedWine);

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
    const badgeUsername = await getBadgeByUser({ username: "amazinghuman" });
    console.log("badges by user AmazingHuman", badgeUsername);

    // console.log("updating the badges");
    // console.log(allBadges[0].id, "updated badge id");
    // const updatedBadge = await updateBadge(allBadges[0].id, {
    //   total_reviews: 10,
    // });
    // console.log("updated total reviews from 2 to 10", updatedBadge);

    console.log("get all followers");
    const followers = await getAllFollowers();
    console.log("These are all followers", followers);

    console.log("getting follow by user");
    const userFollower = await getFollowerByUser({ id: allUsers[3].id });
    console.log("This is follower by id", userFollower);

    console.log("getting people who follow a specfic user");
    console.log("what is this", allUsers[3].id);
    const followees = await getFollowingByUser({ id: allUsers[3].id });
    console.log("these users are following user 1", followees);


    // console.log("Destroying follower");
    // const deletedFollower = await destroyFollower(1);
    // console.log("Destroyed Follower", deletedFollower);

    console.log("adding a wine to Saved list");
    const savedWine = await addSaved({ user_id: 1, wine_id: 1 });
    const secondWine = await addSaved({ user_id: 1, wine_id: 2 });
    console.log("Wine Saved to save for later", savedWine, "and", secondWine);

    console.log("lets get that whole list of saved wines");
    const savedListofWines = await getAllSavedByUserId(1);
    console.log("Here's all your saved wines", savedListofWines);

    // console.log("We need to delete a saved wine");
    // const triedTheWine = await removeSaved(1);
    // console.log("This wine is gone", triedTheWine);
    // const updatedList = await getAllSavedByUserId({ user_id: 1 });
    // console.log("List of current wines", updatedList);

    console.log("adding a wine to favorites list");
    const favoriteWine = await addFavorite({ user_id: 2, wine_id: 1 });
    const secondFavoredWine = await addFavorite({ user_id: 2, wine_id: 2 });
    console.log("Wine favorited!", favoriteWine, "and", secondFavoredWine);

    console.log("lets get that whole list of saved wines");
    const favoriteListofWines = await getAllFavoritesByUserId({ user_id: 2 });
    console.log("Here's all your favorite wines", favoriteListofWines);

    console.log("We need to delete a favorited wine");
    const notMyFavorite = await removeFavorite(1);
    console.log("This wine is gone", notMyFavorite);
    const updatedFavorList = await getAllFavoritesByUserId({ user_id: 2 });
    console.log("List of current wines", updatedFavorList);
    console.log("We need to delete a favorited wine");

    const getReviewsbyfollow = await getReviewsByFollowers(2);
    console.log(
      "These should be the reviews from user 2's followers",
      getReviewsbyfollow
    );

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
