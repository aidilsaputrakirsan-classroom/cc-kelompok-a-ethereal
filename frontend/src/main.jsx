import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/*
========================================
ERROR BOUNDARY
========================================
Menangkap error React agar user tidak melihat
white screen / crash page saat production
*/

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Terjadi kesalahan",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ERROR BOUNDARY:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full border text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Oops! Terjadi Kesalahan
            </h1>

            <p className="text-gray-600 mb-6">
              Sistem sedang mengalami gangguan atau API tidak dapat diakses.
              Silakan coba beberapa saat lagi.
            </p>

            <button
              onClick={this.handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/*
========================================
APP RENDER
========================================
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);