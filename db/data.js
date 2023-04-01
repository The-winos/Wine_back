const userData = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },

  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
    id: 5,
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
  },
];

//wine post
const wineData = [
  {
    author_id: 2,
    name: "Apothic Dark",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Red Blend",
  },

  {
    author_id: 4,
    name: "Kirkland Malbec",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Argentina",
    flavor: "Malbec",
  },

  {
    author_id: 1,
    name: "Yucky wine",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Trash",
    flavor: "Malbec",
  },
  {
    author_id: 2,
    name: "19 Crimes, The Banished",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Australia",
    flavor: "Red Blend",
  },

  {
    author_id: 2,
    name: "Chalkboard",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Cabernet",
  },

  {
    author_id: 5,
    name: "Palumbo Selezion Speciale",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Puglia, IGT Italy",
    flavor: "TreTerzi",
  },

  {
    author_id: 2,
    name: "Bogle, Red Blend",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Red Blend",
  },

  {
    author_id: 1,
    name: "Petite Petite, by Michael David",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Petite Sirah",
  },

  {
    author_id: 1,
    name: "Meiomi",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Pinot Noir",
  },

  {
    author_id: 1,
    name: "Kirkland Cabernet",
    image_url:
      "https://static6.depositphotos.com/1000261/645/i/600/depositphotos_6459418-stock-photo-white-wine-box.jpg",
    region: "California",
    flavor: "Cabernet",
  },
  {
    author_id: 2,
    name: "Amore Assoluto",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Italy",
    flavor: "Red Blend",
  },
];

const reviewData = [
  {
    wine_id: 2,
    user_id: 4,
    name: "Not bad for price",
    rating: 4,
    price: 879,
    review_comment:
      //write an honest review of kirkland's malbec
      "It wasn't my favorite wine but it was solid for the price",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2019-06-02",
    location: "Costco",
  },
  {
    wine_id: 4,
    user_id: 3,
    name: "Solid",
    rating: 4,
    price: 999,
    review_comment:
      "This wine is just easy to drink. There's never a time when someone opens it that I'm disappointed",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2019-06-02",
    location: "local liquor store",
  },
  {
    wine_id: 1,
    user_id: 3,
    name: "Solid wine!",
    rating: 5,
    price: 999,
    review_comment:
      "Delicious, fantastic wine.Always a good buy. It's super flavorful!",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-02-13",
    location: "Davco",
  },
  {
    wine_id: 5,
    user_id: 3,
    name: "A good go to!",
    rating: 3,
    price: 999,
    review_comment:
      "Solid, easy to drink wine. A good go to, it's not a bad buy but I feel there are other wines in this price range that are better.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-02-13",
    location: "Davco",
  },
  {
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
  },
  {
    wine_id: 6,
    user_id: 5,
    name: "One of my favorites",
    rating: 5,
    price: 1400,
    review_comment:
      "I'm not a connoisseur by any stretch, but I love this red. It's not too dry and has a great fruity taste.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-02-13",
    location: "Wine Club",
  },
  {
    wine_id: 7,
    user_id: 1,
    name: "Perfect for a party",
    rating: 3,
    price: 800,
    review_comment:
      "This is the one I get the most often as for the price most people enjoy it, but it doesn't break the bank when having a large party",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
    location: "Costco",
  },
  {
    wine_id: 8,
    user_id: 1,
    name: "REALLY good for price!",
    rating: 4,
    price: 1200,
    review_comment: "It's amazing for the price! a favorite for me!",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
    location: "Costco",
  },
  {
    wine_id: 9,
    user_id: 1,
    name: "It's so yummy",
    rating: 5,
    price: 2000,
    review_comment: "Meiomi yummy yummy for my tummy!",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
    location: "Costco",
  },
  {
    wine_id: 10,
    user_id: 1,
    name: "Small amounts...",
    rating: 2,
    price: 1400,
    review_comment:
      "I can drink it in small amounts but it makes my heart race. Not one I'd pick unless no other options.",
    image_url:
      "https://static6.depositphotos.com/1000261/645/i/600/depositphotos_6459418-stock-photo-white-wine-box.jpg",
    review_date: "2023-03-15",
    location: "Costco",
  },
  {
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
  },
  {
    wine_id: 11,
    user_id: 2,
    name: "Super smooth!",
    rating: 4,
    review_comment:
      "Very smooth and easy to drink. Perfect for sipping and having some giggles with friends.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
];

module.exports = {
  userData,
  wineData,
  reviewData,
};
