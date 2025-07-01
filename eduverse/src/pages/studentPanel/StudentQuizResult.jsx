import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

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
    <div className="container mt-4">
      <h3>📊 {result.quizTitle}</h3>
      <p>Müəllim: {result.teacher}</p>
      <p>Ümumi bal: {result.score}</p>

      {result.answers.map((q, idx) => (
        <div key={idx} className="card mb-3 p-3">
          <h6>Sual {idx + 1}: {q.question}</h6>
          <p><strong>Sənin cavabın:</strong> {q.selectedOptions.join(", ") || "Boş buraxılıb"}</p>
          <p><strong>Düzgün cavab:</strong> {q.correctAnswers.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentQuizResult;
