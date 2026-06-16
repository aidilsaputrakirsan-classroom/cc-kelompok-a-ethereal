import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceStatusBanner from "../components/ServiceStatusBanner";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

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

      const result = await api.getTask(id, token);

      if (result.serviceUnavailable || result.status === 503) {
        throw new Error("Service temporarily unavailable");
      }

      if (!result.ok) {
        throw new Error(result.error || "Gagal mengambil task");
      }

      const { data } = result;
      setForm({
        title: data?.title || "",
        description: data?.description || "",
        attachment_url: data?.attachment_url || "",
        deadline: data?.deadline
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
          err.message || "Gagal mengambil data task",
          "error"
        );
      }

      // If it's a 404 or other non-retryable error, go home
      if (!err.message.includes("Service temporarily unavailable")) {
        navigate("/");
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [retryAttempt, id]);

  // ================= UPDATE TASK =================
  const handleUpdate = async (e) => {
    e.preventDefault();
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

      const result = await api.updateTask(id, payload, token);

      if (result.serviceUnavailable || result.status === 503) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
        return;
      }

      if (!result.ok) {
        throw new Error(result.error || "Gagal update task");
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
        showToast(err.message || "Gagal update task", "error");
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E75B6] mb-4"></div>
          <p className="text-gray-800 dark:text-white font-medium">Memuat data task...</p>
        </div>
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

      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">

        <h2 className="font-bold text-2xl mb-6 text-gray-800 dark:text-white transition-colors duration-300">
          Edit Task
        </h2>

        <form onSubmit={handleUpdate}>
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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

export default EditTask;