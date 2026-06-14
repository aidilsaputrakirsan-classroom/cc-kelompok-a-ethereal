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
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">
              Oops! Terjadi Kesalahan
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Aplikasi mengalami masalah saat memuat data.
              Silakan refresh halaman atau coba lagi nanti.
            </p>

            <button
              onClick={this.handleRefresh}
              type="button"
              className="w-full bg-[#2E75B6] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98]"
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