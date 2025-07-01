import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 

const StudentDashboard = () => {
  const [lessonId, setLessonId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFirstLesson = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/subjects", {
          withCredentials: true,
        });
        const firstLesson = res.data.subjects?.[0];
        if (firstLesson?._id) {
          setLessonId(firstLesson._id);
        }
      } catch (err) {
        console.error("Fənlər yüklənə bilmədi:", err);
      }
    };

    fetchFirstLesson();
  }, []);

  const goToClassChat = () => {
    if (lessonId) {
      navigate("/student/chat-room", { state: { lessonId } });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👋 Xoş gəldin, {user?.name}</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">💬 Sinif Çatı</h5>
        <p>Burada sinif yoldaşlarınla yazışa bilərsən.</p>
        <button
          className="btn btn-success"
          onClick={goToClassChat}
          disabled={!lessonId}
        >
          Sinif Çatına keç
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
