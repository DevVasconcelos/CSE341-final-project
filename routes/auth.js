const routes = require('express').Router();
const passport = require('passport');

// @route   GET /auth/google
// @desc    Start Google OAuth flow
// @access  Public
routes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
routes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    // Successful authentication - redirect to full URL
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    res.redirect(`${appUrl}/auth/login/success`);
  }
);

// @route   GET /auth/login/success
// @desc    Login success page
// @access  Private
routes.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
});

// @route   GET /auth/login/failed
// @desc    Login failed page
// @access  Public
routes.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

// @route   GET /auth/logout
// @desc    Logout user
// @access  Private
routes.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out',
      });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error destroying session',
        });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    });
  });
});

// @route   GET /auth/user
// @desc    Get current user
// @access  Private
routes.get('/user', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
});

module.exports = routes;