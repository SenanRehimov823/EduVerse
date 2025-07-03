import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AssignHeadTeacherSection.module.css"; 

const AssignHeadTeacherSection = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/class/all-classes", {
        withCredentials: true,
      });
      setClasses(res.data.classes);
    } catch (err) {
      console.error("Sinifləri gətirə bilmədi", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/teachers-with-subjects");
      setTeachers(res.data);
    } catch (err) {
      console.error("Müəllimləri gətirə bilmədi", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedClass || !selectedTeacher) {
      setMessage("Zəhmət olmasa sinif və müəllim seçin");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/class/assign-head",
        {
          className: selectedClass,
          headTeacherName: selectedTeacher,
        },
        {
          withCredentials: true,
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className={styles.container}>
      <h3>📌 Rəhbər Müəllim Təyini</h3>
      <div className={styles.fieldGroup}>
        <label>Sinif seç:</label>
        <select onChange={(e) => setSelectedClass(e.target.value)} value={selectedClass}>
          <option value="">--Sinif seçin--</option>
          {classes.map((cls) => (
            <option key={cls._id} value={`${cls.grade}${cls.section}`}>
              {cls.grade}{cls.section}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label>Müəllim seç:</label>
        <select onChange={(e) => setSelectedTeacher(e.target.value)} value={selectedTeacher}>
          <option value="">--Müəllim seçin--</option>
          {teachers.map((t) => (
            <option key={t._id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAssign} className={styles.button}>Təyin et</button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default AssignHeadTeacherSection;
