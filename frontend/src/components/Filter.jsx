import { useState } from "react";

function Filter({ onSort }) {
  const [sortBy, setSortBy] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Urutkan:</label>

      <select value={sortBy} onChange={handleChange} style={styles.select}>
        <option value="">-- Pilih --</option>
        <option value="title">Judul</option>
        <option value="deadline">Deadline</option>
        <option value="status">Status</option>
      </select>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  label: { fontWeight: "bold" },
  select: { padding: "0.4rem" },
};

export default Filter;