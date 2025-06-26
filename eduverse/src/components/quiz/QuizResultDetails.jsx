import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

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
    <div className="container mt-4">
      <h2>{quizData.quizTitle} — {quizData.class.grade}{quizData.class.section}</h2>
      <hr />
      {quizData.results.map((result, index) => (
        <div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <h5>{index + 1}. {result.studentName} — {result.status}</h5>
          <p><strong>Ball:</strong> {result.score !== null ? result.score : "—"}</p>
          {result.answers.length > 0 && (
            <ol>
              {result.answers.map((answer, idx) => {
                const q = quizData.questions[answer.questionIndex];
                return (
                  <li key={idx}>
                    <p><strong>{q.question}</strong></p>
                    <ul>
                      {q.options.map((opt, i) => {
                        const isSelected = answer.selectedOptions.includes(i);
                        const isCorrect = q.correctAnswers.includes(i);
                        return (
                          <li key={i} style={{ color: isCorrect ? "green" : isSelected ? "red" : "black" }}>
                            {opt}
                            {isCorrect && " ✔️"}
                            {isSelected && !isCorrect && " ❌"}
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
