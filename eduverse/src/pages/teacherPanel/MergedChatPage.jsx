import React, { useEffect, useState } from "react";
import axios from "axios";
import MergedChat from "../../components/chat/MergedChat"; // Chat komponentinin yolu düz olsun

const MergedChatPage = ({ currentUser }) => {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lesson/by-teacher", {
          withCredentials: true,
        });
        setLessons(res.data.lessons || []);
      } catch (err) {
        setError("Dərsləri yükləmək mümkün olmadı");
      }
    };
    fetchLessons();
  }, []);

  const handleSelect = (e) => {
    const [subject, className] = e.target.value.split("|||");
    setSelected({ subject, className });
  };

  return (
    <div className="container mt-4">
      <h4>📚 Müəllim Paneli – Müştərək Chat</h4>
      {error && <p className="text-danger">{error}</p>}

      <div className="form-group mb-4">
        <label>Dərs seçin:</label>
        <select className="form-control" onChange={handleSelect} defaultValue="">
          <option value="" disabled>Fənn və sinif seçin</option>
          {lessons.map((lesson) => (
            <option
              key={`${lesson.subject}_${lesson.className}`}
              value={`${lesson.subject}|||${lesson.className}`}
            >
              {lesson.subject} - {lesson.className}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <MergedChat
          subject={selected.subject}
          className={selected.className}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default MergedChatPage;
