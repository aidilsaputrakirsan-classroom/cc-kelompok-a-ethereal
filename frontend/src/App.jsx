import { useState } from "react";
import LoginPage from "./pages/LoginPage"; 
import HomePage from "./pages/HomePage";
import Toast from "./components/ui/Toast";

function App() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    showToast("Logged out successfully", "info");
  };

  return (
    <>
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {!token ? (
        <LoginPage setToken={setToken} showToast={showToast} />
      ) : (
        <HomePage 
  token={token} 
  onLogout={handleLogout} 
  showToast={showToast}
/>
      )}
    </>
  );
}

export default App;