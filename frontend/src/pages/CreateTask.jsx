import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTask = ({ token, showToast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
  setLoading(true);

  console.log("TOKEN CREATE:", token); // 🔥 DEBUG

  if (!token) {
    showToast("Token tidak ada, login ulang ya", "error");
    navigate("/");
    return;
  }

  try {
    let deadline = form.deadline;
    if (deadline.length === 16) {
      deadline += ":00";
    }

    const res = await fetch("http://localhost:8000/tasks", {
      method: "POST",
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Gagal create");
    }

    showToast("Task berhasil dibuat!", "success");
    navigate("/");
  } catch (err) {
    console.error(err);
    showToast(err.message || "Gagal membuat task", "error");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">

    <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md border">

      <h2 className="font-bold text-2xl mb-6 text-gray-800">
        Tambah Task
      </h2>

      <input
        placeholder="Judul"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        placeholder="Deskripsi"
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
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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

export default CreateTask;