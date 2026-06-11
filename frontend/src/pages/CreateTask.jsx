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
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      {/* Service Status Banner */}
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Task service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="task"
      />

      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md border">

        <h2 className="font-bold text-2xl mb-6 text-gray-800">
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
          className="w-full border p-3 rounded mb-3"
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
          className="w-full border p-3 rounded mb-3"
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
          className="w-full border p-3 rounded mb-3"
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
          className="w-full border p-3 rounded mb-5"
        />

        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-5 py-2 rounded"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-5 py-2 rounded"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTask;