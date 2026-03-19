import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import Toast from "./components/Toast"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, getToken, clearToken, getMe
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const [user, setUser] = useState(null)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== NOTIFICATION ====================
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
  }

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
      } else {
        showNotification("Gagal mengambil data", "error")
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== EFFECT ====================

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (!user) {
        getMe()
          .then(data => setUser(data.user || data))
          .catch(() => handleLogout())
      }
      loadItems(searchQuery)
    }
  }, [isAuthenticated, loadItems, user, searchQuery])

  // ==================== AUTH ====================

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password)
      setUser(data.user)
      setIsAuthenticated(true)
      showNotification("Login berhasil 🎉")
    } catch (err) {
      showNotification("Login gagal: " + err.message, "error")
    }
  }

  const handleRegister = async (userData) => {
    try {
      setLoading(true)
      await register(userData)
      await handleLogin(userData.email, userData.password)
      showNotification("Registrasi berhasil 🎉")
    } catch (err) {
      showNotification("Registrasi gagal: " + err.message, "error")
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
    showNotification("Logout berhasil")
  }

  // ==================== ITEM ====================

  const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
        showNotification("Item berhasil diupdate")
      } else {
        await createItem(itemData)
        showNotification("Item berhasil ditambahkan")
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification("Gagal menyimpan: " + err.message, "error")
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
      showNotification("Item berhasil dihapus")
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification("Gagal menghapus: " + err.message, "error")
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== RENDER ====================

  if (!isAuthenticated) {
    return (
      <>
        <Toast
          message={notification?.message}
          type={notification?.type}
          onClose={() => setNotification(null)}
        />
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
      </>
    )
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        <Toast
          message={notification?.message}
          type={notification?.type}
          onClose={() => setNotification(null)}
        />

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
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
}

export default App