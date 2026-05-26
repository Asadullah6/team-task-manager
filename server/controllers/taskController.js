// server/controllers/taskController.js
// Handles: get tasks (with filters), create, update, delete task

const pool = require('../config/db');

// GET /api/tasks?team_id=1&assigned_to=2  - get tasks with optional filters
const getTasks = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { team_id, assigned_to } = req.query;

    // Base query - only return tasks for teams the user belongs to
    let query = `
      SELECT t.*, 
             u_assigned.name AS assigned_to_name,
             u_created.name AS created_by_name,
             tm_teams.name AS team_name
      FROM tasks t
      JOIN teams tm_teams ON t.team_id = tm_teams.id
      JOIN team_members tm ON t.team_id = tm.team_id AND tm.user_id = $1
      LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
      JOIN users u_created ON t.created_by = u_created.id
      WHERE 1=1
    `;

    const params = [userId];
    let paramIndex = 2;

    // Optionally filter by team
    if (team_id) {
      query += ` AND t.team_id = $${paramIndex}`;
      params.push(team_id);
      paramIndex++;
    }

    // Optionally filter by assigned user
    if (assigned_to) {
      query += ` AND t.assigned_to = $${paramIndex}`;
      params.push(assigned_to);
      paramIndex++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// GET /api/tasks/:id  - get a single task
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const result = await pool.query(
      `SELECT t.*, u.name AS assigned_to_name
       FROM tasks t
       JOIN team_members tm ON t.team_id = tm.team_id AND tm.user_id = $1
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $2`,
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// POST /api/tasks  - create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date, team_id, assigned_to } = req.body;
    const userId = req.session.user.id;

    // Verify user is a member of the team
    const memberCheck = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2',
      [team_id, userId]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'You are not a member of this team' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, team_id, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, status || 'todo', priority || 'medium', due_date || null, team_id, assigned_to || null, userId]
    );

    res.status(201).json({ message: 'Task created', task: result.rows[0] });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// PUT /api/tasks/:id  - update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to } = req.body;
    const userId = req.session.user.id;

    // Make sure user is a member of the team this task belongs to
    const taskResult = await pool.query(
      `SELECT t.* FROM tasks t
       JOIN team_members tm ON t.team_id = tm.team_id AND tm.user_id = $1
       WHERE t.id = $2`,
      [userId, id]
    );
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           assigned_to = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, status, priority, due_date, assigned_to || null, id]
    );

    res.json({ message: 'Task updated', task: result.rows[0] });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// DELETE /api/tasks/:id  - delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    // Only the task creator or team admin can delete
    const taskResult = await pool.query(
      `SELECT t.created_by, tm.role
       FROM tasks t
       JOIN team_members tm ON t.team_id = tm.team_id AND tm.user_id = $1
       WHERE t.id = $2`,
      [userId, id]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { created_by, role } = taskResult.rows[0];

    if (created_by !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Only the task creator or team admin can delete this task' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
