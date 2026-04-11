import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-[#2E75B6] text-white",
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-in">
      <div className={`${styles[type]} px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <span className="text-xl">
          {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>
        <p className="font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="ml-auto hover:opacity-70 transition-opacity text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;