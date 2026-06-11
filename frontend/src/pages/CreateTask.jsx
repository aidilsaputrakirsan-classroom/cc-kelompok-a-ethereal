import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceStatusBanner from "../components/ServiceStatusBanner";

const API_URL = import.meta.env.VITE_API_URL;

const CreateTask = ({ token, showToast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    attachment_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] =
    useState(false);

  // ================= CREATE TASK =================
  const handleCreate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setServiceUnavailable(false);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        attachment_url: form.attachment_url,
      };

      console.log("FORM DATA:", payload);

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 503) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
        setLoading(false);
        return;
      }

      if (response.status >= 500) {
        throw new Error("Service error");
      }

      const data = await response.json();

      console.log("RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );
      }

      showToast("Task berhasil dibuat!", "success");

      navigate("/");
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service error")
      ) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
      } else {
        showToast(
          err.message || "Terjadi kesalahan",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setServiceUnavailable(false);
  };

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
          Tambah Task
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
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
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
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
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
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
        />

        <input
          type="datetime-local"
          aria-label="Deadline"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline: e.target.value,
            })
          }
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-colors duration-300"
        />

        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-5 py-2 rounded transition-colors duration-300"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-5 py-2 rounded transition-colors duration-300"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTask;