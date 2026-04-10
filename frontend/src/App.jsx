// src/App.jsx
import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import TaskList from "./components/TaskList"; // Komponen baru
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Jika token tidak ada, hanya tampilkan halaman login [7]
  if (!token) {
    return <LoginPage setToken={(t) => {
      setToken(t);
      localStorage.setItem("token", t); // Simpan token di browser [7]
    }} />;
  }

  return (
    <div className="app">
      <Header onLogout={() => {
        setToken(null);
        localStorage.removeItem("token");
      }} />
      <main>
        {/* TaskList hanya bisa diakses jika sudah login [7] */}
        <TaskList token={token} />
      </main>
    </div>
  );
}

export default App;
