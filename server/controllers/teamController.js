// server/controllers/teamController.js
// Handles: create team, get teams, get single team, add member, delete team

const pool = require('../config/db');

// GET /api/teams  - returns all teams the logged-in user belongs to
const getTeams = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const result = await pool.query(
      `SELECT t.id, t.name, t.description, t.creator_id, t.created_at,
              u.name AS creator_name,
              COUNT(tm.user_id) AS member_count
       FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       JOIN users u ON t.creator_id = u.id
       WHERE tm.user_id = $1
       GROUP BY t.id, u.name
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json({ teams: result.rows });
  } catch (err) {
    console.error('Get teams error:', err);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

// GET /api/teams/:id  - returns a single team + its members
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    // Make sure the user is actually a member of this team
    const memberCheck = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2',
      [id, userId]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'You are not a member of this team' });
    }

    // Get team info
    const teamResult = await pool.query(
      `SELECT t.*, u.name AS creator_name
       FROM teams t JOIN users u ON t.creator_id = u.id
       WHERE t.id = $1`,
      [id]
    );
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get all members of the team
    const membersResult = await pool.query(
      `SELECT u.id, u.name, u.email, tm.role, tm.joined_at
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1`,
      [id]
    );

    res.json({ team: teamResult.rows[0], members: membersResult.rows });
  } catch (err) {
    console.error('Get team error:', err);
    res.status(500).json({ message: 'Error fetching team' });
  }
};

// POST /api/teams  - create a new team
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.session.user.id;

    // Create the team
    const result = await pool.query(
      'INSERT INTO teams (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userId]
    );

    const team = result.rows[0];

    // Automatically add the creator as an admin member
    await pool.query(
      "INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, 'admin')",
      [team.id, userId]
    );

    res.status(201).json({ message: 'Team created', team });
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ message: 'Error creating team' });
  }
};

// POST /api/teams/:id/members  - add a member to a team by their email
const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.session.user.id;

    // Only the team creator (admin) can add members
    const teamResult = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (teamResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ message: 'Only the team creator can add members' });
    }

    // Find the user by their email
    const userResult = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const newMember = userResult.rows[0];

    // Check if they're already in the team
    const existing = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2',
      [id, newMember.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'User is already a member of this team' });
    }

    await pool.query(
      "INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, 'member')",
      [id, newMember.id]
    );

    res.status(201).json({ message: 'Member added successfully', member: newMember });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ message: 'Error adding member' });
  }
};

// DELETE /api/teams/:id  - delete a team (only team creator can do this)
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const teamResult = await pool.query('SELECT creator_id FROM teams WHERE id = $1', [id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (teamResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ message: 'Only the team creator can delete this team' });
    }

    // Cascade in SQL will automatically delete team_members and tasks
    await pool.query('DELETE FROM teams WHERE id = $1', [id]);

    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('Delete team error:', err);
    res.status(500).json({ message: 'Error deleting team' });
  }
};

module.exports = { getTeams, getTeamById, createTeam, addMember, deleteTeam };
