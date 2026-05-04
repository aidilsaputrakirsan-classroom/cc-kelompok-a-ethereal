const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {

  login: async ({ email, password }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      return await res.json();
    } catch (err) {
      console.error("Login error:", err);
      return { error: "Login gagal" };
    }
  },

  getTasks: async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.error("Get tasks error:", err);
      return [];
    }
  },

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

      return await res.json();
    } catch (err) {
      console.error("Create task error:", err);
      return { error: "Gagal membuat task" };
    }
  },
};