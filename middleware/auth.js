/**
 * Middleware to check if user is authenticated via OAuth
 * This should be applied to protected routes
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: "Authentication required. Please login via /auth/google",
  });
};

module.exports = { isAuthenticated };
