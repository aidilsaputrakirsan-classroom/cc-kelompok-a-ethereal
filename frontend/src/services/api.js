const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ==================== TOKEN MANAGEMENT ====================

/**
 * Menggunakan localStorage agar token tetap ada meski browser di-refresh.
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem("authToken", token)
  }
}

export function getToken() {
  return localStorage.getItem("authToken")
}

export function clearToken() {
  localStorage.removeItem("authToken")
}

/**
 * Helper untuk membuat headers yang menyertakan Token dan Content-Type
 */
function authHeaders(includeJson = false) {
  const token = getToken()
  const headers = {}
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  if (includeJson) {
    headers["Content-Type"] = "application/json"
  }
  
  return headers
}

// Helper: Menangani error response secara terpusat
async function handleResponse(response) {
  if (response.status === 401) {
    clearToken() // Hapus token yang sudah tidak valid
    throw new Error("UNAUTHORIZED") // Ditangkap oleh App.jsx untuk redirect ke Login
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Request gagal (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}

// ==================== AUTH API ====================

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleResponse(response)
  
  // DEBUG: Lihat di console (F12) apa isi data ini saat kamu register/login
  console.log("Response Login:", data)

  // Ambil token dari kemungkinan nama field yang dikirim backend
  const token = data.access_token || data.token || data.accessToken
  
  if (token) {
    setToken(token)
  } else {
    console.error("Token tidak ditemukan di response backend!")
  }
  
  return data
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// ==================== ITEMS API ====================

export async function fetchItems(search = "", skip = 0, limit = 20) {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  params.append("skip", skip)
  params.append("limit", limit)

  const response = await fetch(`${API_URL}/items?${params}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function createItem(itemData) {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: authHeaders(true), // true karena mengirim JSON
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function updateItem(id, itemData) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: authHeaders(true), // true karena mengirim JSON
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// ==================== HEALTH ====================

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    return data.status === "healthy"
  } catch {
    return false
  }
}