import Header from "../components/Header";
import TaskList from "../components/TaskList";
import Footer from "../components/Footer"; // Import the new footer

const HomePage = ({ token, onLogout, showToast }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLogout={onLogout} />
      
      <main className="flex-grow max-w-5xl w-full mx-auto py-8 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ethereal Dashboard</h1>
          <p className="text-sm text-gray-500">Kelola tugas akademik dan kolaborasi tim Anda.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TaskList token={token} showToast={showToast} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;