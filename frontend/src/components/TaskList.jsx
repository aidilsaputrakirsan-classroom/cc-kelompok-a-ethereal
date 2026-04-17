import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ token, showToast }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    assigned_to: 1
  });

  // 🔥 EDIT STATE
  const [editingTask, setEditingTask] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  console.log("TOKEN:", token);

  // ================= FETCH =================
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setTasks(data);

    } catch (err) {
      console.error(err);
      showToast("Gagal mengambil data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
  try {
    let formattedDeadline = newTask.deadline;

    // FIX FORMAT datetime-local → backend
    if (formattedDeadline.length === 16) {
      formattedDeadline += ":00";
    }

    const res = await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newTask,
        deadline: formattedDeadline
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Gagal create");
    }

    setTasks([...tasks, data]);

    showToast("Task berhasil dibuat!", "success");

    setNewTask({
      title: "",
      description: "",
      deadline: "",
      assigned_to: 1
    });

  } catch (err) {
    console.error(err);
    showToast("Gagal membuat task", "error");
  }
};

  // ================= EDIT (OPEN FORM) =================
  const handleEdit = (task) => {
    setEditingTask(task);

    setEditForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.slice(0, 16),
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      let formattedDeadline = editForm.deadline;

      if (formattedDeadline.length === 16) {
        formattedDeadline += ":00";
      }

      const res = await fetch(`http://localhost:8000/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          deadline: formattedDeadline,
          assigned_to: editingTask.assigned_to,
        }),
      });

      const updated = await res.json();

      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));

      setEditingTask(null);

      showToast("Task berhasil diupdate!", "success");

    } catch (err) {
      console.error(err);
      showToast("Gagal update task", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(tasks.filter(t => t.id !== id));

      showToast("Task berhasil dihapus!", "info");

    } catch (err) {
      console.error(err);
      showToast("Gagal hapus task", "error");
    }
  };

  // ================= LOADING =================
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>

      {/* HEADER */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-bold text-gray-700">Tasks</h2>
      </div>

      {/* CREATE FORM */}
      <div className="p-4 space-y-3 border-b">

        <input
          placeholder="Judul"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Deskripsi"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Tambah Tugas
        </button>
      </div>

      {/* 🔥 EDIT FORM UI */}
      {editingTask && (
        <div className="p-4 border-b bg-white-50 space-y-2 rounded mb-4">

          <h3 className="font-bold">Edit Task</h3>

          <input
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <input
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={editForm.deadline}
            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Simpan
            </button>

            <button
              onClick={() => setEditingTask(null)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Batal
            </button>
          </div>

        </div>
      )}

      {/* LIST */}
      <div>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-400">
            Tidak ada tugas
          </div>
        )}
      </div>

    </div>
  );
};

export default TaskList;