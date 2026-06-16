import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "./TaskItem";
import ServiceStatusBanner from "./ServiceStatusBanner";
import { api } from "../services/api";

const TaskList = ({ token, showToast, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] =
    useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // 🔥 SEARCH & SORT
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const navigate = useNavigate();

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setServiceUnavailable(false);

      const result = await api.getTasks(token);

      if (result.unauthorized) {
        showToast(result.error, "error");

        if (onLogout) onLogout();

        return;
      }

      if (
        result.serviceUnavailable ||
        result.status === 503
      ) {
        throw new Error(
          "Service temporarily unavailable"
        );
      }

      if (!result.ok) {
        throw new Error(
          result.error || "Gagal mengambil data"
        );
      }

      setTasks(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes(
          "Service temporarily unavailable"
        )
      ) {
        setServiceUnavailable(true);

        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast(
          err.message || "Gagal mengambil data",
          "error"
        );
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

      const result = await api.deleteTask(id, token);

      if (
        result.serviceUnavailable ||
        result.status === 503
      ) {
        throw new Error(
          "Service temporarily unavailable"
        );
      }

      if (!result.ok) {
        throw new Error(
          result.error || "Gagal hapus task"
        );
      }

      setTasks(
        tasks.filter((t) => t.id !== id)
      );

      showToast(
        "Task berhasil dihapus!",
        "info"
      );
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes(
          "Service temporarily unavailable"
        )
      ) {
        setServiceUnavailable(true);

        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast(
          err.message || "Gagal hapus task",
          "error"
        );
      }
    }
  };

  // ================= COMPLETE TASK =================
  const handleComplete = async (id) => {
    try {
      setServiceUnavailable(false);

      const result = await api.deleteTask(id, token);

      if (
        result.serviceUnavailable ||
        result.status === 503
      ) {
        throw new Error(
          "Service temporarily unavailable"
        );
      }

      if (!result.ok) {
        throw new Error(
          result.error ||
            "Gagal menyelesaikan tugas"
        );
      }

      setTasks(
        tasks.filter((t) => t.id !== id)
      );

      showToast(
        "Tugas telah selesai!",
        "success"
      );
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes(
          "Service temporarily unavailable"
        )
      ) {
        setServiceUnavailable(true);

        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast(
          err.message ||
            "Gagal menyelesaikan tugas",
          "error"
        );
      }
    }
  };

  const handleRetry = () => {
    setRetryAttempt((prev) => prev + 1);
  };

  // ================= FILTER & SORT =================

  let filteredTasks = tasks.filter((task) =>
    task.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  switch (sortBy) {
    case "latest":
      filteredTasks.sort(
        (a, b) => b.id - a.id
      );
      break;

    case "oldest":
      filteredTasks.sort(
        (a, b) => a.id - b.id
      );
      break;

    case "az":
      filteredTasks.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "all":
    default:
      break;
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E75B6] mb-4"></div>

        <p className="text-gray-500 dark:text-gray-400">
          Memuat tugas...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Task service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="task"
      />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700 dark:text-gray-200">
          Daftar Tugas
        </h2>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="🔍 Cari tugas..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="latest">
            Terbaru
          </option>

          <option value="oldest">
            Terlama
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="all">
            Semua
          </option>
        </select>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-1">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onComplete={handleComplete}
              onEdit={() =>
                navigate(`/edit/${task.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-4xl mb-2 opacity-50">
            📄
          </p>

          <p className="font-medium">
            Tidak ada tugas yang ditemukan
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;