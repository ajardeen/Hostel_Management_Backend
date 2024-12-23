const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel"); // Adjust path to your User model
require("dotenv").config();

// Resident user auth Middleware 
const authMiddleware = async (req, res, next) => {
  
  try {
    // Check if the Authorization header exists and starts with "Bearer"
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Extract the token
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach the user to the request object
    req.user = user;
    
    
    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // Handle errors in token verification
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
