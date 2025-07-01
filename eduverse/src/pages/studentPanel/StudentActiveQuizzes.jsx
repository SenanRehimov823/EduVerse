import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

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
    <div className="container mt-5">
      <h3>📝 Aktiv Quizlər</h3>
      {quizzes.length === 0 ? (
        <p>Hal-hazırda aktiv quiz yoxdur.</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz._id} className="card mb-3 p-3">
            <h5>{quiz.title}</h5>
            <p>Bitmə vaxtı: {new Date(quiz.deadline).toLocaleString()}</p>
            <button
              className="btn btn-primary"
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
