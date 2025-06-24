import React, { useEffect, useState } from "react";
import axios from "axios";

const MarkAttendanceForm = ({ journalId, students, setJournal }) => {
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (studentId, value) => {
    setAttendance((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = Object.entries(attendance).map(async ([studentId, status]) => {
        return axios.patch(
          "http://localhost:5000/api/journal/attendance",
          {
            journalId,
            studentId,
            status,
          },
          { withCredentials: true }
        );
      });

      const results = await Promise.all(updates);
      setMessage("İştirak uğurla qeyd edildi");

      // Lokalda jurnalı yenilə
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
    <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
      <h4>İştirak Qeydiyyatı</h4>
      <table border="1" cellPadding="5">
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

      <button type="submit">Təsdiqlə</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default MarkAttendanceForm;
