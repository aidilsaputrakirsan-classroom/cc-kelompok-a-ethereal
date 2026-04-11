const TaskItem = ({ task, onDelete }) => {
  const statusColors = {
    "To Do": "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-600",
    "Done": "bg-green-100 text-green-600",
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status] || "bg-gray-100"}`}>
              {task.status}
            </span>
            <span className="text-xs text-gray-400">
              📅 {new Date(task.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
          title="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;