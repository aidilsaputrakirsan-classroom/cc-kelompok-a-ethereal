import Header from "../components/Header";
import TaskList from "../components/TaskList";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = ({ token, onLogout, showToast }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLogout={onLogout} />

      <main className="flex-grow max-w-6xl w-full mx-auto py-8 px-4">

        {/* HEADER DASHBOARD */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Kelola tugas kamu dengan lebih rapi ✨
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="bg-[#2E75B6] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            + Tambah Tugas
          </button>
        </div>

        {/* TASK LIST */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <TaskList token={token} showToast={showToast} />
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;