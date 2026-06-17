import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parseInt(parsed.sub),
      email: parsed.email,
      name: parsed.name,
      role: parsed.role || "member",
    };
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

const AdminPage = ({ token, showToast }) => {
  const navigate = useNavigate();
  const currentUser = getUserFromToken(token);
  const isAdmin = currentUser && currentUser.role === "admin";

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Edit form state
  const [editingUser, setEditingUser] = useState(null); // User object being edited
  const [editForm, setEditForm] = useState({
    name: "",
    role: "member",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const res = await api.getUsers(token);
      if (res.ok) {
        setUsers(res.data);
      } else {
        showToast(res.error || "Gagal mengambil daftar pengguna", "error");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
    } else {
      setFetching(false);
    }
  }, [token, isAdmin]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      password: "", // Leave blank unless changing
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showToast("Nama tidak boleh kosong", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        role: editForm.role,
      };

      if (editForm.password.trim()) {
        if (editForm.password.trim().length < 8) {
          showToast("Kata sandi baru minimal harus 8 karakter", "error");
          setLoading(false);
          return;
        }
        payload.password = editForm.password.trim();
      }

      const res = await api.updateUserByAdmin(editingUser.id, payload, token);
      if (res.ok) {
        showToast(`Data pengguna "${res.data.email}" berhasil diperbarui!`, "success");
        setEditingUser(null);
        fetchUsers(); // Refresh table
      } else {
        showToast(res.error || "Gagal memperbarui data pengguna", "error");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) {
      showToast("Anda tidak dapat menghapus akun Anda sendiri!", "error");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}" (${user.email})? Tindakan ini tidak dapat dibatalkan.`)) {
      setLoading(true);
      try {
        const res = await api.deleteUserByAdmin(user.id, token);
        if (res.ok) {
          showToast(`Pengguna "${user.name}" berhasil dihapus.`, "success");
          fetchUsers();
          if (editingUser && editingUser.id === user.id) {
            setEditingUser(null);
          }
        } else {
          showToast(res.error || "Gagal menghapus pengguna", "error");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        showToast("Terjadi kesalahan jaringan", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-red-100 dark:border-red-900/30 text-center space-y-4">
          <span className="text-5xl block">⚠️</span>
          <h2 className="text-2xl font-bold text-red-650 dark:text-red-400">
            Akses Ditolak
          </h2>
          <p className="text-gray-550 dark:text-gray-400 text-sm">
            Halaman ini hanya dapat diakses oleh Administrator sistem.
          </p>
          <Button onClick={() => navigate("/")} variant="primary">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E75B6] mb-4"></div>
          <p className="text-gray-800 dark:text-white font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  // Summary statistics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const memberCount = users.filter((u) => u.role === "member").length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex-grow space-y-8">
      {/* Back Button */}
      <div className="flex justify-start">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#2E75B6] dark:text-gray-200 dark:hover:text-blue-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98] group"
        >
          <span className="text-lg transform group-hover:-translate-x-0.5 transition-transform">←</span>
          Kembali ke Beranda
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          👑 Manajemen Pengguna Kelarin
        </h1>
        <p className="text-gray-550 dark:text-gray-400 mt-1">
          Halaman kontrol administrator untuk mengelola nama, peran, dan kata sandi pengguna sistem Kelarin.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-sm text-center">
          <div className="text-2xl font-bold text-[#2E75B6] dark:text-blue-400">{totalUsers}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Total Pengguna</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-650 dark:text-red-400">{adminCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Admin</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{memberCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Member</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Users Table / List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-150 dark:border-gray-750 shadow-sm">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase border-b border-gray-150 dark:border-gray-750">
                    <th className="p-4">Pengguna</th>
                    <th className="p-4 w-32">Peran</th>
                    <th className="p-4 w-24 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-450 dark:text-gray-500 italic">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/10">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[#2E75B6] dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-blue-900/20">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                              user.role === "admin"
                                ? "bg-red-50 text-red-750 border-red-200 dark:bg-red-950/25 dark:text-red-300 dark:border-red-900/30"
                                : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/50"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => handleEditClick(user)}
                              className="w-auto px-3 py-1.5 text-xs h-8 inline-flex items-center gap-1 mt-0"
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteUser(user)}
                              className="w-auto px-3 py-1.5 text-xs h-8 inline-flex items-center gap-1 mt-0"
                              disabled={user.id === currentUser.id}
                            >
                              🗑️ Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="lg:col-span-1">
          {editingUser ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-150 dark:border-gray-750 p-6 space-y-6 transition-all">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Panel Sunting
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 break-words">
                  Edit Detail User
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">
                  Akun: <span className="font-bold font-mono">{editingUser.email}</span>
                </p>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  placeholder="Ketik nama baru..."
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Peran Sistem (Role)
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700/60 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E75B6]/20 dark:focus:ring-blue-500/25 focus:border-[#2E75B6] dark:focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                    disabled={loading}
                  >
                    <option value="member">member (Anggota)</option>
                    <option value="admin">admin (Administrator)</option>
                  </select>
                </div>

                <Input
                  label="Kata Sandi Baru (Opsional)"
                  type="password"
                  placeholder="Isi untuk mengganti kata sandi..."
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      password: e.target.value,
                    })
                  }
                  disabled={loading}
                />
                <p className="text-[10px] text-gray-450 dark:text-gray-500 -mt-2">
                  Kosongkan kolom ini jika tidak ingin mengubah kata sandi user.
                </p>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={loading} variant="primary">
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingUser(null)}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-750 p-8 text-center text-gray-400 dark:text-gray-500">
              <span className="text-4xl block mb-2">👤</span>
              <p className="text-sm font-medium">
                Pilih pengguna dari tabel di sebelah kiri untuk mulai mengedit detail profilnya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
