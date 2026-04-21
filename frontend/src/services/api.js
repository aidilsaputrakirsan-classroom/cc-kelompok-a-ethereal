const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = { // agar bisa dipanggil di file lain
  // 🔐 LOGIN (FIXED untuk FastAPI OAuth2) / untuk nerima email & password
  login: async ({ email, password }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // ⚠️ FastAPI pakai "username"
      formData.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST", //kirim data ke backend
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      //hasil dari backend dikembalikan ke frontend
      const data = await res.json();
      return data;
    } catch (err) {
      //login gagal = kasih pesan error
      console.error("Login error:", err);
      return { error: "Login gagal" };
    }
  },

  // 📥 GET TASKS (ambil semua task dari backend)
  getTasks: async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //backend kirim array tasks
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Get tasks error:", err);
      return [];
    }
  },

  // ➕ CREATE TASK
  createTask: async (taskData, token) => { //kirim data task baru ke backend
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST", //POST = create data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,//semua endpoint protected butuh ini untuk memberitahu backend bahwa user sudah login
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Create task error:", err);
      return { error: "Gagal membuat task" };
    }
  },
};