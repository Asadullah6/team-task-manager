// server/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const sessionMiddleware = require('./config/session');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');

const app = express();
 app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TEMPORARY debug route
app.get('/api/debug', (req, res) => {
  res.json({ 
    DATABASE_URL: process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  });
});
// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // FIX: use '/{*path}' instead of '*' for newer Express/path-to-regexp
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;