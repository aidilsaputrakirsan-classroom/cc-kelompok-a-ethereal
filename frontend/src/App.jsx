import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, getToken, clearToken, getMe
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  // Langsung cek localStorage saat aplikasi pertama kali dimuat
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const [user, setUser] = useState(null)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Check Health Backend
  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  // Re-sync User & Items saat refresh
  useEffect(() => {
    if (isAuthenticated) {
      // 1. Ambil data user profil jika belum ada (berguna saat refresh)
      if (!user) {
        getMe()
          .then(data => setUser(data.user || data))
          .catch(() => handleLogout())
      }
      // 2. Load data items
      loadItems(searchQuery)
    }
  }, [isAuthenticated, loadItems, user, searchQuery])

  // ==================== AUTH HANDLERS ====================

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password)
      // data.user dipastikan sesuai dengan payload response backend kamu
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (err) {
      alert("Login Gagal: " + err.message)
    }
  }

const handleRegister = async (userData) => {
    try {
      setLoading(true)
      await register(userData)
      // Setelah register berhasil, panggil handleLogin
      await handleLogin(userData.email, userData.password)
    } catch (err) {
      alert("Registrasi gagal: " + err.message)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
  }

  // ==================== ITEM HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
      } else {
        await createItem(itemData)
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else alert("Gagal menyimpan: " + err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else alert("Gagal menghapus: " + err.message)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== RENDER ====================

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />
        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />
        <SearchBar onSearch={handleSearch} />
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: { maxWidth: "900px", margin: "0 auto" },
}

export default App