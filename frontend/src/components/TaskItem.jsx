const TaskItem = ({ task, onDelete, onEdit }) => {
  return (
    <div className="p-4 border-b flex justify-between items-start">

      {/* LEFT CONTENT */}
      <div>
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
        <p className="text-sm text-gray-500">
          📅 {new Date(task.deadline).toLocaleString()}
        </p>
      </div>

      {/* RIGHT BUTTON */}
      <div className="flex gap-2">

        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

      </div>
    </div>
  );
};

export default TaskItem;