const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  // 🔐 LOGIN (FIXED untuk FastAPI OAuth2)
  login: async ({ email, password }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // ⚠️ FastAPI pakai "username"
      formData.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Login error:", err);
      return { error: "Login gagal" };
    }
  },

  // 📥 GET TASKS
  getTasks: async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Get tasks error:", err);
      return [];
    }
  },

  // ➕ CREATE TASK
  createTask: async (taskData, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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