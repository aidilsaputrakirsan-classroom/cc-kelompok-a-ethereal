import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border p-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm font-medium text-[#2E75B6] hover:underline"
        >
          ← Kembali ke Dashboard
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          About Kelarin 📋
        </h1>

        <p className="text-gray-600 mb-8">
          Kelarin adalah platform manajemen tugas mahasiswa berbasis cloud
          yang membantu kolaborasi tim menjadi lebih terstruktur, efisien,
          dan mudah diakses kapan saja.
        </p>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Tech Stack
          </h2>

          <div className="space-y-2 text-gray-700">
            <p><strong>Backend:</strong> FastAPI + PostgreSQL</p>
            <p><strong>Frontend:</strong> React + Vite + Tailwind CSS</p>
            <p><strong>Container:</strong> Docker + Docker Compose</p>
            <p><strong>Deployment:</strong> Deployment-ready architecture</p>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ETHEREAL TEAM
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border-b">Nama</th>
                  <th className="text-left p-3 border-b">NIM</th>
                  <th className="text-left p-3 border-b">Peran</th>
                </tr>
              </thead>

              <tbody>
                {team.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{member.name}</td>
                    <td className="p-3 border-b">{member.nim}</td>
                    <td className="p-3 border-b">{member.role}</td>
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