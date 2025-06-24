import React, { useState } from "react";
import axios from "axios";

const MarkSummativeForm = ({ journal }) => {
  const [scores, setScores] = useState({});
  const [term, setTerm] = useState("term1"); // default olaraq 1-ci yarımil

  const handleChange = (studentId, value) => {
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    for (const studentId in scores) {
      const score = parseInt(scores[studentId]);
      if (!isNaN(score)) {
        try {
          await axios.patch("http://localhost:5000/api/journal/summative", {
            journalId: journal._id,
            studentId,
            score,
            term // seçilmiş yarımili backend-ə göndəririk
          }, { withCredentials: true });
        } catch (err) {
          console.error("Xəta:", err);
        }
      }
    }
    window.location.reload(); // test üçün
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Summativ əlavə et</h4>

      <label>Yarımil seç:</label>
      <select value={term} onChange={(e) => setTerm(e.target.value)}>
        <option value="term1">I yarımil</option>
        <option value="term2">II yarımil</option>
      </select>

      {journal.records.map((r, i) => (
        <div key={r.student._id}>
          {r.student.name}:{" "}
          <input
            type="number"
            value={scores[r.student._id] || ""}
            onChange={(e) => handleChange(r.student._id, e.target.value)}
            style={{ width: "50px" }}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Təsdiqlə</button>
    </div>
  );
};

export default MarkSummativeForm;
