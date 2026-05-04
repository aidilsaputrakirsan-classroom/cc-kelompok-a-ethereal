import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = ({ token, showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setForm({
        title: data.title,
        description: data.description,
        deadline: data.deadline.slice(0, 16),
      });

    } catch (err) {
      console.error(err);
      showToast("Gagal ambil data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      let deadline = form.deadline;

      if (deadline.length === 16) {
        deadline += ":00";
      }

      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          deadline,
        }),
      });

      if (!res.ok) throw new Error();

      showToast("Task berhasil diupdate!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast("Gagal update task", "error");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">

    <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md border">

      <h2 className="font-bold text-2xl mb-6 text-gray-800">
        Edit Task
      </h2>

      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="datetime-local"
        value={form.deadline}
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        className="w-full border p-2 rounded mb-5"
      />

      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan
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