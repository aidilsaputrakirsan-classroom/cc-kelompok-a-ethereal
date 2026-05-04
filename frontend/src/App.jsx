import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import Toast from "./components/ui/Toast";
import AboutPage from "./pages/AboutPage";

function App() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  // 🔥 SYNC TOKEN DARI LOCAL STORAGE
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    showToast("Logout berhasil", "info");
  };

  if (!token) {
    return <LoginPage setToken={setToken} showToast={showToast} />;
  }

  return (
    <>
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              token={token}
              onLogout={handleLogout}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/create"
          element={
            <CreateTask token={token} showToast={showToast} />
          }
        />

        <Route
          path="/edit/:id"
          element={
            <EditTask token={token} showToast={showToast} />
          }
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />
      </Routes>
    </>
  );
}

export default App;