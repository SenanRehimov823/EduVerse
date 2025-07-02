import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import styles from "./QuizList.module.css";
import { FaChartBar, FaTrashAlt, FaCheck, FaBookOpen, FaBan } from "react-icons/fa"; // Yeni iconlar

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
          newTimers[quiz._id] = <><FaBan /> Bitib</>;
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
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Mənim Quizlərim</h2>

      {error && <div className={styles.alert}>{error}</div>}

      {quizzes.length === 0 ? (
        <p>Heç bir quiz tapılmadı.</p>
      ) : (
        <div className={styles.cardGrid}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className={styles.card}>
              <h5 className={styles.cardTitle}>{quiz.title}</h5>
              <p className={styles.info}>
                <strong>Fənn:</strong> {quiz.subject} <br />
                <strong>Sinif:</strong> {quiz.classId.grade}{quiz.classId.section} <br />
                <strong>Sual sayı:</strong> {quiz.questions.length} <br />
                <strong>Deadline:</strong> {new Date(quiz.deadline).toLocaleString("az-Latn-AZ")} <br />
                <strong>Geri sayım:</strong>{" "}
                <span className={styles.timer}>
                  {timers[quiz._id] || "Hesablanır..."}
                </span>
              </p>

              <details className={styles.details}>
                <summary><FaBookOpen style={{ marginRight: "5px" }} /> Sualları göstər</summary>
                <ol>
                  {quiz.questions.map((q, i) => (
                    <li key={i}>
                      <p><strong>{q.question}</strong></p>
                      <ul>
                        {q.options.map((opt, idx) => (
                          <li key={idx}>
                            {opt}{" "}
                            {q.correctAnswers.includes(idx) && (
                              <span className={styles.correct}>
                                (<FaCheck /> Doğru)
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </details>

              <div className={styles.actions}>
                <Link to={`/teacher/quiz/${quiz._id}/results`} className={`${styles.btn} ${styles.btnResults}`}>
                  <FaChartBar style={{ marginRight: "6px" }} /> Nəticələr
                </Link>
                <button
                  className={`${styles.btn} ${styles.btnDelete}`}
                  onClick={() => handleDelete(quiz._id)}
                >
                  <FaTrashAlt style={{ marginRight: "6px" }} /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
