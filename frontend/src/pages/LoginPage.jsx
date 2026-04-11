import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const LoginPage = ({ setToken, showToast }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Determine Endpoint & Payload
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      let body;
      let headers = {};

      if (isRegister) {
  body = JSON.stringify({
    email: formData.email,
    name: formData.name, // Must match your DB column 'name'
    password: formData.password,
  });
  headers["Content-Type"] = "application/json";
} else {
  // Login logic stays the same (OAuth2 uses username/password)
  const params = new URLSearchParams();
  params.append("username", formData.email);
  params.append("password", formData.password);
  body = params;
}

      // 2. Make the API Call
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // 3. Handle Success
      if (isRegister) {
        showToast("Registrasi berhasil! Silakan login.", "success");
        setIsRegister(false);
      } else {
        const token = data.access_token || data;
        localStorage.setItem("token", token);
        setToken(token);
        showToast("Login berhasil!", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Kelarin ☁️</h2>
          <p className="text-gray-500 mt-2">
            {isRegister ? "Create your student account" : "Welcome back!"}
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <Input 
              label="Full Name" 
              placeholder="Tiya Mitra" 
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          )}
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="user@student.itk.ac.id"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Log In"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-gray-50 pt-4">
          <Button 
            variant="link" 
            type="button" // CRITICAL: Prevents this button from submitting the form
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Already have an account? Log in" : "Need an account? Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;