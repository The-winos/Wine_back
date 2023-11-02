const express = require("express");
const tokenRouter = express.Router();


tokenRouter.use((req, res, next) => {
  console.log("A request is being made to /token");
  next();
});

tokenRouter.get("/verify-reset-token", async (req, res) => {
  try {
    // Extract the reset token from the query parameters
    const resetToken = req.query.token;

    // Check if the token exists in the database
    const query = {
      text: "SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at >= NOW()",
      values: [resetToken],
    };

    try {
      const result = await client.query(query);

      // If a row is returned, the token is valid
      if (result.rows.length > 0) {
        res.status(200).json({ valid: true, message: "Token is valid" });
      } else {
        res
          .status(400)
          .json({ valid: false, message: "Invalid or expired token" });
      }
    } catch (error) {
      console.error("Error verifying reset token:", error);
      res.status(500).json({ valid: false, message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error handling reset token request:", error);
    res.status(500).json({ valid: false, message: "Internal server error" });
  }
});

module.exports = tokenRouter;
