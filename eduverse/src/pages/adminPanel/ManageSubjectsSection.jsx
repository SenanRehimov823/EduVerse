import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ManageSubjectsSection.module.css"; 

const ManageSubjectsSection = () => {
  const [subjectName, setSubjectName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/teachers-with-subjects", {
        withCredentials: true,
      });
      setTeachers(res.data);
    } catch (err) {
      console.error("Müəllimləri çəkmək olmadı:", err);
    }
  };

  const handleAssign = async () => {
    if (!subjectName || !teacherId) {
      setMessage("⚠️ Fənn və müəllim adı boş ola bilməz.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/subject/create", {
        subjectName,
        teacherId,
      }, {
        withCredentials: true,
      });

      setMessage("✅ Fənn uğurla yaradıldı və müəllim təyin olundu.");
      setSubjectName("");
      setTeacherId("");
    } catch (error) {
      setMessage("❌ Xəta: " + (error.response?.data?.message || "Bilinməyən xəta"));
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📚 Fənn əlavə et və müəllim təyin et</h3>
      <input
        type="text"
        placeholder="Fənn adı"
        className={styles.input}
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />
      <select
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        className={styles.select}
      >
        <option value="">-- Müəllim seç --</option>
        {teachers.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name} ({t.subjectName || "Fənn yoxdur"})
          </option>
        ))}
      </select>
      <button className={styles.button} onClick={handleAssign}>
        Əlavə et və təyin et
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ManageSubjectsSection;
