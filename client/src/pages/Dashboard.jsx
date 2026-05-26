// client/src/pages/Dashboard.jsx
// Main page of the app — shows teams list + tasks list with filters
// This page is protected (only logged-in users can see it)

import { useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Modal from '../components/shared/Modal';
import TeamCard from '../components/teams/TeamCard';
import CreateTeamForm from '../components/teams/CreateTeamForm';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskModal from '../components/tasks/TaskModal';
import useTeams from '../hooks/useTeams';
import useTasks from '../hooks/useTasks';

const Dashboard = () => {
  // Team state
  const { teams, loading: teamsLoading, createTeam, deleteTeam } = useTeams();
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  // Task state
  const [filters, setFilters] = useState({});
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(filters);
  const [taskModal, setTaskModal] = useState({ open: false, task: null }); // null = create mode

  // Filter tasks by status on the client side (team filter goes to API)
  const filteredTasks = filters.status
    ? tasks.filter((t) => t.status === filters.status)
    : tasks;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateTeam = async (data) => {
    await createTeam(data);
    setShowCreateTeam(false);
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Delete this team? All tasks in it will also be deleted.')) {
      await deleteTeam(id);
    }
  };

  const handleSaveTask = async (data) => {
    if (taskModal.task) {
      await updateTask(taskModal.task.id, data);
    } else {
      await createTask(data);
    }
    setTaskModal({ open: false, task: null });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Teams Section ─────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Your Teams</h2>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + New Team
            </button>
          </div>

          {teamsLoading ? (
            <p className="text-slate-400 text-sm">Loading teams...</p>
          ) : teams.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
              <p className="text-slate-400 mb-3">No teams yet</p>
              <button
                onClick={() => setShowCreateTeam(true)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Create your first team →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onDelete={handleDeleteTeam}
                  onClick={() => {}} // extend later for team detail page
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Tasks Section ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-slate-800">Tasks</h2>
            <button
              onClick={() => setTaskModal({ open: true, task: null })}
              disabled={teams.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              title={teams.length === 0 ? 'Create a team first' : ''}
            >
              + New Task
            </button>
          </div>

          {/* Filter bar */}
          <div className="mb-5">
            <TaskFilters teams={teams} filters={filters} onFilterChange={setFilters} />
          </div>

          {tasksLoading ? (
            <p className="text-slate-400 text-sm">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
              <p className="text-slate-400 mb-3">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match the current filters'}
              </p>
              {tasks.length === 0 && teams.length > 0 && (
                <button
                  onClick={() => setTaskModal({ open: true, task: null })}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Create your first task →
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => setTaskModal({ open: true, task: t })}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Modals ────────────────────────────────────────────────────── */}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <Modal title="Create New Team" onClose={() => setShowCreateTeam(false)}>
          <CreateTeamForm
            onSuccess={handleCreateTeam}
            onCancel={() => setShowCreateTeam(false)}
          />
        </Modal>
      )}

      {/* Create / Edit Task Modal */}
      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          teams={teams}
          onSave={handleSaveTask}
          onClose={() => setTaskModal({ open: false, task: null })}
        />
      )}
    </div>
  );
};

export default Dashboard;
