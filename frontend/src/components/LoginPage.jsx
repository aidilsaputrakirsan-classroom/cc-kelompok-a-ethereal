import { useState } from "react";
import { api } from "../services/api";

function LoginPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Z]/.test(password)) {
      alert("Password harus diawali huruf kapital");
      return;
    }

    const data = await api.login({ email, password });

    if (data.access_token) {
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
    } else {
      alert("Login gagal!");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Masuk ke Kelarin</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;