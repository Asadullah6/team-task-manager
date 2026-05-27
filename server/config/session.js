// server/config/session.js

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');
require('dotenv').config();

const sessionConfig = {
  store: process.env.NODE_ENV === 'production'
    ? new pgSession({ pool, tableName: 'session' })
    : undefined,

  secret: process.env.SESSION_SECRET || 'dev_secret_change_this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000,
    sameSite: 'none',  // ← changed to none for cross-origin cookies
  },
};

module.exports = session(sessionConfig);