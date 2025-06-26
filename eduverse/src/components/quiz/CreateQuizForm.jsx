import React, { useEffect, useState } from "react";
import axios from "axios";

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
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updated });
  };

  const toggleCorrectAnswer = (qIndex, oIndex) => {
    const updated = [...form.questions];
    const current = updated[qIndex].correctAnswers;
    if (current.includes(oIndex)) {
      updated[qIndex].correctAnswers = current.filter((i) => i !== oIndex);
    } else {
      updated[qIndex].correctAnswers.push(oIndex);
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
      // Reset
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
    <div>
      <h2>Quiz Yarat</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz başlığı"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <select
          value={`${form.subject}|${form.className}`}
          onChange={(e) => {
            const [subject, className] = e.target.value.split("|");
            setForm({ ...form, subject, className });
          }}
          required
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
        />

        <h4>Sual siyahısı:</h4>
        {form.questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: "1px solid gray", margin: "10px 0", padding: "10px" }}>
            <input
              type="text"
              placeholder={`Sual ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
              required
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex}>
                <input
                  type="text"
                  placeholder={`Variant ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    checked={q.correctAnswers.includes(oIndex)}
                    onChange={() => toggleCorrectAnswer(qIndex, oIndex)}
                  />
                  Doğru cavab
                </label>
              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          Sual əlavə et
        </button>

        <button type="submit" style={{ marginTop: "15px" }}>
          Quiz yarat
        </button>
      </form>
    </div>
  );
};

export default CreateQuizForm;
