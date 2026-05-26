// client/src/components/teams/CreateTeamForm.jsx
// Form to create a new team — used inside a Modal on the dashboard
// Props: onSuccess (called after team is created), onCancel (closes modal)

import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CreateTeamForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await onSuccess(data); // parent handles the actual API call
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Team Name *</label>
        <input
          type="text"
          placeholder="e.g. Frontend Team"
          className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-400' : 'border-slate-300'
          }`}
          {...register('name', { required: 'Team name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          placeholder="What does this team work on?"
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          {...register('description')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg text-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
