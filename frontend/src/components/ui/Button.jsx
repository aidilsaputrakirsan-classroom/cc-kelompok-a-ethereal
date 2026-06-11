// src/components/ui/Button.jsx
export const Button = ({ children, variant = "primary", ...props }) => {
  const baseStyles = "w-full font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#2E75B6] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
    link: "text-[#2E75B6] dark:text-blue-400 hover:underline dark:hover:text-blue-300 shadow-none bg-transparent mt-0",
    danger: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant] || variants.primary}`}
    >
      {children}
    </button>
  );
};