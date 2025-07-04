import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import styles from "./TakeQuiz.module.css";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${quizId}`, {
          withCredentials: true,
        });
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Quiz yüklənmədi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quiz?.deadline) return;

    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(quiz.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        clearInterval(interval);
        handleSubmit(true); 
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes} dəq ${seconds} san`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz]);

  const handleOptionChange = (qIndex, option) => {
    setAnswers((prev) => {
      const updated = [...prev];
      const existing = updated.find((a) => a.questionIndex === qIndex);

      if (existing) {
        if (existing.selectedOptions.includes(option)) {
          existing.selectedOptions = existing.selectedOptions.filter((o) => o !== option);
        } else {
          existing.selectedOptions.push(option);
        }
      } else {
        updated.push({
          questionIndex: qIndex,
          selectedOptions: [option],
        });
      }

      return [...updated];
    });
  };

  const handleSubmit = async (auto = false) => {
    try {
      await axios.post(
        "http://localhost:5000/api/quiz-result/submit",
        { quizId, answers },
        { withCredentials: true }
      );

      if (auto) {
        alert("⏱️ Vaxt bitdi! Nəticəyə yönləndirilirsiniz.");
      } else {
        alert("✅ Quiz təqdim edildi!");
      }

      navigate(`/student/quiz-result/${quizId}`);
    } catch (err) {
      console.error("Təqdim xətası:", err.response?.data?.message || "Xəta baş verdi");
      alert(err.response?.data?.message || "Təqdim mümkün olmadı.");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (!quiz) return <p>Quiz tapılmadı</p>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{quiz.title}</h3>
      <p className={styles.deadline}>Vaxt limiti: {new Date(quiz.deadline).toLocaleString()}</p>
      {timeLeft && <p className={styles.timer}>⏳ Qalan vaxt: {timeLeft}</p>}

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className={styles.questionCard}>
          <h6 className={styles.questionText}>
            Sual {qIndex + 1}: {q.question}
          </h6>
          {q.options.map((opt, idx) => {
            const isSelected = answers.find((a) => a.questionIndex === qIndex)?.selectedOptions.includes(opt);
            return (
              <div key={idx} className={styles.option}>
                <input
                  type="checkbox"
                  checked={isSelected || false}
                  onChange={() => handleOptionChange(qIndex, opt)}
                  id={`q${qIndex}-opt${idx}`}
                />
                <label htmlFor={`q${qIndex}-opt${idx}`}>{opt}</label>
              </div>
            );
          })}
        </div>
      ))}

      <button className={styles.submitButton} onClick={() => handleSubmit(false)}>
        ✅ Təqdim et
      </button>
    </div>
  );
};

export default TakeQuiz;
