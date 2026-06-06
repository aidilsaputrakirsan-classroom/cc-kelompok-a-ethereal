import { useState, useCallback } from "react";

/**
 * Custom hook untuk menangani API calls dengan retry logic
 * Handles 503 Service Unavailable dengan automatic retry
 */
export const useApi = (showToast) => {
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Melakukan fetch dengan retry logic untuk 503 errors
   * @param {string} url - API endpoint
   * @param {object} options - fetch options
   * @param {number} maxRetries - maksimal retry attempts (default: 3)
   * @returns {Promise<{success: boolean, data?: any, status?: number, error?: string}>}
   */
  const fetchWithRetry = useCallback(
    async (url, options = {}, maxRetries = 3) => {
      let lastError = null;
      let lastStatus = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 1) {
            setRetrying(true);
            // Wait sebelum retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt - 2) * 1000)
            );
          }

          const res = await fetch(url, options);
          lastStatus = res.status;

          // Handle 503 Service Unavailable - retry
          if (res.status === 503) {
            lastError = "Service temporarily unavailable";

            if (attempt === maxRetries) {
              // Last attempt failed
              setError("Service unavailable - please try again later");
              if (showToast) {
                showToast(
                  `Service unavailable (attempt ${attempt}/${maxRetries})`,
                  "error"
                );
              }
            } else {
              if (showToast) {
                showToast(
                  `Service unavailable, retrying... (${attempt}/${maxRetries})`,
                  "warning"
                );
              }
            }

            continue;
          }

          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail || data)
            );
          }

          setError(null);
          setRetrying(false);

          return {
            success: true,
            data,
            status: res.status,
          };
        } catch (err) {
          lastError = err.message;

          if (attempt === maxRetries) {
            setError(lastError);
            setRetrying(false);

            if (showToast) {
              showToast(`Error: ${lastError}`, "error");
            }

            return {
              success: false,
              error: lastError,
              status: lastStatus,
            };
          }
        }
      }
    },
    [showToast]
  );

  return {
    fetchWithRetry,
    loading,
    retrying,
    error,
    setError,
    setLoading,
  };
};

/**
 * Hook untuk tracking auth service status
 * Berguna untuk menampilkan banner jika auth service down
 */
export const useAuthServiceStatus = () => {
  const [isAuthServiceDown, setIsAuthServiceDown] = useState(false);

  const checkAuthService = useCallback(async (apiUrl) => {
    try {
      const res = await fetch(`${apiUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (res.status === 503) {
        setIsAuthServiceDown(true);
      } else {
        setIsAuthServiceDown(false);
      }
    } catch (err) {
      // If health check fails, assume service is down
      setIsAuthServiceDown(true);
    }
  }, []);

  return {
    isAuthServiceDown,
    checkAuthService,
  };
};
