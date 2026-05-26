// server/controllers/authController.js
// Handles: register, login, logout, and getting the current user

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash the password - never store plain text passwords
    const password_hash = await bcrypt.hash(password, 12);

    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password_hash]
    );

    const user = result.rows[0];

    // Save user in session so they're immediately logged in after registering
    req.session.user = { id: user.id, name: user.name, email: user.email };

    res.status(201).json({ message: 'Account created successfully', user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look up user by email
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't tell them if the email or password was wrong - just say invalid credentials
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare submitted password against stored hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Save user info in session
    req.session.user = { id: user.id, name: user.name, email: user.email };

    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid'); // clear the session cookie from browser
    res.json({ message: 'Logged out successfully' });
  });
};

// GET /api/auth/me  - returns current logged in user (used to check auth state on frontend)
const getMe = (req, res) => {
  res.json({ user: req.session.user });
};

module.exports = { register, login, logout, getMe };
