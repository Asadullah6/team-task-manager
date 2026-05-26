// client/src/hooks/useTasks.js
// Fetches and manages task data with optional filters
// Example: const { tasks, loading, createTask, updateTask, deleteTask } = useTasks({ team_id: 1 });

import { useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';

const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks(filters);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.team_id, filters.assigned_to]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await taskService.createTask(data);
    setTasks(prev => [res.data.task, ...prev]);
    return res.data.task;
  };

  const updateTask = async (id, data) => {
    const res = await taskService.updateTask(id, data);
    setTasks(prev => prev.map(t => t.id === id ? res.data.task : t));
    return res.data.task;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
};

export default useTasks;
