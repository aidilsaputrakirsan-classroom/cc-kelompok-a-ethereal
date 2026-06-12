import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function ServiceCard({
  name,
  icon,
  status,
  loading
}) {
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

  const currentStatus = status || "unreachable";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
          {icon} {name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusConfig[currentStatus]?.color
          }`}
        >
          {loading
            ? "Checking..."
            : statusConfig[currentStatus]?.label}
        </span>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Service is currently {currentStatus}.
        </div>
        <div className="text-xs text-gray-400 italic">
          Checked via API Gateway
        </div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState({
    gateway: null,
    auth: null,
    tasks: null
  });
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState("");

  const fetchAllStatuses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      if (res.ok) {
        const data = await res.json();
        setStatuses({
          gateway: data.gateway?.status,
          auth: data.auth?.status,
          tasks: data.tasks?.status
        });
      } else {
        throw new Error("Failed to fetch status");
      }
    } catch (err) {
      console.error("Error fetching system status:", err);
      setStatuses({
        gateway: "unreachable",
        auth: "unreachable",
        tasks: "unreachable"
      });
    } finally {
      setLoading(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    fetchAllStatuses();
    const interval = setInterval(fetchAllStatuses, 10000);
    return () => clearInterval(interval);
  }, [fetchAllStatuses]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <main className="flex-grow max-w-6xl w-full mx-auto py-8 px-4">

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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            System Overview
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dashboard ini digunakan untuk memantau kondisi
            Authentication Service, Task Service, dan API
            Gateway pada aplikasi Kelarin melalui satu endpoint terpusat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard
            name="API Gateway"
            icon="🚪"
            status={statuses.gateway}
            loading={loading}
          />

          <ServiceCard
            name="Authentication Service"
            icon="🔐"
            status={statuses.auth}
            loading={loading}
          />

          <ServiceCard
            name="Task Service"
            icon="📋"
            status={statuses.tasks}
            loading={loading}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Live Monitoring Active
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last Checked: {lastChecked}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Auto-refresh every 10 seconds
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
