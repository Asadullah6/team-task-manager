// client/src/components/tasks/TaskFilters.jsx
// Dropdowns to filter tasks by team or assigned member
// Props: teams array, filters object, onFilterChange function

const TaskFilters = ({ teams, filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-slate-600">Filter:</span>

      {/* Filter by team */}
      <select
        value={filters.team_id || ''}
        onChange={(e) => onFilterChange({ ...filters, team_id: e.target.value || undefined })}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>

      {/* Filter by status (client-side) */}
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Clear filters */}
      {(filters.team_id || filters.status) && (
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
