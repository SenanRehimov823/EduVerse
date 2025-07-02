import React, { useEffect, useState } from "react";
import { useParams } from "react-router"; // düzəliş
import axios from "axios";
import QuizStats from "./QuizStats";
import styles from "./QuizResultDetails.module.css";
import { FaCheck, FaTimes } from "react-icons/fa"; // Iconlar əlavə olundu

const QuizResultDetails = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz-result/by-quiz/${quizId}`, {
          withCredentials: true,
        });
        setQuizData(res.data);
      } catch (err) {
        setError("Nəticələri yükləmək mümkün olmadı");
      }
    };
    fetchResults();
  }, [quizId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!quizData) return <p>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {quizData.quizTitle} — {quizData.class.grade}{quizData.class.section}
      </h2>

      <QuizStats quizId={quizId} />

      <hr />

      {quizData.results.map((result, index) => (
        <div key={index} className={styles.studentCard}>
          <h5 className={styles.studentName}>
            {index + 1}. {result.studentName} — {result.status}
          </h5>
          <p className={styles.score}>
            <strong>Ball:</strong> {result.score !== null ? result.score : "—"}
          </p>

          {result.answers.length > 0 && (
            <ol className={styles.questionList}>
              {result.answers.map((answer, idx) => {
                const q = quizData.questions[answer.questionIndex];
                return (
                  <li key={idx}>
                    <p className={styles.questionText}>{q.question}</p>
                    <ul>
                      {q.options.map((opt, i) => {
                        const isSelected = answer.selectedOptions.includes(i.toString());
                        const isCorrect = q.correctAnswers.includes(i.toString());

                        return (
                          <li
                            key={i}
                            className={`${styles.option} ${
                              isCorrect
                                ? styles.correct
                                : isSelected
                                ? styles.incorrect
                                : styles.neutral
                            }`}
                          >
                            {opt}
                            {isCorrect && <FaCheck />}
                            {isSelected && !isCorrect && <FaTimes />}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizResultDetails;
