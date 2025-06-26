import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/quiz/my-quizzes", {
          withCredentials: true,
        });
        setQuizzes(res.data.quizzes);
      } catch (err) {
        setError("Quizlər yüklənmədi");
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      quizzes.forEach((quiz) => {
        const now = new Date().getTime();
        const deadline = new Date(quiz.deadline).getTime();
        const distance = deadline - now;

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          newTimers[quiz._id] = `${hours} saat ${minutes} dəq ${seconds} san`;
        } else {
          newTimers[quiz._id] = "⛔ Bitib";
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizzes]);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Bu quiz-i silmək istədiyinizə əminsiniz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${quizId}`, {
        withCredentials: true,
      });
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (err) {
      alert("Quiz silinmədi");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📋 Mənim Quizlərim</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {quizzes.length === 0 ? (
        <p>Heç bir quiz tapılmadı.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col">
              <div className="card shadow-sm p-3">
                <h5 className="card-title">{quiz.title}</h5>
                <p>
                  <strong>Fənn:</strong> {quiz.subject} <br />
                  <strong>Sinif:</strong> {quiz.classId.grade}{quiz.classId.section} <br />
                  <strong>Sual sayı:</strong> {quiz.questions.length} <br />
                  <strong>Deadline:</strong> {new Date(quiz.deadline).toLocaleString("az-Latn-AZ")} <br />
                  <strong>Geri sayım:</strong>{" "}
                  <span style={{ fontWeight: "bold", color: "crimson" }}>
                    {timers[quiz._id] || "Hesablanır..."}
                  </span>
                </p>

                <details>
                  <summary>Sualları göstər 🔽</summary>
                  <ol>
                    {quiz.questions.map((q, i) => (
                      <li key={i}>
                        <p><strong>{q.question}</strong></p>
                        <ul>
                          {q.options.map((opt, idx) => (
                            <li key={idx}>
                              {opt}{" "}
                              {q.correctAnswers.includes(idx) && (
                                <span style={{ color: "green" }}>(✔️ Doğru)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </details>

                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/teacher/quiz/${quiz._id}/results`} className="btn btn-outline-primary btn-sm">
                    📊 Nəticələr
                  </Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(quiz._id)}>
                    ❌ Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
