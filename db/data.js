const { client } = require("./client");
const userData = [
  {
    username: "amazinghuman",
    password: "ABCD1234",
    name: "Jenniffer",
    state: "Florida",
    avatar: "character_7.png",
    role: "admin",
    email: "dumdum@dumdum.com",
    bio: "Landscape Planner & ISA Arborist in Raleigh, North Carolina. International Relations student (FIU), software engineer and app developer!",
    birthday: "1992-01-01",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "cutegeek",
    password: "ABCD1234",
    name: "Jessy",
    state: "Colorado",
    avatar: "character_8.png",
    role: "admin",
    email: "japarker0421@gmail.com",
    birthday: "1986-12-01",
    follower_count: 0,
    following_count: 0,
  },

  {
    username: "iceman",
    password: "ABCD1234",
    name: "Justin",
    state: "Colorado",
    avatar: "character_8.png",
    role: "admin",
    email: "thelastprince11@yahoo.com",
    birthday: "1975-04-15",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "sistersubie",
    password: "Abcd1234",
    name: "Sue",
    state: "colorado",
    avatar: "character_5.png",
    role: "merchant",
    email: "sistersubie@gmail.com",
    birthday: "1956-09-18",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "gapiesco",
    password: "Abcd1234",
    name: "Joe",
    state: "Florida",
    avatar: "character_6.png",
    role: "merchant",
    email: "gapies55@yahoo.com",
    birthday: "1955-06-02",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "lexsan7393",
    password: "Abcd1234",
    name: "Lex",
    state: "Virginia",
    avatar: "character_1.png",
    role: "admin",
    email: "alemulli@gmail.com",
    birthday: "1993-07-03",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "bdizzle",
    password: "Abcd1234",
    name: "Bryan",
    state: "Colorado",
    avatar: "character_3.png",
    role: "user",
    email: "bryan@bryan.com",
    birthday: "1986-10-06",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "anthrogirl80",
    password: "Abcd1234",
    name: "Mary",
    state: "Colorado",
    avatar: "character_5.png",
    role: "user",
    email: "mwdoptix@gmail.com",
    birthday: "1986-01-06",
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
    author_id: 1,
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
    author_id: 4,
    name: "Petite Petite, by Michael David",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Petite Sirah",
  },

  {
    author_id: 4,
    name: "Meiomi",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "California",
    flavor: "Pinot Noir",
  },

  {
    author_id: 2,
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
  {
    author_id: 7,
    name: "Friuli Grave",
    image_url:
      "https://preview.free3d.com/img/2015/09/1868291155406357898/jx90iyj3.jpg",
    region: "Italy",
    flavor: "Pinot Grigio",
  },
  {
    author_id: 8,
    name: "Mariborough",
    image_url:
      "https://preview.free3d.com/img/2015/09/1868291155406357898/jx90iyj3.jpg",
    region: "New Zealand",
    flavor: "Sauvignon Blanc",
  },
  {
    author_id: 8,
    name: "Milbrandt",
    image_url:
      "https://preview.free3d.com/img/2015/09/1868291155406357898/jx90iyj3.jpg",
    region: "Washington",
    flavor: "Riesling",
  },
  {
    author_id: 8,
    name: "Robert Mondavi",
    image_url:
      "https://preview.free3d.com/img/2015/09/1868291155406357898/jx90iyj3.jpg",
    region: "California",
    flavor: "Chardonnay",
  },
  {
    author_id: 8,
    name: "Barefoot Moscato",
    image_url:
      "https://preview.free3d.com/img/2015/09/1868291155406357898/jx90iyj3.jpg",
    region: "California",
    flavor: "Moscato",
  },
  {
    author_id: 2,
    name: "Uppercut",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Napa Valley",
    flavor: "Cabernet",
  },
  {
    author_id: 1,
    name: "Astrale",
    image_url:
      "https://img.freepik.com/free-photo/bottle-wine-isolated-white_167946-4.jpg?size=338&ext=jpg&ga=GA1.2.1034222811.1663818713",
    region: "Italy",
    flavor: "Red Blend",
  },
];

const reviewData = [
  {
    wine_id: 2,
    user_id: 1,
    name: "Not bad for price",
    rating: 4,
    price: 879,
    review_comment:
      "Malbec's are always promising. This one was very nice and easy to drink.",
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
    user_id: 2,
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
    user_id: 4,
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
    user_id: 4,
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
    user_id: 4,
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
    user_id: 4,
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
  {
    wine_id: 12,
    user_id: 7,
    name: "Good balance",
    rating: 4,
    price: 799,
    review_comment: "Not overbearing and no aftertaste",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
  {
    wine_id: 12,
    user_id: 8,
    name: "Sipping alcohol",
    rating: 2,
    price: 699,
    review_comment: "To me this tastes like I'm sipping pure alcohol. Dry",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
  {
    wine_id: 13,
    user_id: 7,
    name: "Very Fruity",
    rating: 3,
    price: 699,
    review_comment: "Has a fruity taste, not bad though.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
  {
    wine_id: 13,
    user_id: 8,
    name: "It's grape!",
    rating: 4,
    price: 799,
    review_comment: "Definitely grape! I enjoyed it.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
  {
    wine_id: 14,
    user_id: 8,
    name: "Not overly sweet",
    rating: 4,
    review_comment:
      "It's not a sweet resiling but not dry. It's the perfect balance of sweet and dry.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-03-15",
  },
  {
    wine_id: 15,
    user_id: 8,
    name: "Cookies",
    rating: 2,
    review_comment:
      "It actually does taste buttery. Makes me think of cookies from a press.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
  },
  {
    wine_id: 15,
    user_id: 7,
    name: "It's good",
    rating: 3,
    review_comment: "Enjoyable wine, does in fact have a buttery texture",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
  },
  {
    wine_id: 16,
    user_id: 8,
    name: "So sweet",
    rating: 1,
    price: 799,
    review_comment: "It's sickly sweet and has a texture like mead",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
    location: "local liquor store",
  },
  {
    wine_id: 16,
    user_id: 7,
    name: "Too sweet",
    rating: 1,
    price: 799,
    review_comment: "Just way too sweet",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
    location: "local liquor store",
  },
  {
    wine_id: 17,
    user_id: 2,
    name: "Super drinkable and smooth",
    rating: 4,
    price: 899,
    review_comment:
      "My husband and I enjoyed this wine over dinner (rotisserie chicken), with dinner we thought it was good. However when we had our second glass without food the wine flavors really shinned through and we enjoyed it much more. I recommend having this wine by itself.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
    location: "Costco",
  },
  {
    wine_id: 17,
    user_id: 3,
    name: "Has spicy notes",
    rating: 4,
    price: 899,
    review_comment:
      "I felt this was very drinkable with a medium body. It has some spicy notes to it. For the price I'd certainly buy it again. ",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-05",
  },
  {
    wine_id: 18,
    user_id: 3,
    name: "Special Edition Italian Wine",
    rating: 4,
    price: 1299,
    review_comment:
      "Lovely wine, aged 5 years (2018). It was a celebratory gift and was very mild.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
    location: "",
  },
  {
    wine_id: 2,
    user_id: 4,
    name: "Goes a long way at a party",
    rating: 3,
    price: 799,
    review_comment:
      "Nice flavor, goes well with a variety of things. It will never be my favorite but I'd never turn it down either. It's very drinkable. You wouldn't be embaressed to serve it. It's perfect for party as it's not super expensive but everyone enjoys this one. ",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
    location: "Costco",
  },
];

module.exports = {
  userData,
  wineData,
  reviewData,
};
