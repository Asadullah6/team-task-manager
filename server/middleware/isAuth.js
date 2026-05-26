// server/middleware/isAuth.js
// Attach this middleware to any route that requires login
// Usage: router.get('/teams', isAuth, teamsController.getAll)

const isAuth = (req, res, next) => {
  // express-session puts the user data in req.session.user after login
  if (req.session && req.session.user) {
    return next(); // user is logged in, continue to the route handler
  }
  // user is not logged in
  return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

module.exports = isAuth;
