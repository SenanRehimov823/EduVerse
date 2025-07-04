import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlusCircle, FaCalendarAlt, FaBookOpen, FaCheckCircle } from "react-icons/fa";
import MarkAttendanceForm from "./MarkAttendanceForm";
import MarkSummativeForm from "./MarkSummativeForm";
import MarkBSQForm from "./MarkBSQForm";
import AddHomeworkForm from "./AddHomeworkForm";
import GradeHomeworkForm from "./GradeHomeworkForm";
import styles from "./JournalTable.module.css";

const JournalTable = () => {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState({ subject: "", className: "", date: "" });
  const [journal, setJournal] = useState(null);
  const [topicInput, setTopicInput] = useState(""); 
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

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

  const getClassId = () => {
    const lesson = lessons.find(
      (l) => l.subject === selected.subject && l.className === selected.className
    );
    return lesson?.classId || "";
  };

  useEffect(() => {
    const fetchJournal = async () => {
      if (!selected.subject || !selected.className || !selected.date || !getClassId()) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/journal/by-date?subject=${selected.subject}&classId=${getClassId()}&date=${selected.date}`,
          { withCredentials: true }
        );
        setJournal(res.data.journal);
        setTopicInput(res.data.journal.topic || ""); 
        setError("");
      } catch {
        setJournal(null);
        setError("Bu tarix ün jurnal yoxdur");
      }
    };
    fetchJournal();
  }, [selected, refetch]);

  const handleCreateJournal = async () => {
    const classId = getClassId();
    if (!classId || !selected.subject || !selected.date) {
      return alert("Zəhmət olmasa dərs və tarix seçin");
    }

    try {
      await axios.post("http://localhost:5000/api/journal/create", {
        classId,
        subject: selected.subject,
        date: selected.date,
      }, { withCredentials: true });

      alert("Jurnal yaradıldı");
      setRefetch(!refetch);
    } catch (err) {
      alert(err.response?.data?.message || "Jurnal yaradıla bilmədi");
    }
  };

  const handleUpdateTopic = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/journal/topic",
        {
          journalId: journal._id,
          topic: topicInput,
        },
        { withCredentials: true }
      );
      alert("Mövzu yeniləndi");
      setTopicInput(""); 
      setRefetch(!refetch);
    } catch (err) {
      alert("Xəta baş verdi: Mövzu dəyişmədi");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}><FaBookOpen /> Müəllim Jurnalı</h2>

      <select
        className={styles.select}
        onChange={(e) => {
          const [subject, className] = e.target.value.split("|");
          setSelected({ subject, className, date: "" });
        }}
      >
        <option value="">Dərs seç</option>
        {lessons.map((l, i) => (
          <option key={i} value={`${l.subject}|${l.className}`}>
            {l.subject} - {l.className}
          </option>
        ))}
      </select>

      {selected.subject && selected.className && (
        <div>
          <label><FaCalendarAlt style={{ marginRight: 5 }} />Tarix:</label>
          <input
            type="date"
            className={styles.dateInput}
            value={selected.date}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {!journal && selected.subject && selected.className && selected.date && (
        <button className={styles.btn} onClick={handleCreateJournal}>
          <FaPlusCircle style={{ marginRight: 6 }} /> Yeni jurnal yarat
        </button>
      )}

      {!error && journal && (
        <div className={styles.journalBox}>
          <h4>{journal.subject} - Jurnal</h4>
          <p>Mövzu: {journal.topic || "-"} | Tarix: {new Date(journal.date).toLocaleDateString("az-AZ")}</p>

          <div className={styles.topicUpdate}>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Yeni mövzunu yazın"
            />
            <button onClick={handleUpdateTopic}>
              <FaCheckCircle style={{ marginRight: 5 }} /> Mövzunu yenilə
            </button>
          </div>

          <p>📘 Tapşırıq: {journal.homework?.text?.trim() ? journal.homework.text : "-"}
            {journal.homework?.file && (
              <span>
                {" "}→ <a href={`http://localhost:5000${journal.homework.file}`} target="_blank" rel="noreferrer">Bax</a>
              </span>
            )}
          </p>

          <MarkAttendanceForm journalId={journal._id} students={journal.records.map((r) => r.student)} />
          <MarkSummativeForm journal={journal} />
          <AddHomeworkForm journalId={journal._id} />
          <MarkBSQForm journalId={journal._id} students={journal.records.map((r) => r.student)} />
          <GradeHomeworkForm journal={journal} />

          <table className={styles.journalTable}>
            <thead>
              <tr>
                <th>Şagird</th>
                <th>İştirak</th>
                <th>I Yarıil</th>
                <th>II Yarıil</th>
                <th>İllik</th>
                <th>Tapşırıq</th>
                <th>Qiymət</th>
              </tr>
            </thead>
            <tbody>
              {journal.records.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.student?.name || "-"}</td>
                  <td>{r.attendance || "-"}</td>
                  <td>
                    {r.term1?.summatives?.length > 0
                      ? r.term1.summatives.map((s, i) => (
                          <div key={i}>{s.score} ({s.grade})</div>
                        ))
                      : "-"}
                    <br />Ort.: {r.term1?.average ?? "-"} ({r.term1?.grade ?? "-"})
                    <br />BŞQ: {r.term1?.bsq?.score ?? "-"} ({r.term1?.bsq?.grade ?? "-"})
                  </td>
                  <td>
                    {r.term2?.summatives?.length > 0
                      ? r.term2.summatives.map((s, i) => (
                          <div key={i}>{s.score} ({s.grade})</div>
                        ))
                      : "-"}
                    <br />Ort.: {r.term2?.average ?? "-"} ({r.term2?.grade ?? "-"})
                    <br />BŞQ: {r.term2?.bsq?.score ?? "-"} ({r.term2?.bsq?.grade ?? "-"})
                  </td>
                  <td>{r.final?.score ?? "-"} ({r.final?.grade ?? "-"})</td>
                  <td>
                    {r.homework?.file ? (
                      <a href={`http://localhost:5000${r.homework.file}`} target="_blank" rel="noreferrer">📂 Bax</a>
                    ) : "-"}
                  </td>
                  <td>{r.homework?.grade != null ? r.homework.grade : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JournalTable;
