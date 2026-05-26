// client/src/services/taskService.js
import api from './api';

// filters = { team_id, assigned_to } — both optional
export const getTasks = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.team_id) params.append('team_id', filters.team_id);
  if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);
  return api.get(`/api/tasks?${params.toString()}`);
};

export const getTaskById = (id) => api.get(`/api/tasks/${id}`);
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
