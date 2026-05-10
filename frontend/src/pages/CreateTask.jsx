import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTask = ({ token, showToast }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    attachment_url: "", // pakai backend field asli
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const savedToken = localStorage.getItem("token");

      const payload = {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        attachment_url: form.attachment_url, // sinkron dengan backend
      };

      console.log("TOKEN CREATE:", savedToken);
      console.log("FORM DATA:", payload);

      const response = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("RESPONSE:", data);

      if (!response.ok) {
        throw new Error(JSON.stringify(data.detail));
      }

      showToast("Task berhasil dibuat!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Terjadi kesalahan", "error");
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

        {/* Judul */}
        <input
          placeholder="Judul"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          className="w-full border p-3 rounded mb-3"
        />

        {/* Deskripsi */}
        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full border p-3 rounded mb-3"
          rows="4"
        />

        {/* Link Referensi */}
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
          className="w-full border p-3 rounded mb-3"
        />

        {/* Deadline */}
        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline: e.target.value,
            })
          }
          className="w-full border p-3 rounded mb-5"
        />

        <div className="flex gap-3">
          {/* Simpan */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>

          {/* Batal */}
          <button
            onClick={() => navigate("/")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;