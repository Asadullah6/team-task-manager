// client/src/components/tasks/TaskCard.jsx
// Displays a single task card — clicking it opens the edit modal
// Props: task object, onEdit function, onDelete function

const priorityStyles = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const statusStyles = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div
      onClick={() => onEdit(task)}
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      {/* Top row: status + priority badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}>
          {task.priority} priority
        </span>
      </div>

      {/* Task title */}
      <h3 className={`font-semibold text-slate-800 mb-1 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h3>

      {/* Description preview */}
      {task.description && (
        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Bottom row: team, assignee, due date, delete */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <div className="flex flex-col gap-1">
          <span>🏷️ {task.team_name}</span>
          {task.assigned_to_name && <span>👤 {task.assigned_to_name}</span>}
          {task.due_date && (
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              📅 {new Date(task.due_date).toLocaleDateString()} {isOverdue && '(Overdue)'}
            </span>
          )}
        </div>

        {/* Delete button — only visible on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xl leading-none self-start"
          title="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
