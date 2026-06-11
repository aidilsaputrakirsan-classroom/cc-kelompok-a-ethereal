import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceStatusBanner from "../components/ServiceStatusBanner";

const API_URL = import.meta.env.VITE_API_URL;

const EditTask = ({ token, showToast }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    attachment_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] =
    useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // ================= FETCH TASK DETAIL =================
  const fetchTask = async () => {
    try {
      setFetching(true);
      setServiceUnavailable(false);

      const res = await fetch(`${API_URL}/tasks/${id}`, {
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
        throw new Error(data.detail || "Gagal mengambil task");
      }

      setForm({
        title: data.title || "",
        description: data.description || "",
        attachment_url: data.attachment_url || "",
        deadline: data.deadline
          ? new Date(data.deadline)
              .toISOString()
              .slice(0, 16)
          : "",
      });
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
        showToast(
          "Gagal mengambil data task",
          "error"
        );
      }

      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [retryAttempt]);

  // ================= UPDATE TASK =================
  const handleUpdate = async () => {
    setLoading(true);
    setServiceUnavailable(false);

    try {
      let formattedDeadline = form.deadline;

      if (
        formattedDeadline &&
        formattedDeadline.length === 16
      ) {
        formattedDeadline += ":00";
      }

      const payload = {
        title: form.title,
        description: form.description,
        attachment_url: form.attachment_url,
        deadline: formattedDeadline,
      };

      console.log("UPDATE PAYLOAD:", payload);

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 503) {
        throw new Error("Service temporarily unavailable");
      }

      if (res.status >= 500) {
        throw new Error("Service temporarily unavailable");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );
      }

      showToast(
        "Task berhasil diupdate!",
        "success"
      );

      navigate("/");
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
        showToast("Gagal update task", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryAttempt((prev) => prev + 1);
  };

  // ================= LOADING =================
  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-800 dark:text-white">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start justify-center pt-16 px-4 transition-colors duration-300">
      {/* Service Status Banner */}
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Task service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="task"
      />

      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">

        <h2 className="font-bold text-2xl mb-6 text-gray-800 dark:text-white transition-colors duration-300">
          Edit Task
        </h2>

        <input
          placeholder="Judul"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
        />

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
          rows="4"
        />

        <input
          type="url"
          placeholder="Link Referensi (Opsional)"
          value={form.attachment_url}
          onChange={(e) =>
            setForm({
              ...form,
              attachment_url: e.target.value,
            })
          }
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
        />

        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline: e.target.value,
            })
          }
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
        />

        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditTask;