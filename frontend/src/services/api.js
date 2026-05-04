// ambil URL API dari env (kalau ga ada, pakai localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// kumpulan function API (biar gampang dipanggil dari frontend)
export const api = {

  // 🔐 LOGIN
  login: async ({ email, password }) => {
    try {
      // buat format data sesuai FastAPI (form, bukan JSON)
      const formData = new URLSearchParams();

      // FastAPI OAuth2 butuh "username", bukan "email"
      formData.append("username", email);

      // masukkan password
      formData.append("password", password);

      // kirim request login ke backend
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        // header khusus untuk form data
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        // body berisi email & password
        body: formData,
      });

      // ambil response dari server (biasanya berisi token)
      const data = await res.json();

      return data;

    } catch (err) {
      // kalau error (misal server mati / salah)
      console.error("Login error:", err);

      return { error: "Login gagal" };
    }
  },

  // 📥 AMBIL TASK
  getTasks: async (token) => {
    try {
      // request ke endpoint /tasks
      const res = await fetch(`${API_URL}/tasks`, {

        // kirim token ke backend (biar bisa akses)
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ambil data task dari server
      const data = await res.json();

      return data;

    } catch (err) {
      // kalau error
      console.error("Get tasks error:", err);

      return [];
    }
  },

  // ➕ BUAT TASK BARU
  createTask: async (taskData, token) => {
    try {
      // kirim request POST ke backend
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",

        headers: {
          // kirim data dalam bentuk JSON
          "Content-Type": "application/json",

          // kirim token biar diizinkan
          Authorization: `Bearer ${token}`,
        },

        // ubah data task jadi string JSON
        body: JSON.stringify(taskData),
      });

      // ambil response dari server
      const data = await res.json();

      return data;

    } catch (err) {
      // kalau gagal buat task
      console.error("Create task error:", err);

      return { error: "Gagal membuat task" };
    }
  },
};