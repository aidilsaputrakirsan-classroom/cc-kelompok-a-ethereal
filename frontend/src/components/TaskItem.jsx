import { useState } from "react";
import { Button } from "./ui/Button";

const TaskItem = ({ task, onDelete, onEdit, onComplete }) => {
  const [processing, setProcessing] = useState(false);

  // kalau task undefined/null → jangan render
  if (!task) return null;

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm("Yakin mau hapus task ini?");
    if (confirmDelete) {
      setProcessing(true);
      await onDelete(task.id);
      // Item will likely be removed, but just in case:
      setProcessing(false);
    }
  };

  const handleCompleteClick = async () => {
    const confirmComplete = window.confirm(
      "Tandai tugas ini sebagai selesai?"
    );

    if (confirmComplete) {
      setProcessing(true);
      await onComplete(task.id);
      setProcessing(false);
    }
  };

  return (
    <div
      className={`
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
        transition-all
        duration-300
        ${processing ? "opacity-60 grayscale-[0.5]" : ""}
      `}
    >
      <div>
        {/* TITLE */}
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {task.title || "-"}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description || "Tidak ada deskripsi"}
        </p>

        {/* DEADLINE */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
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
            className="text-sm text-blue-500 dark:text-blue-400 hover:underline dark:hover:text-blue-300 block mt-2 transition-colors"
          >
            🔗 Buka Link Referensi
          </a>
        )}
      </div>

      <div className="flex gap-2">
        {/* BUTTON SELESAI */}
        <div className="w-auto">
          <Button
            onClick={handleCompleteClick}
            variant="success"
            className="px-4 py-1.5 mt-0"
            disabled={processing}
          >
            {processing ? "..." : "Selesai"}
          </Button>
        </div>

        {/* BUTTON EDIT */}
        <div className="w-auto">
          <Button
            onClick={() => onEdit(task)}
            variant="warning"
            className="px-4 py-1.5 mt-0"
            disabled={processing}
          >
            Edit
          </Button>
        </div>

        {/* BUTTON DELETE */}
        <div className="w-auto">
          <Button
            onClick={handleDeleteClick}
            variant="danger"
            className="px-4 py-1.5 mt-0"
            disabled={processing}
          >
            {processing ? "..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;