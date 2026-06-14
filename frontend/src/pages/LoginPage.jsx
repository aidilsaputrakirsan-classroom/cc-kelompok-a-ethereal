import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";
import ServiceStatusBanner from "../components/ServiceStatusBanner";

const LoginPage = ({ setToken, showToast }) => {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] =
    useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ================= VALIDATION (Task 1.7) =================
    const email = formData.email.trim().toLowerCase(); // NORMALISASI EMAIL
    const password = formData.password; // JANGAN TRIM PASSWORD
    const name = formData.name.trim();

    if (!email || !password || (isRegister && !name)) {
      showToast("Semua field harus diisi", "error");
      return;
    }

    setLoading(true);
    setServiceUnavailable(false);

    try {
      let result;

      // ================= REGISTER =================
      if (isRegister) {
        result = await api.register({ email, name, password });
      } 
      // ================= LOGIN =================
      else {
        result = await api.login({ email, password });
      }

      // ================= HANDLE RESULT =================
      if (result.serviceUnavailable || result.status === 503) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
        return;
      }

      if (!result.ok) {
        throw new Error(result.error || "Authentication failed");
      }

      // ================= REGISTER SUCCESS =================
      if (isRegister) {
        showToast(
          "Registrasi berhasil! Silakan login.",
          "success"
        );
        setIsRegister(false);
        setFormData({
          email: "",
          name: "",
          password: "",
        });
      }
      // ================= LOGIN SUCCESS =================
      else {
  const token = result.data.access_token;

  if (!token) {
    throw new Error("Token tidak ditemukan dari backend");
  }

  // Simpan token
  localStorage.setItem("token", token);

  // Simpan email user untuk greeting
  localStorage.setItem("userEmail", email);

  setToken(token);

  showToast("Login berhasil!", "success");
}
    } catch (err) {
      console.error("Auth error:", err);

      const errorMsg = err.message || "Terjadi kesalahan";

      if (
        errorMsg.includes("Failed to fetch") ||
        errorMsg.includes("Service error")
      ) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
      } else {
        showToast(errorMsg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryAttempt((prev) => prev + 1);
    setServiceUnavailable(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Service Status Banner */}
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Authentication service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="auth"
      />

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">

        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Kelarin 📋
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
            {isRegister
              ? "Create your student account"
              : "Welcome back!"}
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <Input
              label="Full Name"
              placeholder="Nama Lengkap"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              disabled={loading}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="email@gmail.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            disabled={loading}
          />

          <Button type="submit" disabled={loading}>
            {loading
              ? "Processing..."
              : isRegister
              ? "Sign Up"
              : "Log In"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors duration-300">
          <Button
            variant="link"
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            disabled={loading}
          >
            {isRegister
              ? "Sudah punya akun? Login"
              : "Belum punya akun? Register"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;