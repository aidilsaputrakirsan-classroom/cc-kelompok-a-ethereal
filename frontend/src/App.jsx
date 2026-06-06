import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import Toast from "./components/ui/Toast";
import AboutPage from "./pages/AboutPage";
import ServiceStatusBanner from "./components/ServiceStatusBanner";

function App() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAuthServiceDown, setIsAuthServiceDown] =
    useState(false);

  // 🔥 SYNC TOKEN DARI LOCAL STORAGE
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 🔥 CHECK AUTH SERVICE HEALTH PERIODICALLY
  useEffect(() => {
    const checkAuthServiceHealth = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL ||
          "http://localhost:8000";

        // Try to call a simple endpoint to check service
        const res = await fetch(`${API_URL}/health`, {
          signal: AbortSignal.timeout(5000),
        });

        if (res.status === 503) {
          setIsAuthServiceDown(true);
        } else {
          setIsAuthServiceDown(false);
        }
      } catch (err) {
        // If health check fails, assume service might be down
        setIsAuthServiceDown(true);
      }
    };

    // Check on mount
    checkAuthServiceHealth();

    // Check every 30 seconds when user is logged in
    let interval;
    if (token) {
      interval = setInterval(() => {
        checkAuthServiceHealth();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]);

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
      {/* Global Auth Service Status Banner */}
      <ServiceStatusBanner
        isVisible={isAuthServiceDown}
        message="Authentication service is temporarily unavailable. Some features may be limited."
        serviceType="auth"
      />

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