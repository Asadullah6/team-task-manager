// server/validators/taskValidator.js

const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required().messages({
    'any.required': 'Task title is required',
  }),
  description: Joi.string().max(1000).allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  due_date: Joi.date().allow(null),
  team_id: Joi.number().integer().required().messages({
    'any.required': 'Team ID is required',
  }),
  assigned_to: Joi.number().integer().allow(null),
});

// For updates, all fields are optional
const taskUpdateSchema = taskSchema.fork(
  ['title', 'team_id'],
  (field) => field.optional()
);

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

const validateTaskUpdate = (req, res, next) => {
  const { error } = taskUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message) });
  next();
};

module.exports = { validateTask, validateTaskUpdate };
