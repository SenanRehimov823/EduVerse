import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import styles from "./StudentQuizResult.module.css";

const StudentQuizResult = () => {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/student/quiz-result/my/${quizId}`,
          { withCredentials: true }
        );
        setResult(res.data);
      } catch (err) {
        console.error("Nəticə yüklənmədi:", err);
      }
    };

    fetchResult();
  }, [quizId]);

  if (!result) return <p>Nəticə yüklənir...</p>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📊 {result.quizTitle}</h3>
      <p className={styles.meta}>Müəllim: {result.teacher}</p>
      <p className={styles.score}>Ümumi bal: {result.score}</p>

      {result.answers.map((q, idx) => (
        <div key={idx} className={styles.questionCard}>
          <h6 className={styles.questionText}>Sual {idx + 1}: {q.question}</h6>
          <p className={styles.answer}>
            <strong>Sənin cavabın:</strong>{" "}
            <span className={q.isCorrect ? styles.correct : styles.incorrect}>
              {q.selectedOptions.join(", ") || "Boş buraxılıb"}
            </span>
          </p>
          <p className={styles.answer}>
            <strong>Düzgün cavab:</strong> <span className={styles.correct}>{q.correctAnswers.join(", ")}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default StudentQuizResult;
