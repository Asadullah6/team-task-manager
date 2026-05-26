// server/middleware/errorHandler.js
// This catches any errors passed via next(err) from route handlers
// Keeps all error responses consistent across the API

const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err.message);

  // Joi validation errors (from our validators)
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details.map((d) => d.message),
    });
  }

  // PostgreSQL unique constraint violation (e.g. duplicate email)
  if (err.code === '23505') {
    return res.status(409).json({ message: 'That email is already registered.' });
  }

  // Default: something unexpected went wrong
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
