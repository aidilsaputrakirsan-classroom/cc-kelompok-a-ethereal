const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 mt-auto transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Upper Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
          
          {/* Logo & short description (Left) */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              Kelarin
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Sistem manajemen tugas kolaboratif berbasis cloud.
            </p>
          </div>

          {/* Center (Empty for clean layout) */}
          <div className="hidden md:block"></div>

          {/* Developed By & Version (Right) */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex flex-col items-center md:items-end space-y-0.5">
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Developed By
              </h4>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Ethereal Team
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-550 tracking-wider">
              v0.4.0
            </span>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-100/60 dark:border-gray-900/60 mt-6 pt-6"></div>

        {/* Lower Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            &copy; {currentYear} Kelarin. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="#"
              className="text-[11px] text-gray-400 dark:text-gray-550 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-[11px] text-gray-400 dark:text-gray-550 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-[11px] text-gray-400 dark:text-gray-550 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;