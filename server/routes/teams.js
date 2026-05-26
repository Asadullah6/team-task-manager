// server/routes/teams.js
// All routes here require the user to be logged in (isAuth middleware)
// Base path is /api/teams (set in app.js)

const express = require('express');
const router = express.Router();
const { getTeams, getTeamById, createTeam, addMember, deleteTeam } = require('../controllers/teamController');
const { validateTeam, validateAddMember } = require('../validators/teamValidator');
const isAuth = require('../middleware/isAuth');

router.use(isAuth); // Apply isAuth to ALL routes in this file

router.get('/', getTeams);                             // GET    /api/teams
router.get('/:id', getTeamById);                      // GET    /api/teams/:id
router.post('/', validateTeam, createTeam);           // POST   /api/teams
router.post('/:id/members', validateAddMember, addMember); // POST   /api/teams/:id/members
router.delete('/:id', deleteTeam);                    // DELETE /api/teams/:id

module.exports = router;
