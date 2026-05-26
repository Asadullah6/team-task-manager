// server/config/session.js
// Configures how sessions work - stored in PostgreSQL when in production,
// falls back to memory storage in development (as required by the assessment)

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');
require('dotenv').config();

const sessionConfig = {
  // Use PostgreSQL to store sessions (so they survive server restarts)
  store: process.env.NODE_ENV === 'production'
    ? new pgSession({ pool, tableName: 'session' })
    : undefined,  // undefined = use memory store in development

  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                           // JS cannot access this cookie (security)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
};

module.exports = session(sessionConfig);
