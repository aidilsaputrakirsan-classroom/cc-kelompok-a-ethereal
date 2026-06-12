import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import StatusPage from "./pages/StatusPage";
import Toast from "./components/ui/Toast";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import ServiceStatusBanner from "./components/ServiceStatusBanner";

function App() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAuthServiceDown, setIsAuthServiceDown] =
    useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage with proper null handling
    try {
      const saved = localStorage.getItem("darkMode");
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // 🔥 SYNC TOKEN DARI LOCAL STORAGE
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 🔥 MANAGE DARK MODE
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 🔥 CHECK AUTH SERVICE HEALTH PERIODICALLY
  useEffect(() => {
    const checkAuthServiceHealth = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL ||
          "http://localhost:8000";

        const res = await fetch(
          `${API_URL}/health`,
          {
            signal: AbortSignal.timeout(5000),
          }
        );

        if (res.status === 503) {
          setIsAuthServiceDown(true);
        } else {
          setIsAuthServiceDown(false);
        }
      } catch (err) {
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

  const showToast = (
    message,
    type = "success"
  ) => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    showToast("Logout berhasil", "info");
  };

  // 🔥 Allow access to /status without token
  if (window.location.pathname === '/status') {
    return <StatusPage />;
  }

  if (!token) {
    return (
      <LoginPage
        setToken={setToken}
        showToast={showToast}
      />
    );
  }

  return (
    <>
      {/* Global Auth Service Status Banner */}
      <ServiceStatusBanner
        isVisible={isAuthServiceDown}
        message="Authentication service is temporarily unavailable. Some features may be limited."
        serviceType="auth"
      />

      {/* Header with Dark Mode Toggle */}
      <Header 
        onLogout={handleLogout}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification(null)
          }
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
            <CreateTask
              token={token}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/edit/:id"
          element={
            <EditTask
              token={token}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        {/* Workshop 14.4 */}
        <Route
          path="/status"
          element={<StatusPage />}
        />
      </Routes>
    </>
  );
}

export default App;