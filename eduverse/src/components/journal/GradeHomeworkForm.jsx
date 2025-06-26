import React, { useState } from "react";
import axios from "axios";

const GradeHomeworkForm = ({ journal }) => {
  const [grades, setGrades] = useState({});

  const handleGradeChange = (studentId, value) => {
    setGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (studentId) => {
    const grade = grades[studentId];
    if (grade === undefined || grade === "") {
      alert("Qiymət daxil edilməyib");
      return;
    }

    try {
   await axios.post("http://localhost:5000/api/journal/homework/grade", {
  journalId: journal._id,
  studentId,
  grade: parseInt(grade)
}, { withCredentials: true });

      alert("Qiymət uğurla verildi");
    } catch (err) {
      alert("Xəta baş verdi: " + (err.response?.data?.message || ""));
    }
  };

  return (
    <div>
      <h4>Tapşırıqlara Qiymət Ver</h4>
      {journal.records.map((r, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <span>{r.student?.name}</span> - 
          <input
            type="number"
            placeholder="Qiymət"
            value={grades[r.student._id] || ""}
            onChange={(e) => handleGradeChange(r.student._id, e.target.value)}
            style={{ width: "60px", marginLeft: "10px" }}
          />
          <button
            onClick={() => handleSubmit(r.student._id)}
            style={{ marginLeft: "10px" }}
          >
            Təsdiqlə
          </button>
        </div>
      ))}
    </div>
  );
};

export default GradeHomeworkForm;
