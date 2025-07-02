import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MarkAttendanceForm.module.css";

const MarkAttendanceForm = ({ journalId, students, setJournal }) => {
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (studentId, value) => {
    setAttendance((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = Object.entries(attendance).map(([studentId, status]) =>
        axios.patch(
          "http://localhost:5000/api/journal/attendance",
          { journalId, studentId, status },
          { withCredentials: true }
        )
      );
      await Promise.all(updates);
      setMessage("İştirak uğurla qeyd edildi");

      if (setJournal) {
        setJournal((prevJournal) => {
          const updatedRecords = prevJournal.records.map((r) => {
            const newStatus = attendance[r.student._id];
            if (newStatus) {
              return { ...r, attendance: newStatus };
            }
            return r;
          });
          return { ...prevJournal, records: updatedRecords };
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Xəta baş verdi");
    }
  };

  useEffect(() => {
    const defaultAttendance = {};
    students?.forEach((s) => {
      defaultAttendance[s._id] = s.attendance || "";
    });
    setAttendance(defaultAttendance);
  }, [students]);

  return (
    <form onSubmit={handleSubmit} className={styles.attendanceForm}>
      <h4 className={styles.title}>İştirak Qeydiyyatı</h4>
      <table className={styles.attendanceTable}>
        <thead>
          <tr>
            <th>Şagird</th>
            <th>İştirak Seçimi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>
                <select
                  className={styles.selectBox}
                  value={attendance[s._id] || ""}
                  onChange={(e) => handleChange(s._id, e.target.value)}
                >
                  <option value="">Seç</option>
                  <option value="etdi">İştirak etdi</option>
                  <option value="etmədi">İştirak etmədi</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit" className={styles.button}>
        Təsdiqlə
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default MarkAttendanceForm;
