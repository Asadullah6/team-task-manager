// client/src/hooks/useTeams.js
// Fetches and manages team data — use this in any component that needs teams
// Example: const { teams, loading, createTeam, deleteTeam, refetch } = useTeams();

import { useState, useEffect, useCallback } from 'react';
import * as teamService from '../services/teamService';

const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teamService.getTeams();
      setTeams(res.data.teams);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const createTeam = async (data) => {
    const res = await teamService.createTeam(data);
    setTeams(prev => [res.data.team, ...prev]);
    return res.data.team;
  };

  const deleteTeam = async (id) => {
    await teamService.deleteTeam(id);
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  return { teams, loading, error, createTeam, deleteTeam, refetch: fetchTeams };
};

export default useTeams;
