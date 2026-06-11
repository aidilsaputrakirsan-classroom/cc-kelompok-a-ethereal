import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function ServiceCard({
  name,
  icon,
  healthUrl,
  metricsUrl,
}) {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const healthRes = await fetch(healthUrl);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      } else {
        setHealth({ status: "unhealthy" });
      }
    } catch {
      setHealth({ status: "unreachable" });
    }

    if (metricsUrl) {
      try {
        const metricsRes = await fetch(metricsUrl);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch {
        setMetrics(null);
      }
    }

    setLoading(false);
  }, [healthUrl, metricsUrl]);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(
      fetchStatus,
      10000
    );

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const status = health?.status || "unreachable";

  const statusConfig = {
    healthy: {
      label: "Healthy",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    degraded: {
      label: "Degraded",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    unhealthy: {
      label: "Unhealthy",
      color:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    unreachable: {
      label: "Unreachable",
      color:
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
          {icon} {name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusConfig[status]?.color
          }`}
        >
          {loading
            ? "Checking..."
            : statusConfig[status]?.label}
        </span>
      </div>

      {metrics ? (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Requests
            </p>
            <p className="font-bold text-lg text-gray-900 dark:text-white">
              {metrics.total_requests ?? 0}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Errors
            </p>
            <p className="font-bold text-lg text-red-500">
              {metrics.total_errors ?? 0}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Error Rate
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {metrics.error_rate_percent ?? 0}%
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Avg Latency
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {metrics.latency?.avg_ms ?? 0} ms
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              P95 Latency
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {metrics.latency?.p95_ms ?? 0} ms
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Uptime
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {Math.round(
                (metrics.uptime_seconds || 0) / 60
              )} min
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Metrics unavailable
        </p>
      )}
    </div>
  );
}

export default function StatusPage() {
  const navigate = useNavigate();

  const [lastChecked, setLastChecked] =
    useState("");

  useEffect(() => {
    const updateTime = () => {
      setLastChecked(
        new Date().toLocaleTimeString()
      );
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      />

      <main className="flex-grow max-w-6xl w-full mx-auto py-8 px-4">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Kelarin Service Dashboard
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Monitoring kesehatan layanan Kelarin secara real-time.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-[#2E75B6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            System Overview
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dashboard ini digunakan untuk memantau kondisi
            Authentication Service, Task Service, dan API
            Gateway pada aplikasi Kelarin.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <ServiceCard
            name="Authentication Service"
            icon="🔐"
            healthUrl={`${API_URL}/auth/health`}
            metricsUrl={`${API_URL}/auth/metrics`}
          />

          <ServiceCard
            name="Task Service"
            icon="📋"
            healthUrl={`${API_URL}/items/health`}
            metricsUrl={`${API_URL}/items/metrics`}
          />

          <ServiceCard
            name="API Gateway"
            icon="🚪"
            healthUrl={`${API_URL}/health`}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Last Updated: {lastChecked}
          <br />
          Auto-refresh setiap 10 detik
        </div>

      </main>

      <Footer />
    </div>
  );
}