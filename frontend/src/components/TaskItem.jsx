const TaskItem = ({ task, onDelete, onEdit }) => {
  // kalau task undefined/null → jangan render
  if (!task) return null;

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm("Yakin mau hapus task ini?");
    if (confirmDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className="
        p-4
        border
        border-gray-200
        dark:border-gray-700
        rounded-lg
        flex
        justify-between
        items-center
        mb-3
        bg-white
        dark:bg-gray-800
        shadow-sm
        transition-colors
        duration-300
      "
    >
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {task.title || "-"}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-300">
          {task.description || "Tidak ada deskripsi"}
        </p>

        <p className="text-xs text-gray-400">
          📅{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleString()
            : "Tidak ada deadline"}
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