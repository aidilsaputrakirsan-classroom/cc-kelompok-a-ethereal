import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "./TaskItem";
import ServiceStatusBanner from "./ServiceStatusBanner";

const API_URL = import.meta.env.VITE_API_URL;

const TaskList = ({ token, showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] =
    useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const navigate = useNavigate();

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setServiceUnavailable(false);

      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 503) {
        throw new Error("Service temporarily unavailable");
      }

      if (res.status >= 500) {
        throw new Error("Service temporarily unavailable");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mengambil data");
      }

      setTasks(data);
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service temporarily unavailable")
      ) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast("Gagal mengambil data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [retryAttempt]);

  // ================= DELETE TASK =================
  const handleDelete = async (id) => {
    try {
      setServiceUnavailable(false);

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 503) {
        throw new Error("Service temporarily unavailable");
      }

      if (res.status >= 500) {
        throw new Error("Service error");
      }

      setTasks(tasks.filter((t) => t.id !== id));

      showToast("Task berhasil dihapus!", "info");
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service temporarily unavailable") ||
        err.message.includes("Service error")
      ) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast("Gagal hapus task", "error");
      }
    }
  };

  // ================= COMPLETE TASK =================
  const handleComplete = async (id) => {
    try {
      setServiceUnavailable(false);

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 503) {
        throw new Error("Service temporarily unavailable");
      }

      if (res.status >= 500) {
        throw new Error("Service error");
      }

      setTasks(tasks.filter((t) => t.id !== id));

      showToast("Tugas telah selesai!", "success");
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service temporarily unavailable") ||
        err.message.includes("Service error")
      ) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast("Gagal menyelesaikan tugas", "error");
      }
    }
  };

  const handleRetry = () => {
    setRetryAttempt((prev) => prev + 1);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Service Status Banner */}
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Task service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="task"
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">
          Daftar Task
        </h2>
      </div>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onEdit={() => navigate(`/edit/${task.id}`)}
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