import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "15px" }}>
      <h3>Quiz Statistikası</h3>
      <p>İştirakçı sayı: {stats.participants}</p>
      <p>Orta bal: {stats.averageScore}</p>
      {stats.topStudent ? (
        <p>Ən yüksək nəticə: {stats.topStudent.name} ({stats.topStudent.score} bal)</p>
      ) : (
        <p>Ən yüksək nəticə hələ yoxdur</p>
      )}
    </div>
  );
};

export default QuizStats;
