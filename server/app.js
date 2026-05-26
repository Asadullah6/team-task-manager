const express = require('express');
const cors = require('cors');
const path = require('path');
const sessionMiddleware = require('./config/session');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');

const app = express();

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

// ── Serve React frontend in production ──────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Serve built React files from client/dist
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Any route that is not /api/* → serve React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use(errorHandler);

module.exports = app;