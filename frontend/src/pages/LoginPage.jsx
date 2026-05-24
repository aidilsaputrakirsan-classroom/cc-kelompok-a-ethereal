import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = ({ setToken, showToast }) => {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister
        ? `${API_URL}/auth/register`
        : `${API_URL}/auth/login`;

      let body;
      let headers = {};

      // ================= REGISTER =================
      if (isRegister) {
        body = JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });

        headers = {
          "Content-Type": "application/json",
        };
      }

      // ================= LOGIN =================
      else {
        const params = new URLSearchParams();

        params.append("username", formData.email);
        params.append("password", formData.password);

        body = params.toString();

        headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });

      // ================= SERVICE DOWN =================
      if (response.status >= 500) {
        throw new Error("Service temporarily unavailable");
      }

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

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
          throw new Error("Token tidak ditemukan dari backend");
        }

        localStorage.setItem("token", token);

        setToken(token);

        showToast("Login berhasil!", "success");
      }
    } catch (err) {
      console.error(err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Service temporarily unavailable")
      ) {
        showToast(
          "Service temporarily unavailable",
          "error"
        );
      } else {
        showToast(
          err.message || "Terjadi kesalahan",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
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