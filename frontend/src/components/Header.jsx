import { Button } from "./ui/Button";

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-xl text-gray-800 tracking-tight">Kelarin</span>
        </div>
        
        <nav className="flex items-center gap-6">
          <span className="text-sm text-gray-500 hidden sm:block italic">
            Ethereal Team Workspace
          </span>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
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