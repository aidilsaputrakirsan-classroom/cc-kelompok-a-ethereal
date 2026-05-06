import Header from "../components/Header";
import TaskList from "../components/TaskList";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = ({ token, onLogout, showToast }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      
      <Header onLogout={onLogout} />

      <main className="flex-grow max-w-6xl w-full mx-auto py-8 px-4">

        {/* HEADER DASHBOARD */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-300">
              Kelola tugas kamu dengan lebih rapi ✨
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="bg-[#2E75B6] text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            + Tambah Tugas
          </button>
        </div>

        {/* TASK LIST */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <TaskList token={token} showToast={showToast} />
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;