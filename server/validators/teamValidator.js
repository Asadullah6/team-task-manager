// server/validators/teamValidator.js

const Joi = require('joi');

const teamSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Team name is required',
  }),
  description: Joi.string().max(500).allow('', null),
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Member email is required',
    'string.email': 'Please provide a valid email',
  }),
});

const validateTeam = (req, res, next) => {
  const { error } = teamSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

const validateAddMember = (req, res, next) => {
  const { error } = addMemberSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

module.exports = { validateTeam, validateAddMember };
