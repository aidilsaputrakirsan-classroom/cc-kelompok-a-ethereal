export const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E75B6] dark:focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400"
    />
  </div>
);