import React, { useState } from "react";
import axios from "axios";

const EditProfileImage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Zəhmət olmasa şəkil seçin.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put("http://localhost:5000/api/student/profile-image", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("✅ Şəkil uğurla yeniləndi.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Xəta baş verdi.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Profil şəklini yenilə</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-control my-2"
        />
        <button type="submit" className="btn btn-primary">Yenilə</button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default EditProfileImage;
