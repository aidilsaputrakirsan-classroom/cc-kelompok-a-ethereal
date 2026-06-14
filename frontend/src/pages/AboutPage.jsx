import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

const AboutPage = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Tiya Mitra Ayu",
      nim: "10231088",
      role: "Lead Backend",
    },
    {
      name: "Amazia Devid Saputra",
      nim: "10231013",
      role: "Lead Frontend",
    },
    {
      name: "Alsha Dwi Cahya",
      nim: "10231011",
      role: "Lead DevOps",
    },
    {
      name: "Andini Permata Sari",
      nim: "10231015",
      role: "Lead QA & Documentation",
    },
    {
      name: "Ansellma Tita Pakartiwuri",
      nim: "10231017",
      role: "Lead CI/CD",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">

        {/* Back Button */}
        <div className="w-auto mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="link"
          >
            ← Kembali ke Dashboard
          </Button>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
          About Kelarin 📋
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
          Kelarin adalah platform manajemen tugas mahasiswa berbasis cloud
          yang membantu kolaborasi tim menjadi lebih terstruktur, efisien,
          dan mudah diakses kapan saja.
        </p>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            Tech Stack
          </h2>

          <div className="space-y-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <p><strong>Backend:</strong> FastAPI + PostgreSQL</p>
            <p><strong>Frontend:</strong> React + Vite + Tailwind CSS</p>
            <p><strong>Container:</strong> Docker + Docker Compose</p>
            <p><strong>Deployment:</strong> Deployment-ready architecture</p>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            ETHEREAL TEAM
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
              <thead className="bg-gray-100 dark:bg-gray-700 transition-colors duration-300">
                <tr>
                  <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">Nama</th>
                  <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">NIM</th>
                  <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">Peran</th>
                </tr>
              </thead>

              <tbody className="text-gray-700 dark:text-gray-300">
                {team.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{member.name}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{member.nim}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;