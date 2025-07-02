import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QuizStats.module.css";

const QuizStats = ({ quizId }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz-result/stats/${quizId}`, {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        setError("Statistika yüklənmədi");
      }
    };

    if (quizId) {
      fetchStats();
    }
  }, [quizId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Yüklənir...</p>;

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.title}>Quiz Statistikası</h3>
      <p className={styles.statItem}>İştirakçı sayı: {stats.participants}</p>
      <p className={styles.statItem}>Orta bal: {stats.averageScore}</p>
      {stats.topStudent ? (
        <p className={`${styles.statItem} ${styles.highlight}`}>
          Ən yüksək nəticə: {stats.topStudent.name} ({stats.topStudent.score} bal)
        </p>
      ) : (
        <p className={styles.statItem}>Ən yüksək nəticə hələ yoxdur</p>
      )}
    </div>
  );
};

export default QuizStats;
