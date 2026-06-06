const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Enhanced API client dengan response structure yang consistent
 * Semua responses return: { status, data, error }
 */
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

      const data = await res.json();

      // Handle 503 Service Unavailable
      if (res.status === 503) {
        return {
          status: 503,
          data: null,
          error: "Service temporarily unavailable",
          serviceUnavailable: true,
        };
      }

      if (!res.ok) {
        return {
          status: res.status,
          data: null,
          error: data.detail || "Login gagal",
        };
      }

      return {
        status: res.status,
        data,
        error: null,
      };
    } catch (err) {
      console.error("Login error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
      };
    }
  },

  getTasks: async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // Handle 503 Service Unavailable
      if (res.status === 503) {
        return {
          status: 503,
          data: null,
          error: "Task service temporarily unavailable",
          serviceUnavailable: true,
        };
      }

      if (!res.ok) {
        return {
          status: res.status,
          data: null,
          error: data.detail || "Gagal mengambil tasks",
        };
      }

      return {
        status: res.status,
        data,
        error: null,
      };
    } catch (err) {
      console.error("Get tasks error:", err);
      return {
        status: 0,
        data: [],
        error: err.message || "Network error",
        networkError: true,
      };
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

      const data = await res.json();

      // Handle 503 Service Unavailable
      if (res.status === 503) {
        return {
          status: 503,
          data: null,
          error: "Service temporarily unavailable",
          serviceUnavailable: true,
        };
      }

      if (!res.ok) {
        return {
          status: res.status,
          data: null,
          error: data.detail || "Gagal membuat task",
        };
      }

      return {
        status: res.status,
        data,
        error: null,
      };
    } catch (err) {
      console.error("Create task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
      };
    }
  },

  updateTask: async (taskId, taskData, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      // Handle 503 Service Unavailable
      if (res.status === 503) {
        return {
          status: 503,
          data: null,
          error: "Service temporarily unavailable",
          serviceUnavailable: true,
        };
      }

      if (!res.ok) {
        return {
          status: res.status,
          data: null,
          error: data.detail || "Gagal update task",
        };
      }

      return {
        status: res.status,
        data,
        error: null,
      };
    } catch (err) {
      console.error("Update task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
      };
    }
  },

  deleteTask: async (taskId, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle 503 Service Unavailable
      if (res.status === 503) {
        return {
          status: 503,
          data: null,
          error: "Service temporarily unavailable",
          serviceUnavailable: true,
        };
      }

      if (!res.ok) {
        const data = await res.json();
        return {
          status: res.status,
          data: null,
          error: data.detail || "Gagal hapus task",
        };
      }

      return {
        status: res.status,
        data: null,
        error: null,
      };
    } catch (err) {
      console.error("Delete task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
      };
    }
  },
};