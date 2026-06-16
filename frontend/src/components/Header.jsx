import { Link } from "react-router-dom";

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const Header = ({
  token,
  onLogout,
  darkMode,
  onDarkModeChange,
}) => {
  const toggleDarkMode = () => {
    onDarkModeChange(!darkMode);
  };

  const decoded = getUserFromToken(token);
  const isAdmin = decoded && decoded.role === "admin";

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: App Logo/Name */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="font-bold text-xl text-gray-950 dark:text-white tracking-tight hover:opacity-80 transition-opacity"
          >
            Kelarin
          </Link>
        </div>

        {/* Center Section: Left empty for clean alignment & dynamic workspaces in future */}
        <div className="hidden md:flex flex-1 justify-center"></div>

        {/* Right Side: Navigation Links & Theme Toggle */}
        <div className="flex-1 flex justify-end">
          <nav className="flex items-center gap-6">
            
            {/* Status Link - Admin Only */}
            {token && isAdmin && (
              <Link
                to="/status"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors"
              >
                Status
              </Link>
            )}

            {/* Admin Panel Link */}
            {token && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Admin Panel
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              type="button"
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* Logout Button */}
            {token && (
              <button
                onClick={onLogout}
                type="button"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}

          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;