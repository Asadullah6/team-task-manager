// client/src/components/teams/TeamCard.jsx
// Displays a single team in the dashboard list
// Props: team object, onDelete function, onClick function (to view team detail)

import useAuth from '../../hooks/useAuth';

const TeamCard = ({ team, onDelete, onClick }) => {
  const { user } = useAuth();
  const isCreator = team.creator_id === user?.id;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        {/* Team initial avatar */}
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
          {team.name.charAt(0).toUpperCase()}
        </div>

        {/* Only show delete button to the team creator */}
        {isCreator && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // don't trigger onClick (team detail view)
              onDelete(team.id);
            }}
            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xl leading-none"
            title="Delete team"
          >
            ×
          </button>
        )}
      </div>

      <h3 className="font-semibold text-slate-800 mb-1">{team.name}</h3>
      {team.description && (
        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{team.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>👥 {team.member_count} member{team.member_count !== 1 ? 's' : ''}</span>
        {isCreator && (
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Creator</span>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
