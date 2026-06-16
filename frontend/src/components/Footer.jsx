const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xl">📋</span>
              <span className="font-bold text-gray-800 dark:text-white text-lg">
                Kelarin
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-300">
              Sistem manajemen tugas berbasis cloud untuk kolaborasi mahasiswa
              yang lebih efisien.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Developed By
            </h4>

            <span className="text-sm font-medium text-[#2E75B6] bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
              ETHEREAL TEAM
            </span>
          </div>

          <div className="md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Project Status
            </h4>

            <div className="flex items-center justify-center md:justify-end gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                v0.4.0 - Healthy
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Kelarin Cloud App. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#2E75B6] dark:hover:text-blue-400 transition-colors">
              Documentation
            </a>

            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#2E75B6] dark:hover:text-blue-400 transition-colors">
              GitHub
            </a>

            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#2E75B6] dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;