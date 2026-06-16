import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import Toast from "./components/ui/Toast";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ServiceStatusBanner from "./components/ServiceStatusBanner";
import { api } from "./services/api";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAuthServiceDown, setIsAuthServiceDown] =
    useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
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
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // 🔥 CHECK AUTH SERVICE HEALTH PERIODICALLY
  useEffect(() => {
    const checkAuthServiceHealth = async () => {
      const result = await api.checkHealth();
      if (result.status === 503 || !result.ok) {
        setIsAuthServiceDown(true);
      } else {
        setIsAuthServiceDown(false);
      }
    };

    checkAuthServiceHealth();
    let interval;
    if (token) {
      interval = setInterval(checkAuthServiceHealth, 30000);
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
  localStorage.removeItem("userEmail");

  showToast("Logout berhasil", "info");
  navigate("/");
};

  // 🔥 CONFIGURATION CHECK
  if (!import.meta.env.VITE_API_URL) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-red-200 dark:border-red-900/30 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Configuration Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The environment variable <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-red-500 font-mono text-sm">VITE_API_URL</code> is missing.
          </p>
        </div>
      </div>
    );
  }

  const isPublicRoute = ["/status", "/about"].includes(window.location.pathname);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <ServiceStatusBanner
        isVisible={isAuthServiceDown}
        message="Authentication service is temporarily unavailable."
        serviceType="auth"
      />

      <Header
        token={token}
        onLogout={handleLogout}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="flex-grow flex flex-col">
        {!token && !isPublicRoute ? (
          <LoginPage setToken={setToken} showToast={showToast} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage token={token} onLogout={handleLogout} showToast={showToast} />} />
            <Route path="/create" element={<CreateTask token={token} showToast={showToast} />} />
            <Route path="/edit/:id" element={<EditTask token={token} showToast={showToast} />} />
            <Route path="/admin" element={<AdminPage token={token} showToast={showToast} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
