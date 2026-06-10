import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";
import ServiceStatusBanner from "../components/ServiceStatusBanner";

const API_URL = import.meta.env.VITE_API_URL;

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
    setLoading(true);
    setServiceUnavailable(false);

    try {
      let response;

      // ================= REGISTER =================
      if (isRegister) {
        response = await fetch(
          `${API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              name: formData.name,
              password: formData.password,
            }),
          }
        );
      }

      // ================= LOGIN =================
else {
  const formData2 = new URLSearchParams();
  formData2.append("username", formData.email); // key "username", isi email
  formData2.append("password", formData.password);

  response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData2,
  });
}

      // ================= SERVICE DOWN =================
      if (response.status === 503) {
        setServiceUnavailable(true);
        showToast(
          "Service temporarily unavailable. Please try again later.",
          "error"
        );
        setLoading(false);
        return;
      }

      // ================= NETWORK ERROR =================
      if (response.status >= 500) {
        throw new Error("Service error");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
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
        const token =
          data.access_token ||
          data.token ||
          data;

        if (!token) {
          throw new Error(
            "Token tidak ditemukan dari backend"
          );
        }

        localStorage.setItem("token", token);

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Service Status Banner */}
      <ServiceStatusBanner
        isVisible={serviceUnavailable}
        message="Authentication service is temporarily unavailable"
        onRetry={handleRetry}
        serviceType="auth"
      />

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">

        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Kelarin 📋
          </h2>

          <p className="text-gray-500 mt-2">
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

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
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