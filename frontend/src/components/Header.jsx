import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
            Kelarin
          </span>
        </div>

        {/* Right Side */}
        <nav className="flex items-center gap-4">

          {/* Team */}
          <span className="text-sm text-gray-500 dark:text-gray-300 hidden sm:block italic">
            Ethereal Team Workspace
          </span>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          {/* Status Dashboard */}
          <Link
            to="/status"
            className="text-sm font-medium text-gray-700 dark:text-white hover:text-[#2E75B6] transition-colors"
          >
            📊 Status
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 rounded-lg border text-sm font-medium
            border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-white
            hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Logout
          </button>

        </nav>
      </div>
    </header>
  );
};

export default Header;