let API_URL = import.meta.env.VITE_API_URL;

// ================= URL SANITIZER =================
if (API_URL && API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

if (!API_URL) {
  console.error(
    "[CRITICAL CONFIG ERROR] VITE_API_URL is not defined!"
  );
}

// ================= AUTH HEADER =================
const getAuthHeader = (token) => {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// ================= RESPONSE HANDLER =================
async function handleResponse(res, isAuthRequest = false) {
  const text = await res.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid response format from server");
    }
  }

  // ================= AUTH ERROR =================
  if (res.status === 401 || res.status === 403) {
    if (isAuthRequest) {
      return {
        status: res.status,
        data: null,
        error:
          data?.detail ||
          data?.message ||
          "Authentication failed",
        ok: false,
      };
    }

    return {
      status: res.status,
      data: null,
      error:
        "Session expired or unauthorized. Please login again.",
      unauthorized: true,
      ok: false,
    };
  }

  // ================= SERVICE DOWN =================
  if (res.status === 503) {
    return {
      status: 503,
      data: null,
      error: "Service temporarily unavailable",
      serviceUnavailable: true,
      ok: false,
    };
  }

  // ================= OTHER ERRORS =================
  if (!res.ok) {
    let errorMessage = "An error occurred";

    if (data) {
      errorMessage =
        data.detail ||
        data.message ||
        data.error ||
        errorMessage;
    } else {
      switch (res.status) {
        case 404:
          errorMessage = "Resource not found";
          break;

        case 500:
          errorMessage = "Internal server error";
          break;

        case 502:
          errorMessage = "Bad gateway";
          break;

        default:
          errorMessage =
            res.statusText || `Error ${res.status}`;
      }
    }

    return {
      status: res.status,
      data: null,
      error:
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage),
      ok: false,
    };
  }

  return {
    status: res.status,
    data,
    error: null,
    ok: true,
  };
}

// ================= API CLIENT =================

export const api = {
  // ==========================================
  // LOGIN
  // ==========================================
  login: async ({ email, password }) => {
    try {
      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      return await handleResponse(res, true);
    } catch (err) {
      console.error("Login error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // REGISTER
  // ==========================================
  register: async ({
    email,
    password,
    name,
  }) => {
    try {
      const res = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        }
      );

      return await handleResponse(res, true);
    } catch (err) {
      console.error("Register error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // GET TASKS
  // ==========================================
  getTasks: async (token) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks`,
        {
          headers: {
            ...getAuthHeader(token),
          },
        }
      );

      return await handleResponse(res);
    } catch (err) {
      console.error("Get tasks error:", err);

      return {
        status: 0,
        data: [],
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // GET SINGLE TASK
  // ==========================================
  getTask: async (taskId, token) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          headers: {
            ...getAuthHeader(token),
          },
        }
      );

      return await handleResponse(res);
    } catch (err) {
      console.error("Get task error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // CREATE TASK
  // ==========================================
  createTask: async (
    taskData,
    token
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            ...getAuthHeader(token),
          },
          body: JSON.stringify(taskData),
        }
      );

      return await handleResponse(res);
    } catch (err) {
      console.error("Create task error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // UPDATE TASK
  // ==========================================
  updateTask: async (
    taskId,
    taskData,
    token
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            ...getAuthHeader(token),
          },
          body: JSON.stringify(taskData),
        }
      );

      return await handleResponse(res);
    } catch (err) {
      console.error("Update task error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // DELETE TASK
  // ==========================================
  deleteTask: async (
    taskId,
    token
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeader(token),
          },
        }
      );

      return await handleResponse(res);
    } catch (err) {
      console.error("Delete task error:", err);

      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

// ==========================================
// SYSTEM STATUS
// ==========================================
getSystemStatus: async () => {
  try {
    const res = await fetch(
      `${API_URL}/system/status`
    );

    return await handleResponse(res);
  } catch (err) {
    console.error("System status error:", err);

    return {
      status: 0,
      data: null,
      error: err.message || "Network error",
      networkError: true,
      ok: false,
    };
  }
},

// ==========================================
// HEALTH CHECK
// ==========================================
checkHealth: async () => {
  try {
    const res = await fetch(
      `${API_URL}/health`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    return {
      status: res.status,
      ok: res.ok,
    };
  } catch {
    return {
      status: 0,
      ok: false,
    };
  }
},

  // ==========================================
  // GET USERS (Admin)
  // ==========================================
  getUsers: async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: {
          ...getAuthHeader(token),
        },
      });
      return await handleResponse(res);
    } catch (err) {
      console.error("Get users error:", err);
      return {
        status: 0,
        data: [],
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // UPDATE USER BY ADMIN (Admin)
  // ==========================================
  updateUserByAdmin: async (userId, updateData, token) => {
    try {
      const res = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(token),
        },
        body: JSON.stringify(updateData),
      });
      return await handleResponse(res);
    } catch (err) {
      console.error("Update user by admin error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },

  // ==========================================
  // DELETE USER BY ADMIN (Admin)
  // ==========================================
  deleteUserByAdmin: async (userId, token) => {
    try {
      const res = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(token),
        },
      });
      return await handleResponse(res);
    } catch (err) {
      console.error("Delete user by admin error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false,
      };
    }
  },
};