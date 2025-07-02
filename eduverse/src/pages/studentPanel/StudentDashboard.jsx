import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { FaComments, FaArrowRight } from "react-icons/fa";
import styles from "./StudentDashboard.module.css";

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
    <div className={styles.dashboardWrapper}>
      <h2 className={styles.welcomeText}>👋 Xoş gəldin, {user?.name}</h2>

      <div className={styles.cardBox}>
        <div className={styles.cardHeader}>
          <FaComments className={styles.icon} />
          <h5>Sinif Çatı</h5>
        </div>
        <p className={styles.cardText}>Burada sinif yoldaşlarınla yazışa bilərsən.</p>
        <button
          className={styles.chatBtn}
          onClick={goToClassChat}
          disabled={!lessonId}
        >
          Sinif Çatına keç <FaArrowRight className="ms-2" />
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
