const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token and sets it as an HTTP-only cookie.
 * 
 * @param {Response} res - Express response object
 * @param {string} userId - ID of the user to encode in the token
 * @returns {string} The generated JWT token
 */
const generateTokenAndSetCookie = (res, userId) => {
  // Token expires in 24 hours
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  // Cookie settings for security
  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Protects against CSRF
    maxAge: 24 * 60 * 60 * 1000, // Matches token expiration (24 hours)
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };