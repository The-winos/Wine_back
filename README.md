# Wine_back

Corks Backend Overview:
The backend of the Corks application is built using a PostgreSQL database and an Express.js framework to create a RESTful API. The database consists of several tables that are interconnected using references and enums to ensure accurate data input. Let's explore each table in more detail:

1. Users:
   - This table stores information about the application users, such as usernames, passwords, email addresses, and avatar images.
   - It allows users to create accounts and authenticate themselves on the platform.

2. Wine:
   - The Wine table contains details about different wines available in the application.
   - It includes information like the wine's name, flavor, price, and an image URL.
   - Each wine can be associated with multiple reviews, favorites, and followers.

3. Followers:
   - The Followers table establishes a relationship between users.
   - It stores records indicating which users are following each other.
   - This feature allows users to follow their friends and family members to discover their favorite wines and reviews.

4. Favorites:
   - The Favorites table tracks the wines that users have marked as their favorites.
   - It links a user and a specific wine, indicating that the user has favorited that particular wine.
   - This feature enables users to easily access and reference their preferred wines.

5. Reviews:
   - The Reviews table stores individual wine reviews created by users.
   - It contains information about the rating, review comment, price, and location associated with each review.
   - Each review is linked to a specific user and wine, providing valuable insights and opinions on different wines.

6. Saved:
   - The Saved table allows users to save wines for future reference or purchase.
   - It maintains a record of the wines that users have saved.
   - This feature helps users keep track of wines they are interested in or plan to buy.

7. Badges:
   - The Badges table represents various achievements or badges that users can earn based on their activity and engagement within the Corks application.
   - It includes information about the badge name, description, and associated criteria.
   - Badges can serve as recognition for users' contributions and accomplishments on the platform.

Overall, the Corks backend architecture facilitates the storage and retrieval of user data, wine information, reviews, favorites, and other essential functionalities. The API endpoints provided by the backend enable communication between the frontend and backend, allowing users to interact with the application seamlessly.

Feel free to ask if you have any specific questions or need further details!

Deployment:

To start the project locally:

Seed your database with: npm run seed

Start you api with: npm run start:dev

If you'd like local host the api it is http://localhost:8080/api
