import { useState } from "react"

function Filter({ onSort }) {
  const [sortBy, setSortBy] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    onSort(value)
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>Urutkan berdasarkan:</label>

      <select value={sortBy} onChange={handleChange} style={styles.select}>
        <option value="">-- Pilih --</option>
        <option value="name">Nama</option>
        <option value="price">Harga</option>
        <option value="newest">Terbaru</option>
      </select>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  label: {
    fontWeight: "bold",
    color: "#1F4E79",
  },
  select: {
    padding: "0.4rem 0.6rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
  },
}

export default Filter