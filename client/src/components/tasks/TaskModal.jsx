// client/src/components/tasks/TaskModal.jsx
// Modal form for creating a new task OR editing an existing one
// Props:
//   task = null (create mode) OR task object (edit mode)
//   teams = list of teams for the dropdown
//   onSave(data) = called when form is submitted
//   onClose = closes the modal

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../shared/Modal';

const TaskModal = ({ task, teams, onSave, onClose }) => {
  const isEditing = Boolean(task);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // If editing, pre-fill the form with the existing task data
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        team_id: task.team_id,
        assigned_to: task.assigned_to || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '', // format for date input
      });
    } else {
      reset({ status: 'todo', priority: 'medium' });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    // Convert empty strings to null for optional fields
    const cleaned = {
      ...data,
      team_id: parseInt(data.team_id),
      assigned_to: data.assigned_to ? parseInt(data.assigned_to) : null,
      due_date: data.due_date || null,
    };
    await onSave(cleaned);
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition ${
      hasError ? 'border-red-400' : 'border-slate-300'
    }`;

  return (
    <Modal title={isEditing ? 'Edit Task' : 'Create New Task'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            className={inputClass(errors.title)}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            placeholder="Add more details..."
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            {...register('description')}
          />
        </div>

        {/* Team (required) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team *</label>
          <select
            className={inputClass(errors.team_id)}
            {...register('team_id', { required: 'Please select a team' })}
            disabled={isEditing} // can't change team when editing
          >
            <option value="">Select a team...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {errors.team_id && <p className="text-red-500 text-xs mt-1">{errors.team_id.message}</p>}
        </div>

        {/* Status + Priority side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select className={inputClass()} {...register('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select className={inputClass()} {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            className={inputClass()}
            {...register('due_date')}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
