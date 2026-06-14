import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceStatusBanner from "../components/ServiceStatusBanner";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

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

      const result = await api.createTask(payload, token);

      if (result.serviceUnavailable || result.status === 503) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
        return;
      }

      if (!result.ok) {
        throw new Error(result.error || "Gagal membuat task");
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

      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">

        <h2 className="font-bold text-2xl mb-6 text-gray-800 dark:text-white transition-colors duration-300">
          Tambah Task
        </h2>

        <form onSubmit={handleCreate}>
          <Input
            label="Judul Task"
            placeholder="Ketik judul tugas..."
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
            disabled={loading}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan detail tugas..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E75B6] dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 min-h-[100px]"
              rows="4"
            />
          </div>

          <Input
            label="Link Referensi (Opsional)"
            type="url"
            placeholder="https://example.com"
            value={form.attachment_url}
            onChange={(e) =>
              setForm({
                ...form,
                attachment_url: e.target.value,
              })
            }
            disabled={loading}
          />

          <Input
            label="Deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
            required
            disabled={loading}
          />

          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Task"}
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateTask;