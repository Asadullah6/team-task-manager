// server/routes/tasks.js
// All routes here require the user to be logged in (isAuth middleware)
// Base path is /api/tasks (set in app.js)

const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { validateTask, validateTaskUpdate } = require('../validators/taskValidator');
const isAuth = require('../middleware/isAuth');

router.use(isAuth); // Apply isAuth to ALL routes in this file

router.get('/', getTasks);                             // GET    /api/tasks?team_id=1&assigned_to=2
router.get('/:id', getTaskById);                      // GET    /api/tasks/:id
router.post('/', validateTask, createTask);           // POST   /api/tasks
router.put('/:id', validateTaskUpdate, updateTask);   // PUT    /api/tasks/:id
router.delete('/:id', deleteTask);                    // DELETE /api/tasks/:id

module.exports = router;
