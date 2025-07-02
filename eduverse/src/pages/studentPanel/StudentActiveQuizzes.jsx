import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./StudentActiveQuizzes.module.css";

const StudentActiveQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/quiz-active", {
          withCredentials: true,
        });
        setQuizzes(res.data.active || []);
      } catch (err) {
        console.error("Quizlər yüklənmədi:", err);
      }
    };

    fetchActiveQuizzes();
  }, []);

  const startQuiz = (quizId) => {
    navigate(`/student/quiz/${quizId}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📝 Aktiv Quizlər</h3>
      {quizzes.length === 0 ? (
        <p className={styles.empty}>Hal-hazırda aktiv quiz yoxdur.</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz._id} className={styles.quizCard}>
            <h5 className={styles.quizTitle}>{quiz.title}</h5>
            <p className={styles.deadline}>
              Bitmə vaxtı: {new Date(quiz.deadline).toLocaleString()}
            </p>
            <button
              className={styles.startButton}
              onClick={() => startQuiz(quiz._id)}
            >
              Başla
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentActiveQuizzes;
