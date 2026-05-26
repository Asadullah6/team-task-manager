-- Run this fifth and last
-- This table stores login sessions in PostgreSQL
-- The express-session + connect-pg-simple library manages this automatically
-- You don't need to manually insert anything here

CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
