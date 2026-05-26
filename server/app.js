// server/app.js
// This is the heart of your backend
// It sets up Express, connects all middleware, and registers all routes

const express = require('express');
const cors = require('cors');
const sessionMiddleware = require('./config/session');
const errorHandler = require('./middleware/errorHandler');

// Import all route files
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────

// Allow requests from the React frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,   // IMPORTANT: allows cookies to be sent cross-origin
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Attach session handling (reads/writes the session cookie)
app.use(sessionMiddleware);

// ── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);     // → server/routes/auth.js
app.use('/api/teams', teamRoutes);    // → server/routes/teams.js
app.use('/api/tasks', taskRoutes);    // → server/routes/tasks.js

// Health check - visit http://localhost:5000/api/health to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - runs if no route matched
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler - must be LAST
app.use(errorHandler);

module.exports = app;
