import React, { useState } from "react";
import axios from "axios";
import styles from "./AddHomeworkForm.module.css";
import { FaTasks } from "react-icons/fa";

const AddHomeworkForm = ({ journalId }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !file) {
      setMessage("Zəhmət olmasa mətn və ya fayl əlavə edin.");
      return;
    }

    const formData = new FormData();
    formData.append("journalId", journalId);
    formData.append("homeworkText", text);
    if (file) formData.append("file", file);

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/journal/homework",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(res.data.message);
      setText("");
      setFile(null);
    } catch {
      setMessage("Xəta baş verdi");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formBox}>
      <h4 className={styles.sectionTitle}>
        <FaTasks /> Tapşırıq Əlavə Et
      </h4>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tapşırıq mətni"
        rows="3"
        className={styles.textarea}
      />
      <input
        type="file"
        className={styles.fileInput}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" className={styles.button}>
        Əlavə et
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default AddHomeworkForm;
