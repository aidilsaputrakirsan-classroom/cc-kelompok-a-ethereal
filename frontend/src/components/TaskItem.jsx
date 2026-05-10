const TaskItem = ({ task, onDelete, onEdit, onComplete }) => {
  // kalau task undefined/null → jangan render
  if (!task) return null;

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm("Yakin mau hapus task ini?");
    if (confirmDelete) {
      onDelete(task.id);
    }
  };

  const handleCompleteClick = () => {
    const confirmComplete = window.confirm(
      "Tandai tugas ini sebagai selesai?"
    );

    if (confirmComplete) {
      onComplete(task.id);
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
        {/* TITLE */}
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {task.title || "-"}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {task.description || "Tidak ada deskripsi"}
        </p>

        {/* DEADLINE */}
        <p className="text-xs text-gray-400">
          📅{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleString()
            : "Tidak ada deadline"}
        </p>

        {/* ATTACHMENT URL / LINK REFERENSI */}
        {task.attachment_url && (
          <a
            href={task.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline block mt-2"
          >
            🔗 Buka Link Referensi
          </a>
        )}
      </div>

      <div className="flex gap-2">
        {/* BUTTON SELESAI */}
        <button
          onClick={handleCompleteClick}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Selesai
        </button>

        {/* BUTTON EDIT */}
        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        {/* BUTTON DELETE */}
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