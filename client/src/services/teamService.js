// client/src/services/teamService.js
import api from './api';

export const getTeams = () => api.get('/api/teams');
export const getTeamById = (id) => api.get(`/api/teams/${id}`);
export const createTeam = (data) => api.post('/api/teams', data);
export const deleteTeam = (id) => api.delete(`/api/teams/${id}`);
export const addTeamMember = (teamId, data) => api.post(`/api/teams/${teamId}/members`, data);
