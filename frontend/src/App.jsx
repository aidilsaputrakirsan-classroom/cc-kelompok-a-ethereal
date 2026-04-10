import { useState } from "react";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <LoginPage setToken={setToken} />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Header
        onLogout={() => {
          setToken(null);
          localStorage.removeItem("token");
        }}
      />

      <TaskList token={token} />
    </div>
  );
}

export default App;