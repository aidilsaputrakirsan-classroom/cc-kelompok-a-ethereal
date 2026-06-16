import { useState, useEffect } from "react";

/**
 * Banner untuk menampilkan informasi ketika service tidak tersedia
 */
const ServiceStatusBanner = ({
  isVisible,
  message = "Some features are temporarily unavailable. We're working to restore them.",
  onRetry,
  serviceType = "auth", // 'auth' | 'task' | 'all'
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  if (!show) return null;

  const getMessageIcon = () => {
    switch (serviceType) {
      case "auth":
        return "🔐";
      case "task":
        return "📋";
      default:
        return "⚠️";
    }
  };

  const getBackgroundColor = () => {
    switch (serviceType) {
      case "auth":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "task":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
      default:
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    }
  };

  const getTextColor = () => {
    switch (serviceType) {
      case "auth":
        return "text-yellow-800 dark:text-yellow-200";
      case "task":
        return "text-orange-800 dark:text-orange-200";
      default:
        return "text-red-800 dark:text-red-200";
    }
  };

  const getButtonColor = () => {
    switch (serviceType) {
      case "auth":
        return "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600";
      case "task":
        return "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600";
      default:
        return "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600";
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 ${getBackgroundColor()} border-b border-l border-r`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">{getMessageIcon()}</span>

          <div>
            <p className={`${getTextColor()} font-medium text-sm sm:text-base`}>
              {message}
            </p>

            <p className={`${getTextColor()} text-xs opacity-75`}>
              {serviceType === "auth"
                ? "Authentication service is temporarily unavailable"
                : serviceType === "task"
                  ? "Task service is temporarily unavailable"
                  : "Service is temporarily unavailable"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className={`${getButtonColor()} text-white px-4 py-2 rounded text-sm font-medium transition-colors`}
            >
              Retry
            </button>
          )}

          <button
            onClick={() => setShow(false)}
            type="button"
            className={`${getTextColor()} hover:bg-opacity-10 px-3 py-2 rounded transition-colors`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusBanner;
