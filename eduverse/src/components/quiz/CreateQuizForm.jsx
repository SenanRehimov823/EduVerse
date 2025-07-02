import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CreateQuizForm.module.css";
import { FaPlusCircle, FaCheckCircle } from "react-icons/fa";

const CreateQuizForm = () => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    className: "",
    deadline: "",
    questions: [{ question: "", options: ["", "", "", ""], correctAnswers: [] }],
  });

  const fetchLessons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/lesson/by-teacher", {
        withCredentials: true,
      });
      setLessons(res.data.lessons || []);
    } catch (err) {
      alert("Dərslər yüklənmədi");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleQuestionChange = (index, key, value) => {
    const updated = [...form.questions];
    updated[index][key] = value;
    setForm({ ...form, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...form.questions];
    const oldValue = updated[qIndex].options[oIndex];
    updated[qIndex].options[oIndex] = value;
    updated[qIndex].correctAnswers = updated[qIndex].correctAnswers.map((ans) =>
      ans === oldValue ? value : ans
    );
    setForm({ ...form, questions: updated });
  };

  const toggleCorrectAnswer = (qIndex, oIndex) => {
    const updated = [...form.questions];
    const optionValue = updated[qIndex].options[oIndex];
    const current = updated[qIndex].correctAnswers;

    if (current.includes(optionValue)) {
      updated[qIndex].correctAnswers = current.filter((val) => val !== optionValue);
    } else {
      updated[qIndex].correctAnswers.push(optionValue);
    }

    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { question: "", options: ["", "", "", ""], correctAnswers: [] }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/quiz/create", form, {
        withCredentials: true,
      });
      alert("Quiz yaradıldı");
      setForm({
        title: "",
        subject: "",
        className: "",
        deadline: "",
        questions: [{ question: "", options: ["", "", "", ""], correctAnswers: [] }],
      });
    } catch (err) {
      alert(err.response?.data?.message || "Quiz yaradıla bilmədi");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Quiz Yarat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz başlığı"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className={styles["form-input"]}
        />

        <select
          value={`${form.subject}|${form.className}`}
          onChange={(e) => {
            const [subject, className] = e.target.value.split("|");
            setForm({ ...form, subject, className });
          }}
          required
          className={styles["form-select"]}
        >
          <option value="">Dərs və sinif seç</option>
          {lessons.map((l, i) => (
            <option key={i} value={`${l.subject}|${l.className}`}>
              {l.subject} - {l.className}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          required
          className={styles["form-datetime"]}
        />

        <h4>Sual siyahısı:</h4>
        {form.questions.map((q, qIndex) => (
          <div key={qIndex} className={styles["question-card"]}>
            <input
              type="text"
              placeholder={`Sual ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
              required
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className={styles["option-row"]}>
                <input
                  type="text"
                  placeholder={`Variant ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                />
                <label className={styles["checkbox-label"]}>
                  <input
                    type="checkbox"
                    checked={q.correctAnswers.includes(opt)}
                    onChange={() => toggleCorrectAnswer(qIndex, oIndex)}
                  />
                  Doğru cavab
                </label>
              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addQuestion} className={`${styles.btn} ${styles["btn-add"]}`}>
          <FaPlusCircle style={{ marginRight: "6px" }} /> Sual əlavə et
        </button>

        <button type="submit" className={`${styles.btn} ${styles["btn-submit"]}`}>
          <FaCheckCircle style={{ marginRight: "6px" }} /> Quiz yarat
        </button>
      </form>
    </div>
  );
};

export default CreateQuizForm;
