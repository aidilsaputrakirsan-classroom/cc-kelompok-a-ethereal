let API_URL = import.meta.env.VITE_API_URL;

// Task 1.2: Sanitize URL (hapus trailing slash)
if (API_URL && API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

if (!API_URL) {
  console.error(
    "%c[CRITICAL CONFIG ERROR]%c VITE_API_URL is not defined! \n" +
    "The frontend cannot communicate with the API Gateway. \n" +
    "Please set VITE_API_URL in your environment variables.",
    "color: white; background: red; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
    "color: red; font-weight: bold;"
  );
}

/**
 * Helper to get Authorization header (Task 1.8)
 */
const getAuthHeader = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Helper to handle fetch responses safely (Task 1.3)
 */
async function handleResponse(res, isAuthRequest = false) {
  const text = await res.text();
  let data = null;
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON response:", text);
      throw new Error("Invalid response format from server");
    }
  }

  // Task 1.8: Handle Unauthorized
  if (res.status === 401 || res.status === 403) {
    // Jika ini request login/register, biarkan error detail dari backend keluar
    // Jika bukan (misal fetch tasks), tampilkan "Session expired"
    if (isAuthRequest && data) {
      return {
        status: res.status,
        data: null,
        error: data.detail || data.message || "Authentication failed",
        ok: false
      };
    }

    return {
      status: res.status,
      data: null,
      error: "Session expired or unauthorized. Please login again.",
      unauthorized: true,
      ok: false
    };
  }

  if (res.status === 503) {
    return {
      status: 503,
      data: null,
      error: "Service temporarily unavailable",
      serviceUnavailable: true,
      ok: false
    };
  }

  if (!res.ok) {
    let errorMessage = "An error occurred";
    
    if (data) {
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } else {
      // Fallback to HTTP status texts
      switch (res.status) {
        case 404: errorMessage = "Resource not found"; break;
        case 500: errorMessage = "Internal server error"; break;
        case 502: errorMessage = "Bad gateway"; break;
        default: errorMessage = `Error: ${res.statusText || res.status}`;
      }
    }

    return {
      status: res.status,
      data: null,
      error: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
      ok: false
    };
  }

  return {
    status: res.status,
    data,
    error: null,
    ok: true
  };
}

/**
 * Enhanced API client dengan response structure yang consistent
 */
export const api = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        // Standard FastAPI OAuth2 keys
        body: JSON.stringify({ username: email, password }),
      });

      return await handleResponse(res, true);
    } catch (err) {
      console.error("Login error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  register: async ({ email, password, name }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      return await handleResponse(res, true);
    } catch (err) {
      console.error("Register error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  getTasks: async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          ...getAuthHeader(token),
        },
      });

      return await handleResponse(res);
    } catch (err) {
      console.error("Get tasks error:", err);
      return {
        status: 0,
        data: [],
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  getTask: async (taskId, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        headers: {
          ...getAuthHeader(token),
        },
      });

      return await handleResponse(res);
    } catch (err) {
      console.error("Get task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  createTask: async (taskData, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(token),
        },
        body: JSON.stringify(taskData),
      });

      return await handleResponse(res);
    } catch (err) {
      console.error("Create task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  updateTask: async (taskId, taskData, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(token),
        },
        body: JSON.stringify(taskData),
      });

      return await handleResponse(res);
    } catch (err) {
      console.error("Update task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  deleteTask: async (taskId, token) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(token),
        },
      });

      return await handleResponse(res);
    } catch (err) {
      console.error("Delete task error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  getSystemStatus: async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      return await handleResponse(res);
    } catch (err) {
      console.error("System status error:", err);
      return {
        status: 0,
        data: null,
        error: err.message || "Network error",
        networkError: true,
        ok: false
      };
    }
  },

  checkHealth: async () => {
    try {
      const res = await fetch(`${API_URL}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      return {
        status: res.status,
        ok: res.ok
      };
    } catch (err) {
      return {
        status: 0,
        ok: false
      };
    }
  }
};
