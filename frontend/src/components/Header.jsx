import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

const Header = ({ onLogout, darkMode, onDarkModeChange }) => {
  const toggleDarkMode = () => {
    onDarkModeChange(!darkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
            Kelarin
          </span>
        </Link>

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
          <div className="w-auto">
            <Button
              onClick={toggleDarkMode}
              variant="secondary"
              className="px-3 py-1.5 mt-0 text-sm h-9"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </Button>
          </div>

          {/* Logout */}
          <div className="w-auto">
            <Button
              onClick={onLogout}
              variant="link"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-9"
            >
              Logout
            </Button>
          </div>

        </nav>
      </div>
    </header>
  );
};

export default Header;