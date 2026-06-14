import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

const HomePage = ({ token, onLogout, showToast }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      
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

          <div className="w-auto">
            <Button
              onClick={() => navigate("/create")}
              variant="primary"
            >
              + Tambah Tugas
            </Button>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <TaskList token={token} showToast={showToast} onLogout={onLogout} />
        </div>

      </main>
    </div>
  );
};

export default HomePage;