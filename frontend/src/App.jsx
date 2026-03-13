import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import Filter from "./components/Filter"
import { fetchItems, createItem, updateItem, deleteItem, checkHealth } from "./services/api"

function App() {
  // ==================== STATE ====================
  const [items, setItems] = useState([])
  const [displayItems, setDisplayItems] = useState([])
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
      setDisplayItems(data.items)
      setTotalItems(data.total)

    } catch (err) {
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== ON MOUNT ====================
  useEffect(() => {
    checkHealth().then(setIsConnected)
    loadItems()
  }, [loadItems])

  // ==================== CRUD ====================

  const handleSubmit = async (itemData, editId) => {
    if (editId) {
      await updateItem(editId, itemData)
      setEditingItem(null)
    } else {
      await createItem(itemData)
    }

    loadItems(searchQuery)
  }

  const handleEdit = (item) => {
    setEditingItem(item)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)

    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return

    try {
      await deleteItem(id)
      loadItems(searchQuery)
    } catch (err) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  // ==================== SEARCH ====================

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== SORTING ====================

  const handleSort = (type) => {
    let sorted = [...displayItems]

    if (type === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (type === "price") {
      sorted.sort((a, b) => a.price - b.price)
    }

    if (type === "newest") {
      sorted.sort((a, b) => b.id - a.id)
    }

    setDisplayItems(sorted)
  }

  // ==================== CANCEL EDIT ====================

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  // ==================== RENDER ====================

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        <Header
          totalItems={totalItems}
          isConnected={isConnected}
        />

        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <SearchBar onSearch={handleSearch} />

        {/* SORTING DROPDOWN */}
        <Filter onSort={handleSort} />

        <ItemList
          items={displayItems}
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