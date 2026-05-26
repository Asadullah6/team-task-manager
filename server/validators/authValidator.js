// server/validators/authValidator.js
// Joi schemas that validate the request body on register and login
// If validation fails, Joi throws an error caught by errorHandler.js

const Joi = require('joi');

// Called when POST /api/auth/register
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

// Called when POST /api/auth/login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware functions that run the schemas
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

module.exports = { validateRegister, validateLogin };
