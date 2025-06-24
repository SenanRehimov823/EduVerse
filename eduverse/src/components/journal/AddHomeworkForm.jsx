import React, { useState } from "react";
import axios from "axios";

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
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h4>📚 Tapşırıq Əlavə Et</h4>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tapşırıq mətni"
        rows="3"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Əlavə et</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddHomeworkForm;
