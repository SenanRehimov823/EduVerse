import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateClassSection = ({ fetchClasses }) => {
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/teachers-with-subjects",
          { withCredentials: true }
        );
        setTeachers(res.data);
      } catch (err) {
        setTeachers([]);
      }
    };
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    if (!grade) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/students-for-class?grade=${grade}`,
        { withCredentials: true }
      );
      setAvailableStudents(res.data.students || []);
    } catch (err) {
      setAvailableStudents([]);
    }
  };

  useEffect(() => {
    if (grade) fetchStudents();
    else setAvailableStudents([]);
  }, [grade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/class/create",
        {
          name: className,
          headTeacherName: selectedTeacher,
          studentNames: selectedStudents,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setClassName("");
      setGrade("");
      setSelectedTeacher("");
      setSelectedStudents([]);

      // Yeni sinif əlavə olunduqdan sonra siyahını yenilə
      if (typeof fetchClasses === "function") fetchClasses();
      if (grade) fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  const toggleStudent = (name) => {
    setSelectedStudents((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <h3>Yeni Sinif Yarat</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sinif adı (məs. 3A)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Sinifin sinfi (məs. 3)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Rəhbər müəllimi seçin</option>
          {Array.isArray(teachers) &&
            teachers.map((t) => (
              <option key={t._id} value={t.name}>
                {t.name} ({t.subjectName || "Fənn yoxdur"})
              </option>
            ))}
        </select>

        <div>
          <h4>Şagirdləri seçin</h4>
          {availableStudents.map((student) => (
            <label key={student.name} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.name)}
                onChange={() => toggleStudent(student.name)}
              />
              {student.name}
            </label>
          ))}
        </div>

        <button type="submit">Sinif Yarat</button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
};

export default CreateClassSection;