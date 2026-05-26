// server/routes/auth.js
// Defines the URL endpoints for authentication
// Base path is /api/auth (set in app.js)

const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const isAuth = require('../middleware/isAuth');

router.post('/register', validateRegister, register);  // POST /api/auth/register
router.post('/login', validateLogin, login);           // POST /api/auth/login
router.post('/logout', isAuth, logout);                // POST /api/auth/logout
router.get('/me', isAuth, getMe);                      // GET  /api/auth/me

module.exports = router;
