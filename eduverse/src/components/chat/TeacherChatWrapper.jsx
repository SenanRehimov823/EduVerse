import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherChatRoom from "./TeacherChatRoom";

const TeacherChatWrapper = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndLessons = async () => {
      try {
        const [resUser, resLessons] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", { withCredentials: true }),
          axios.get("http://localhost:5000/api/lesson/by-teacher", { withCredentials: true }),
        ]);

        setUser(resUser.data.user);
        setLessons(resLessons.data.lessons || []);
      } catch (err) {
        console.error("❌ Məlumatlar alınmadı:", err);
      }
    };

    fetchUserAndLessons();
  }, []);

  const handleLessonChange = (e) => {
    const index = e.target.value;
    setSelectedLesson(index !== "" ? lessons[index] : null);
  };

  if (!user) return <div>İstifadəçi yüklənir...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📚 Müəllim Chat Paneli</h3>

      <div className="mb-3">
        <label className="form-label">Fənn və sinif seçin:</label>
        <select className="form-select" onChange={handleLessonChange} defaultValue="">
          <option value="">Seçin...</option>
          {lessons.map((lesson, index) => (
            <option key={`${lesson.subject}-${lesson.className}`} value={index}>
              {lesson.subject} — {lesson.className}
            </option>
          ))}
        </select>
      </div>

      {selectedLesson ? (
        <TeacherChatRoom
          subject={selectedLesson.subject}
          className={selectedLesson.className}
          currentUser={user}
        />
      ) : (
        <div className="alert alert-info">Chat üçün dərs seçilməyib.</div>
      )}
    </div>
  );
};

export default TeacherChatWrapper;
