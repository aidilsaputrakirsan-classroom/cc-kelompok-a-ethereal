import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "./TaskItem";

const TaskList = ({ token, showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FETCH
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.filter((t) => t.id !== id));
      showToast("Task berhasil dihapus!", "info");
    } catch (err) {
      console.error(err);
      showToast("Gagal hapus task", "error");
    }
  };

  // COMPLETE TASK (hapus otomatis saat selesai)
  const handleComplete = async (id) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.filter((t) => t.id !== id));
      showToast("Tugas telah selesai!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal menyelesaikan tugas", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">
          Daftar Task
        </h2>
      </div>

      {/* LIST */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onEdit={(task) => navigate(`/edit/${task.id}`)}
          />
        ))
      ) : (
        <div className="text-center text-gray-400">
          Tidak ada tugas
        </div>
      )}
    </div>
  );
};

export default TaskList;