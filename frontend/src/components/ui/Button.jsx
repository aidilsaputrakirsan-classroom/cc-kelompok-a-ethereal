// src/components/ui/Button.jsx
export const Button = ({ 
  children, 
  variant = "primary", 
  type = "button", 
  className = "",
  ...props 
}) => {
  const baseStyles = "w-full font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#2E75B6] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white",
    success: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white",
    link: "text-[#2E75B6] dark:text-blue-400 hover:underline dark:hover:text-blue-300 shadow-none bg-transparent mt-0 py-1 w-auto inline-flex"
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      {...props}
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};
