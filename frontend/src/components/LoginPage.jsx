import { useState } from "react";
import { api } from "../services/api";

function LoginPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await api.login({ email, password });
    if (data.access_token) {
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
    } else {
      alert("Login Gagal! Periksa kembali email dan password Anda.");
    }
  };

  return (
    <div className="login-container">
      <h2>Masuk ke Kelarin</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default LoginPage;

// Tambahkan di dalam fungsi handleSubmit Anda
if (!/^[A-Z]/.test(password)) {
  alert("Gagal: Password harus diawali dengan huruf KAPITAL sesuai aturan sistem Kelarin.");
  return;
}