import { useState } from "react";
// Note: Ensure filename matches your sidebar (LoginPage.jsx)
import LoginPage from "./pages/LoginPage.jsx"; 
import Header from "./components/Header.jsx";
import TaskList from "./components/TaskList.jsx";

function App() {
  // Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    /* This wrapper ensures your CSS/Padding applies to both Login and Tasks */
    <div className="app-main-wrapper" style={{ padding: "2rem" }}>
      {!token ? (
        <LoginPage setToken={setToken} />
      ) : (
        <>
          <Header onLogout={handleLogout} />
          <TaskList token={token} />
        </>
      )}
    </div>
  );
}

export default App;