import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        setError("Profil məlumatları yüklənmədi.");
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return setUploadStatus("Zəhmət olmasa şəkil seçin.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put("http://localhost:5000/api/student/profile-image", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("✅ Şəkil uğurla yeniləndi");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setUploadStatus("❌ Yükləmə zamanı xəta baş verdi.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("http://localhost:5000/api/auth/change-password", passwordData, {
        withCredentials: true,
      });
      setPasswordStatus(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordStatus(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Hesabınızı silmək istədiyinizə əminsiniz?")) return;
    try {
      const res = await axios.delete("http://localhost:5000/api/auth/delete-account", {
        withCredentials: true,
      });
      setDeleteStatus(res.data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setDeleteStatus("Silinmə zamanı xəta baş verdi");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      alert("Çıxış zamanı xəta baş verdi");
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <p>Yüklənir...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👤 Şagird Profilim</h2>
      <div className="card p-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-3 text-center">
            <img
              src={`http://localhost:5000${profile.image}`}
              alt="Profil şəkli"
              className="img-fluid rounded-circle"
              style={{ maxWidth: "150px", height: "150px", objectFit: "cover" }}
            />
            <form onSubmit={handleImageUpload} className="mt-3">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="form-control mb-2" />
              <button type="submit" className="btn btn-primary btn-sm">📤 Şəkli Yenilə</button>
              {uploadStatus && <p className="mt-2 small">{uploadStatus}</p>}
            </form>
          </div>
          <div className="col-md-9">
            <p><strong>Ad:</strong> {profile.name}</p>
            <p><strong>Soyad:</strong> {profile.surname}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Sinif:</strong> {profile.className}</p>
            <p><strong>Rolu:</strong> {profile.role}</p>
          </div>
        </div>

        <hr />
        <h5>🔐 Şifrəni Dəyiş</h5>
        <form onSubmit={handleChangePassword}>
          <input type="password" placeholder="Köhnə şifrə" className="form-control mb-2"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
          <input type="password" placeholder="Yeni şifrə" className="form-control mb-2"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
          <button type="submit" className="btn btn-warning btn-sm">🔁 Dəyiş</button>
          {passwordStatus && <p className="mt-2 small">{passwordStatus}</p>}
        </form>

        <hr />
        <h5>❌ Hesabı Sil</h5>
        <button onClick={handleDeleteAccount} className="btn btn-danger btn-sm">Sil və Çıxış</button>
        {deleteStatus && <p className="mt-2 small">{deleteStatus}</p>}

        <hr />
        <h5>🚪 Çıxış Et</h5>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Çıxış</button>
      </div>
    </div>
  );
};

export default StudentProfile;
