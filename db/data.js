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
    bio: "I am a co-creator of CORKS, and an avid adventurer. My passions in life revolve around design, travel, and understanding systems. I work as a Landscape Architect Planner & ISA Arborist in Raleigh, North Carolina. I am currently a student in international Relations (FIU), and software engineer and app developer! Currently adapting to big data manipulation in Tableau and ArcGIS Pro.",
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
    bio: "Hi there! I'm one of the creators of this amazing site. I'm a full-stack developer, and passionate about crafting exceptional web experiences. When I'm not immersed in code, you can find me embracing the wonderful chaos of motherhood with my incredible 4-year-old. I'm also an unapologetic geek, fueled by a love for all things tech, gaming, and pop culture.",
    birthday: "1986-04-21",
    follower_count: 0,
    following_count: 0,
  },
  {
    username: "Deleted User",
    password: "AnyjbfhEnd89651",
    name: "Deleted",
    state: "Deleted",
    avatar: "character_8.png",
    role: "user",
    email: "japarker0421@fake.com",
    bio: "This is an error handling user, you shouldn't be here",
    birthday: "1986-04-21",
    follower_count: 0,
    following_count: 0,
  },

  {
    username: "iceman",
    password: "ABCD1234",
    name: "Justin",
    state: "Colorado",
    avatar: "character_3.png",
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
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Red Blend",
  },

  {
    author_id: 1,
    name: "Kirkland Malbec",
    image_url: "3-reddish-purple_wine.png",
    region: "Argentina",
    flavor: "Malbec",
  },

  {
    author_id: 1,
    name: "Yucky wine",
    image_url: "3-reddish-purple_wine.png",
    region: "Trash",
    flavor: "Malbec",
  },
  {
    author_id: 2,
    name: "19 Crimes, The Banished",
    image_url: "3-reddish-purple_wine.png",
    region: "Australia",
    flavor: "Red Blend",
  },

  {
    author_id: 2,
    name: "Chalkboard",
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Cabernet",
  },

  {
    author_id: 6,
    name: "Palumbo Selezion Speciale",
    image_url: "3-reddish-purple_wine.png",
    region: "Puglia, IGT Italy",
    flavor: "TreTerzi",
  },

  {
    author_id: 2,
    name: "Bogle, Red Blend",
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Red Blend",
  },

  {
    author_id: 5,
    name: "Petite Petite, by Michael David",
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Petite Sirah",
  },

  {
    author_id: 5,
    name: "Meiomi",
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Pinot Noir",
  },

  {
    author_id: 2,
    name: "Kirkland Cabernet",
    image_url: "3-reddish-purple_wine.png",
    region: "California",
    flavor: "Cabernet",
  },
  {
    author_id: 2,
    name: "Amore Assoluto",
    image_url: "3-reddish-purple_wine.png",
    region: "Italy",
    flavor: "Red Blend",
  },
  {
    author_id: 8,
    name: "Friuli Grave",
    image_url: "1-green_wine.png",
    region: "Italy",
    flavor: "Pinot Grigio",
  },
  {
    author_id: 8,
    name: "Mariborough",
    image_url: "1-green_wine.png",
    region: "New Zealand",
    flavor: "Sauvignon Blanc",
  },
  {
    author_id: 9,
    name: "Milbrandt",
    image_url: "1-green_wine.png",
    region: "Washington",
    flavor: "Riesling",
  },
  {
    author_id: 9,
    name: "Robert Mondavi",
    image_url: "1-green_wine.png",
    region: "California",
    flavor: "Chardonnay",
  },
  {
    author_id: 9,
    name: "Barefoot Moscato",
    image_url: "1-green_wine.png",
    region: "California",
    flavor: "Moscato",
  },
  {
    author_id: 2,
    name: "Uppercut",
    image_url: "3-reddish-purple_wine.png",
    region: "Napa Valley",
    flavor: "Cabernet",
  },
  {
    author_id: 1,
    name: "Astrale",
    image_url: "3-reddish-purple_wine.png",
    region: "Italy",
    flavor: "Red Blend",
  },
  {
    author_id: 7,
    name: "Chateu Burgozone, Cote Du Danube",
    image_url: "3-reddish-purple_wine.png",
    region: "Bulgaria",
    flavor: "Cabernet",
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
  },
  {
    wine_id: 4,
    user_id: 2,
    name: "Always enjoyable",
    rating: 4,
    price: 999,
    review_comment:
      "I really really enjoy this wine, it's got a great body and smooth flavor. It's not the most breath takeing wine ever but it's super good",
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
  },
  {
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
  },
  {
    wine_id: 8,
    user_id: 5,
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
    user_id: 5,
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
    user_id: 8,
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
    user_id: 9,
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
    user_id: 8,
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
    user_id: 9,
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
    user_id: 9,
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
    user_id: 9,
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
    user_id: 8,
    name: "It's good",
    rating: 3,
    review_comment: "Enjoyable wine, does in fact have a buttery texture",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
  },
  {
    wine_id: 16,
    user_id: 9,
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
    user_id: 8,
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
    user_id: 4,
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
    user_id: 1,
    name: "Special Edition Italian Wine",
    rating: 4,
    price: 1299,
    review_comment:
      "Lovely wine, aged 5 years (2018). It was a celebratory gift and was very mild.",
    image_url:
      "https://www.totalwine.com/dynamic/490x/media/sys_master/twmmedia/hc8/h27/12291781820446.png",
    review_date: "2023-05-09",
  },
  {
    wine_id: 2,
    user_id: 5,
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
  {
    wine_id: 19,
    user_id: 7,
    name: "Thankfully, does not taste like a burger...",
    rating: 4,
    price: 3000,
    review_comment: "Pretty sweet for a red wine! I like it.",
    review_date: "2023-05-23",
    location: "Restaurant",
  },
];

module.exports = {
  userData,
  wineData,
  reviewData,
};
