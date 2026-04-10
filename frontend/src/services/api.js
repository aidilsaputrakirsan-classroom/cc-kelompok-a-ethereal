// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  // Mengambil daftar tugas mahasiswa sesuai tabel 'tasks' di ERD Kelarin
  getTasks: async (token) => {
    const res = await fetch(`${API_URL}/items`, { // Endpoint /items sesuai Modul 2
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) return { error: "Unauthorized" };
    return res.json();
  },

  createTask: async (taskData, token) => {
    const res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    return res.json();
  }
};