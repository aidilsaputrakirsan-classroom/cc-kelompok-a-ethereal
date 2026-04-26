const TaskItem = ({ task, onDelete, onEdit }) => {

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm("Yakin mau hapus task ini?");
    if (confirmDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div className="p-4 border rounded-lg flex justify-between items-center mb-3 bg-white shadow-sm">

      <div>
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
        <p className="text-xs text-gray-400">
          📅 {new Date(task.deadline).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDeleteClick}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;