-- Run this first
-- Creates the users table where all registered accounts are stored

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,        -- bcrypt hashed password, never plain text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
