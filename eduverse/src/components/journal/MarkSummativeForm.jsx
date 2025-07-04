import React, { useState } from "react";
import axios from "axios";
import styles from "./MarkSummativeForm.module.css";

const MarkSummativeForm = ({ journal }) => {
  const [scores, setScores] = useState({});
  const [term, setTerm] = useState("term1");

  const handleChange = (studentId, value) => {
    setScores((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    for (const studentId in scores) {
      const score = parseInt(scores[studentId]);
      if (!isNaN(score)) {
        try {
          await axios.patch(
            "http://localhost:5000/api/journal/summative",
            {
              journalId: journal._id,
              studentId,
              score,
              term,
            },
            { withCredentials: true }
          );
        } catch (err) {
          console.error("Xəta:", err);
        }
      }
    }
    window.location.reload(); 
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>📊 Summativ əlavə et</h4>

      <label className={styles.selectLabel}>Yarımil seç:</label>
      <select
        className={styles.select}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      >
        <option value="term1">I yarımil</option>
        <option value="term2">II yarımil</option>
      </select>

      {journal.records.map((r, i) => (
        <div key={r.student._id} className={styles.inputGroup}>
          <span>{r.student.name}:</span>
          <input
            type="number"
            value={scores[r.student._id] || ""}
            onChange={(e) => handleChange(r.student._id, e.target.value)}
          />
        </div>
      ))}

      <button className={styles.button} onClick={handleSubmit}>
        Təsdiqlə
      </button>
    </div>
  );
};

export default MarkSummativeForm;
