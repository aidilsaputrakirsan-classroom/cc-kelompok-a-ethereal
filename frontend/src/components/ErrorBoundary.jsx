import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Oops! Terjadi Kesalahan
            </h1>

            <p className="text-gray-600 mb-6">
              Aplikasi mengalami masalah saat memuat data.
              Silakan refresh halaman atau coba lagi nanti.
            </p>

            <button
              onClick={this.handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
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

export default ErrorBoundary;