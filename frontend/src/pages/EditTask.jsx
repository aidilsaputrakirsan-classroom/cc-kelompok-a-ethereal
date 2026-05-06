import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = ({ token, showToast }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= GET DETAIL TASK =================
  const fetchTask = async () => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mengambil task");
      }

      setForm({
        title: data.title || "",
        description: data.description || "",
        deadline: data.deadline
          ? new Date(data.deadline).toISOString().slice(0, 16)
          : "",
      });
    } catch (err) {
      console.error(err);
      showToast("Gagal mengambil data task", "error");
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // ================= UPDATE TASK =================
  const handleUpdate = async () => {
    setLoading(true);

    try {
      let formattedDeadline = form.deadline;

      // fix datetime-local → backend
      if (formattedDeadline.length === 16) {
        formattedDeadline += ":00";
      }

      const payload = {
        title: form.title,
        description: form.description,
        deadline: formattedDeadline,
      };

      console.log("UPDATE PAYLOAD:", payload);

      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );
      }

      showToast("Task berhasil diupdate!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast("Gagal update task", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading task...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md border">
        <h2 className="font-bold text-2xl mb-6 text-gray-800">
          Edit Task
        </h2>

        <input
          placeholder="Judul"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        />

        <input
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
          className="w-full border p-2 rounded mb-5"
        />

        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;