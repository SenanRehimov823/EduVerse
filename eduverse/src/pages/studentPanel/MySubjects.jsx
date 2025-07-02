import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./MySubjects.module.css";
import { FaBook, FaComments } from "react-icons/fa";

const MySubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/subjects", {
          withCredentials: true,
        });
        setSubjects(res.data.subjects || []);
      } catch {
        setError("Fənlər yüklənmədi");
      }
    };
    fetchSubjects();
  }, []);

  const goToJournal = (subjectName) => {
    navigate("/student/my-journals", {
      state: { subject: subjectName },
    });
  };

  const goToMergedChat = (subjectName, className) => {
    if (!className) {
      alert("Sinif adı tapılmadı!");
      return;
    }
    navigate(`/merged-chat-room?subject=${subjectName}&className=${className}`);
  };

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📚 Fənlərim</h2>
      <div className={styles.grid}>
        {subjects.map((item, index) => (
          <div className={styles.card} key={index}>
            <h3><strong>📖 {item.subject.name}</strong></h3>
            <p><strong>Müəllim:</strong> {item.teacher.name}</p>
            <p><strong>Sinif:</strong> {item.className}</p>
            <div className={styles.buttons}>
              <button
                className={styles.journalBtn}
                onClick={() => goToJournal(item.subject.name)}
              >
                <FaBook style={{ marginRight: "5px" }} /> Jurnalım
              </button>
              <button
                className={styles.chatBtn}
                onClick={() => goToMergedChat(item.subject.name, item.className)}
              >
                <FaComments style={{ marginRight: "5px" }} /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubjects;
