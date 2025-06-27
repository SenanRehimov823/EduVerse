import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");
  const [myLessons, setMyLessons] = useState([]);
  const [userRole, setUserRole] = useState("");

  // İstifadəçi məlumatını yüklə (rol üçün)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUserRole(res.data.user.role); // düzəldilmiş hissə
      } catch (err) {
        console.error("İstifadəçi məlumatı tapılmadı");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get("http://localhost:5000/api/class/all-classes", {
          withCredentials: true,
        });
        setClasses(classRes.data.classes || []);

        const subjectRes = await axios.get("http://localhost:5000/api/subject/all", {
          withCredentials: true,
        });
        setSubjects(subjectRes.data.subjects || []);
      } catch (err) {
        setMessage("Sinif və ya fənn tapılmadı");
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!subjectId) return setTeachers([]);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/teachers-by-subject/${subjectId}`,
          { withCredentials: true }
        );
        setTeachers(res.data.teachers || []);
      } catch (err) {
        setTeachers([]);
      }
    };
    fetchTeachers();
  }, [subjectId]);

  // Müəllimin və ya adminin dərslərini yüklə
  useEffect(() => {
    const fetchLessons = async () => {
      if (!userRole) return;

      const endpoint =
        userRole === "admin"
          ? "http://localhost:5000/api/lesson/admin/all"
          : "http://localhost:5000/api/lesson/by-teacher";

      try {
        const res = await axios.get(endpoint, {
          withCredentials: true,
        });
        setMyLessons(res.data.lessons || []);
      } catch (err) {
        console.error("Dərsləri yükləmək olmadı:", err);
      }
    };
    fetchLessons();
  }, [userRole, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/lesson/create",
        {
          classId,
          subjectId,
          teacherId,
        },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Dərs və jurnal uğurla əlavə olundu!");
      setClassId("");
      setSubjectId("");
      setTeacherId("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Xəta baş verdi!");
    }
  };

  return (
    <div>
      <h2>Dərs və jurnal əlavə et</h2>
      <form onSubmit={handleSubmit}>
        <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
          <option value="">Sinif seç</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.grade}
              {cls.section}
            </option>
          ))}
        </select>

        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
          <option value="">Fənn seç</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
          disabled={!subjectId}
        >
          <option value="">Müəllim seç</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={!classId || !subjectId || !teacherId}>
          Əlavə et
        </button>
      </form>

      {message && <p>{message}</p>}

      <h3 style={{ marginTop: "30px" }}>Əlavə olunan dərslər</h3>
      {myLessons.length > 0 ? (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Fənn</th>
              <th>Sinif</th>
              {userRole === "admin" && <th>Müəllim</th>}
              <th>Yaradılma tarixi</th>
            </tr>
          </thead>
          <tbody>
            {myLessons.map((lesson, idx) => (
              <tr key={idx}>
                <td>{lesson.subject}</td>
                <td>{lesson.className}</td>
                {userRole === "admin" && <td>{lesson.teacher}</td>}
                <td>{new Date(lesson.createdAt).toLocaleString("az-AZ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Hələ dərs əlavə olunmayıb</p>
      )}
    </div>
  );
};

export default TeacherPage;
