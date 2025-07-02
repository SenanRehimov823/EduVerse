import React, { useEffect, useState } from "react";
import axios from "axios";
import MergedChat from "../../components/chat/MergedChat";
import styles from "./MergedChatPage.module.css";

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
      } catch {
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
    <div className={styles.chatPage}>
      <h2 className={styles.title}>📚 Müəllim Paneli – Müştərək Chat</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.selector}>
        <label className={styles.label}>Dərs seçin:</label>
        <select className={styles.select} onChange={handleSelect} defaultValue="">
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
