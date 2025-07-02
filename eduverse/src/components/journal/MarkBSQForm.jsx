import React, { useState } from "react";
import axios from "axios";
import styles from "./MarkBSQForm.module.css";

const MarkBSQForm = ({ journalId, students }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [score, setScore] = useState("");
  const [term, setTerm] = useState("term1");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || score === "" || !term) {
      setMessage("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/journal/bsq",
        {
          journalId,
          studentId: selectedStudent,
          score: Number(score),
          term,
        },
        { withCredentials: true }
      );

      await axios.post(
        "http://localhost:5000/api/journal/final-calculate",
        { journalId },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Əlavə edildi");
      setScore("");
      setSelectedStudent("");
    } catch (err) {
      setMessage("Xəta baş verdi");
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>📘 BŞQ Qiyməti Əlavə Et</h4>
      <form className={styles.form} onSubmit={handleSubmit}>
        <select
          className={styles.select}
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Şagird seç</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          className={styles.input}
          type="number"
          placeholder="Qiymət (0-100)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          min="0"
          max="100"
        />

        <select
          className={styles.select}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        >
          <option value="term1">I Yarıil</option>
          <option value="term2">II Yarıil</option>
        </select>

        <button type="submit" className={styles.button}>Əlavə et</button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default MarkBSQForm;
